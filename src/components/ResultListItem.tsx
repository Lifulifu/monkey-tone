import React, { useRef, useEffect, useState, useContext } from 'react'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import { MdPlayCircleFilled, MdClose } from 'react-icons/md'
import { FaDrum } from 'react-icons/fa'

import Score from './Score'
import { Note } from '../util'

interface Props {
  notes: Note[],
  isPlaying: boolean,
  onPlayStart: Function,
  onApplyBeats: Function,
  onDelete: Function
}

export default function ResultListItem({ notes, isPlaying, onPlayStart, onApplyBeats, onDelete }: Props) {

  return (
    <ListItem sx={{ display: 'flex' }}>
      <IconButton size='large' sx={{ mr: '0.5em' }}
        onClick={() => onPlayStart()}>
        <MdPlayCircleFilled color={isPlaying ? 'green' : 'gray'} />
      </IconButton>
      <IconButton size='large' sx={{ mr: '0.5em' }}
        onClick={() => onApplyBeats()}>
        <FaDrum color={isPlaying ? 'green' : 'gray'} />
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
