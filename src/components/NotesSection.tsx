import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import 'react-piano/dist/styles.css';
const { Piano, MidiNumbers } = require('react-piano');

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('e5'),
}

export default function NotesSection() {

  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const handleSelectionChanged = (selectedNotes: string[]) => {
    setSelectedNotes(selectedNotes);
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h3'>
          Notes
        </Typography>
        <Divider orientation='horizontal' />
        <Stack height={60} direction='row' alignItems='center'>
          <Typography variant='subtitle1'>
            candidates
          </Typography>
          <Piano
            enableSelection
            playNote={() => null}
            stopNote={() => null}
            noteRange={noteRange}
            onSelectionChanged={handleSelectionChanged}
            selectedNotes={selectedNotes} />
        </Stack>
        <TextField type='number' label='Amount' />
        <Divider orientation='horizontal' />
        <Button variant='contained' size='large'>Generate</Button>

      </CardContent>
    </Card>
  )
}
