import React, { useRef, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import { MdPlayCircleFilled } from 'react-icons/md'

import Soundfont from 'soundfont-player';
import Score from './Score'

interface Props {
  notes: number[],
  noteDuration: number,
  instrument: Soundfont.Player | null,
  audioContext: AudioContext
}

export default function ResultListItem({ notes, noteDuration, instrument, audioContext }: Props) {

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayButtonClicked = () => {
    if (!instrument) return;
    instrument.schedule(
      audioContext.currentTime,
      notes.map((midiNum, i) => ({
        time: i * noteDuration,
        note: midiNum
      }))
    )
  }

  return (
    <ListItem sx={{ overflowX: 'auto' }}>
      <IconButton size='large' sx={{ mr: '0.5em' }}
        onClick={handlePlayButtonClicked}>
        <MdPlayCircleFilled />
      </IconButton>
      <Score notes={notes} clef={'treble'} />
    </ListItem>
  )
}
