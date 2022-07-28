import React, { useRef, useEffect, useState, useContext } from 'react'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import { MdPlayCircleFilled } from 'react-icons/md'
import { InstrumentContext } from './InstrumentProvider'

import Score from './Score'

interface Props {
  notes: number[],
  isPlaying: boolean,
  onPlayStart: Function,
}

export default function ResultListItem({ notes, isPlaying, onPlayStart }: Props) {

  const handlePlayButtonClicked = () => {
    onPlayStart();
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
