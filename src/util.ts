import { Stave, StaveNote, Beam, Formatter, Renderer, Voice, Accidental } from 'vexflow'

interface Pitch {
  name: string,
  octave: number,
}

class MidiUtils {

  static MAX_MIDI_NUM = 127;

  static midiNumToPitch(n: number): Pitch {
    const pitches = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    return {
      name: pitches[n % 12],
      octave: Math.floor(n / 12) - 1  // 12 = 'C0'
    }
  }

  static modeToMidiNumbers(presetName: string): number[] {
    return [48, 76];
  }

  static getMidiRange(min: number, max: number): number[] {
    max = Math.min(max, this.MAX_MIDI_NUM);
    min = Math.max(min, 0);
    return Array.from(Array(max - min + 1).keys()).map(n => n + min);
  }

}


class ScoreUtils {

  static renderScore(
    container: HTMLDivElement,
    midiNums: number[],
    widthPerNote: number,
    height: number,
    clef?: string
  ) {
    const paddingWidth = 5;
    const totalWidth = widthPerNote * midiNums.length + 2 * paddingWidth;
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(totalWidth, height)
    const context = renderer.getContext();
    const staveWidth = totalWidth - 2 * paddingWidth;

    const stave = new Stave(paddingWidth, -5, staveWidth);
    if (clef) {
      stave.addClef(clef);
    }
    stave.setContext(context).draw();

    if (midiNums.length === 0)
      return;

    const notes = midiNums.map((midiNum) => {
      const { name, octave } = MidiUtils.midiNumToPitch(midiNum);
      const note = new StaveNote({
        keys: [`${name}/${octave}`],
        duration: 'q',
        auto_stem: true
      })
      if (name.endsWith('#')) {
        note.addModifier(new Accidental('#'));
      }
      return note;
    })

    const voice = new Voice({ num_beats: midiNums.length, beat_value: 4 });
    voice.addTickables(notes);
    new Formatter().joinVoices([voice]).format([voice], staveWidth);
    voice.draw(context, stave);
  }

}


export { MidiUtils, ScoreUtils };