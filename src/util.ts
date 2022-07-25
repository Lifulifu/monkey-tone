
class MidiUtils {

  static MAX_MIDI_NUM = 127;

  static modeToMidiNumbers(presetName: string): number[] {
    return [48, 76];
  }

  static getAllMidiNumbers(): number[] {
    return Array.from(Array(this.MAX_MIDI_NUM + 1).keys())
  }

}


export { MidiUtils };