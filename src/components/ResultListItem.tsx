import React, { useRef, useEffect, useState, useContext } from 'react'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { MdPlayCircleFilled, MdClose } from 'react-icons/md'
import { InstrumentContext } from './InstrumentProvider'

import Score from './Score'

interface Props {
  notes: number[],
  isPlaying: boolean,
  onPlayStart: Function,
  onDelete: Function
}

export default function ResultListItem({ notes, isPlaying, onPlayStart, onDelete }: Props) {

  return (
    <ListItem sx={{ display: 'flex' }}>
      <IconButton size='large' sx={{ mr: '0.5em' }}
        onClick={() => onPlayStart()}>
        <MdPlayCircleFilled color={isPlaying ? 'green' : 'gray'} />
      </IconButton>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Score notes={notes} clef={'treble'} />
      </Box>
      <IconButton
        onClick={() => onDelete()}>
        <MdClose color='gray' size={20} />
      </IconButton>
    </ListItem>
  )
}
