import React, { useState } from 'react'

import Accordion from './CustomAccordion'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import { MdExpandMore } from 'react-icons/md'
import { AiTwotoneSetting } from 'react-icons/ai'
import ResultListItem from './ResultListItem';
import Soundfont from 'soundfont-player';

export interface ResultItem {
  id: string,
  notes: number[], // midi numbers
}

interface Props {
  items: ResultItem[],
  instrument: Soundfont.Player | null,
  audioContext: AudioContext
}

const DEFAULT_BPM = 120;

export default function ResultList({ items, audioContext, instrument, ...otherProps }: Props) {

  const [bpm, setBpm] = useState<number>(DEFAULT_BPM)

  const handleBpmChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    let n = parseInt(e.target.value);
    if (n <= 0 || isNaN(n)) n = DEFAULT_BPM;
    setBpm(n);
  }

  return (
    <Paper elevation={0} {...otherProps}>
      <Stack direction='column' divider={<Divider orientation='horizontal' />}>
        <Box textAlign='center' py='1em'>
          <Typography variant='h4' color='grey.700'>
            Results
          </Typography>
        </Box>
        <Accordion defaultExpanded={false} sx={{ border: 'none' }}>
          <AccordionSummary expandIcon={<MdExpandMore size={30} />}>
            <Stack direction='row' alignItems='center'>
              <AiTwotoneSetting />
              <Typography variant='subtitle1' ml='0.5em'>Playback Settings</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>

            <Grid container spacing='1em' alignItems='center'>
              <Grid item xs={12} md={3}>
                <TextField type='number' label='BPM' fullWidth
                  value={bpm} onChange={handleBpmChanged}
                  inputProps={{ step: 10 }} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        {
          items.map((item) => (
            <ResultListItem key={item.id} notes={item.notes} noteDuration={60 / bpm}
              audioContext={audioContext} instrument={instrument} />
          ))
        }
      </Stack>
    </Paper>
  )
}
