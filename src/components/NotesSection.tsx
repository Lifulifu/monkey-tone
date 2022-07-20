import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import 'react-piano/dist/styles.css';
const { Piano, MidiNumbers } = require('react-piano');

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f5'),
}

export default function NotesSection() {

  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const handleSelectionChanged = (selectedNotes: string[]) => {
    console.log(selectedNotes);
  }

  return (
    <Card>
      <CardContent>
        <Box height={100}>
          <Piano
            enableSelection
            playNote={() => null}
            stopNote={() => null}
            noteRange={noteRange}
            onSelectionChanged={handleSelectionChanged}
            selectedNotes={selectedNotes} />
        </Box>
        <Typography variant='h3'>
          title
        </Typography>
        <Typography variant='body1'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio consequuntur quisquam voluptates, numquam aut dolorem soluta facilis culpa? Praesentium perferendis labore autem quisquam? Accusantium quaerat suscipit eligendi deleniti porro excepturi ratione impedit vel hic commodi, eaque reiciendis magni? Alias aspernatur quisquam exercitationem sit omnis odit numquam praesentium velit laborum nemo?
        </Typography>

      </CardContent>
    </Card>
  )
}
