import { Stave, StaveNote, Beam, Formatter, Renderer, Voice, Accidental, Vex } from 'vexflow'

interface Pitch {
  name: string,
  octave: number,
}

function* cyclicIter(arr: any[]) {
  let i = 0;
  while (true) {
    yield arr[i];
    ++i;
    if (i >= arr.length)
      i = 0;
  }
}

export function cartesianProduct<T>(...allEntries: T[][]): T[][] {
  return allEntries.reduce<T[][]>(
    (results, entries) =>
      results
        .map(result => entries.map(entry => [...result, entry]))
        .reduce((subResults, result) => [...subResults, ...result], []),
    [[]]
  )
}

export type NoteDuration = 'q' | 'h' | '16' | '8';

export interface Note {
  note: number,
  duration: NoteDuration
}

class MidiUtils {

  static MAX_MIDI_NUM = 127;
  static PITCHES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  // enforce key type to be string to suppress TS error
  static MODE_SEMITONE_STEPS: { [key: string]: number[] } = {
    major: [2, 2, 1, 2, 2, 2, 1],
    minor: [2, 1, 2, 2, 1, 2, 2],
    diminished: [1, 2, 1, 2, 1, 2, 1, 2]
  }
  static NOTE_DURATIONS: { [k: string]: number } = {
    'h.': 3,
    'h': 2,
    'q.': 1.5,
    'q': 1,
    '8.': 3 / 4,
    '8': 1 / 2,
    '16.': 3 / 8,
    '16': 1 / 4
  }

  static midiNumToPitch(n: number): Pitch {
    return {
      name: this.PITCHES[n % 12],
      octave: Math.floor(n / 12) - 1  // 12 = 'C0'
    }
  }

  static scaleToMidiNumbers(pitch: string, scaleType: string): (number[] | null) {
    const start = this.PITCHES.indexOf(pitch.toLowerCase());
    if (start === -1)
      return null;

    const result = [];
    const gen = cyclicIter(this.MODE_SEMITONE_STEPS[scaleType]);
    let curr = start;
    while (curr <= this.MAX_MIDI_NUM) {
      result.push(curr)
      curr += gen.next().value;
    }

    return result;
  }

  static getMidiRange(min: number, max: number): number[] {
    max = Math.min(max, this.MAX_MIDI_NUM);
    min = Math.max(min, 0);
    return Array.from(Array(max - min + 1).keys()).map(n => n + min);
  }

  static clipMidiRange(notes: number[], min: number, max: number) {
    // filter out midi notes that are out of range
    return notes.filter((n) => (n >= min && n <= max));
  }

}

class ScoreUtils {

  static renderScore(
    container: HTMLDivElement,
    notes: Note[],
    widthPerNote: number,
    clef?: string
  ) {
    const MIN_SCORE_WIDTH = 100;
    const PADDING_WIDTH = 5;

    const totalWidth = Math.max(MIN_SCORE_WIDTH, widthPerNote * notes.length + 2 * PADDING_WIDTH); const renderer = new Renderer(container, Renderer.Backends.SVG);
    const context = renderer.getContext();
    const staveWidth = totalWidth - 2 * PADDING_WIDTH;
    const stave = new Stave(PADDING_WIDTH, 0, staveWidth);
    if (clef) {
      stave.addClef(clef);
    }
    const noteStartX = stave.getNoteStartX();

    // certer stave vertically within svg
    const newHeight = 2 * Math.floor(
      stave.getTopLineTopY() + (stave.getBottomLineBottomY() - stave.getTopLineTopY()) / 2
    )
    renderer.resize(totalWidth, newHeight);
    stave.setContext(context).draw();

    if (notes.length === 0) // draw stave but no notes
      return;

    // draw notes
    const staveNotes = notes.map((note) => {
      const { name, octave } = MidiUtils.midiNumToPitch(note.note);
      const staveNote = new StaveNote({
        keys: [`${name}/${octave}`],
        duration: note.duration.replace('.', ''),
        auto_stem: true
      })
      if (name.endsWith('#')) {
        staveNote.addModifier(new Accidental('#'));
      }
      if (note.duration.endsWith('.')) {
        staveNote.addModifier(new Vex.Flow.Dot());
      }
      return staveNote;
    })

    const voice = new Voice({ num_beats: notes.length, beat_value: 4 });
    voice.setStrict(false);
    voice.addTickables(staveNotes);
    new Formatter().joinVoices([voice]).format([voice], staveWidth - noteStartX - PADDING_WIDTH);
    voice.draw(context, stave);
  }

}

export { MidiUtils, ScoreUtils };
