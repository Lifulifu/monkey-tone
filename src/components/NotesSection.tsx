import React, { useState } from 'react'
import PianoSelect from './PianoSelect';
import ResultList from './ResultList';
import { presetToMidiNumbers } from '../util';

import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/material/styles/useTheme';

import { AiTwotoneSetting } from 'react-icons/ai'
import { BsFillDice5Fill } from 'react-icons/bs'
import { GiGClef } from 'react-icons/gi'
import { MdExpandMore } from 'react-icons/md'
import { jsx, ThemeProvider } from '@emotion/react';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderTop: `1px solid ${theme.palette.divider}`,
}));


export default function NotesSection() {

  const theme = useTheme();
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);

  const [resultItems, setResultItems] = useState<number[]>([]);

  const handleNoteSelectionChangedManual = (selectedNotes: number[]) => {
    setSelectedNotes(selectedNotes);
  }
  const handleNoteSelectionChangedPresets = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    console.log(value);
    setSelectedNotes(presetToMidiNumbers(value));
  }

  return (
    <Box>

      {/* config section */}
      <Paper elevation={0}>
        <Stack
          py='1em'
          direction='row' alignItems='center'
          spacing={1} justifyContent='center' >
          <GiGClef size={30} color={theme.palette.grey[700]} />
          <Typography variant='h4' color={theme.palette.grey[700]}>
            Notes
          </Typography>
        </Stack>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<MdExpandMore size={30} />}>
            <Stack direction='row' alignItems='center'>
              <AiTwotoneSetting />
              <Typography variant='subtitle1' ml='0.5em'>Settings</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing='1em' alignItems='center'>
              <Grid item xs={12} md={3}>
                <TextField type='number' label='Amount' fullWidth defaultValue={8} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Autocomplete options={['C major', 'C minor']} defaultValue='C major' renderInput={(params) =>
                  <TextField {...params} label='Presets' />
                } />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl>
                  <RadioGroup row
                    defaultValue='none'
                    onChange={handleNoteSelectionChangedPresets}>
                    <FormControlLabel label='none' value='none' control={<Radio />} />
                    <FormControlLabel label='all' value='all' control={<Radio />} />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} height='4em'>
                <PianoSelect
                  selectedNotes={selectedNotes}
                  onSelectionChanged={handleNoteSelectionChangedManual} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Stack justifyContent='center' sx={{ px: '16px', py: '24px' }}>
          <Button startIcon={<BsFillDice5Fill />}
            variant='contained' size='large' disableElevation>Generate</Button>
        </Stack>
      </Paper>

      {/* result section */}
      {
        resultItems.length > 0 && (
          <ResultList>
            {

            }
          </ResultList>
        )
      }

    </Box>
  )
}
