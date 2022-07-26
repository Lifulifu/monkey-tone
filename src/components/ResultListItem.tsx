import React, { useRef, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import Score from './Score'

interface Props {
  notes: number[],
}

export default function ResultListItem({ notes }: Props) {
  return (
    <ListItem sx={{ overflowX: 'auto' }}>
      <Score height={150} notes={notes} clef={'treble'} />
    </ListItem>
  )
}
