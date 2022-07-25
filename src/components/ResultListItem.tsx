import React, { useRef, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Score from './Score'

interface Props {
  notes: number[],
}

export default function ResultListItem({ notes }: Props) {
  console.log('ResultListItem')
  return (
    <Box>
      <Score notes={notes.map(() => 'aa')} />
    </Box>
  )
}
