import React, { useRef, useEffect, useState, useContext } from 'react'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import { MdPlayCircleFilled } from 'react-icons/md'
import { InstrumentContext } from './InstrumentProvider'

import Score from './Score'

interface Props {
  notes: number[],
  playNotes: (notes: number[], callback: Function) => void
}

export default function ResultListItem({ notes, playNotes }: Props) {

  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlayButtonClicked = () => {
    playNotes(notes, () => setIsPlaying(false));
    setIsPlaying(true);
  }

  return (
    <ListItem sx={{ overflowX: 'auto' }}>
      <IconButton size='large' sx={{ mr: '0.5em' }}
        onClick={handlePlayButtonClicked}>
        <MdPlayCircleFilled color={isPlaying ? 'green' : 'gray'} />
      </IconButton>
      <Score notes={notes} clef={'treble'} />
    </ListItem>
  )
}
