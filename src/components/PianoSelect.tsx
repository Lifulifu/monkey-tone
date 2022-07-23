import React from 'react'

import 'react-piano/dist/styles.css';
const { Piano, MidiNumbers } = require('react-piano');

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('e5'),
}

interface Props {
  onSelectionChanged?: (selectedNotes: number[]) => any,
  selectedNotes?: number[];
}

export default function PianoSelect(props: Props) {
  return (
    <Piano
      enableSelection
      playNote={() => null}
      stopNote={() => null}
      noteRange={noteRange}
      onSelectionChanged={props.onSelectionChanged}
      selectedNotes={props.selectedNotes} />
  )
}
