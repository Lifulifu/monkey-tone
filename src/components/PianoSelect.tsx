import React from 'react'

import 'react-piano/dist/styles.css';
const { Piano } = require('react-piano');


interface Props {
  onSelectionChanged?: (selectedNotes: number[]) => any,
  selectedNotes?: number[];
  noteRange: {
    first: number, last: number
  }
}

export default function PianoSelect(props: Props) {
  return (
    <Piano
      enableSelection
      playNote={() => null}
      stopNote={() => null}
      noteRange={props.noteRange}
      onSelectionChanged={props.onSelectionChanged}
      selectedNotes={props.selectedNotes} />
  )
}
