import React, { useState } from 'react'
import PianoSelect from './PianoSelect';
import ResultList from './ResultList';
import ResultListItem from './ResultListItem';
import { MidiUtils } from '../util';

import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Autocomplete from '@mui/material/Autocomplete';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/material/styles/useTheme';
import { v4 as getId } from 'uuid';
import sample from 'lodash/sample';

import { AiTwotoneSetting } from 'react-icons/ai'
import { BsFillDice5Fill } from 'react-icons/bs'
import { GiGClef } from 'react-icons/gi'
import { MdExpandMore } from 'react-icons/md'

interface ResultItem {
  id: string,
  notes: number[], // midi numbers
}

interface SnackbarContent {
  severity: AlertColor,
  text: string
}

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
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<SnackbarContent>({ severity: 'warning', text: '' });
  const [noteAmount, setNoteAmount] = useState<number>(8);
  const [noteCandidates, setNoteCandidates] = useState<number[]>([]);
  const [resultItems, setResultItems] = useState<ResultItem[]>([]);

  const handleNoteSelectionChangedManual = (selectedNotes: number[]) => {
    setNoteCandidates(selectedNotes);
  }
  const handleNoteSelectionChangedMode = (e: React.SyntheticEvent<Element, Event>, value: string | null) => {
    setNoteCandidates(MidiUtils.modeToMidiNumbers(value ? value : ''));
  }

  const handleNoteSelectionChangedAll = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    if (checked) setNoteCandidates(MidiUtils.getAllMidiNumbers());
    else setNoteCandidates([]);
  }

  const handleNoteAmountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    let n = parseInt(e.target.value);
    if (n <= 1 || isNaN(n)) n = 1;
    if (n >= 64) n = 64;
    setNoteAmount(n);
  }

  const openNewSnackbar = (severity: AlertColor, text: string) => {
    setSnackbarContent({ severity, text });
    setOpenSnackbar(true);
  }

  const handleGenerateClicked = () => {
    if (noteCandidates.length === 0) {
      openNewSnackbar('error', 'Select at least 1 candidate note');
      return;
    }
    const notes: number[] = new Array(noteAmount).fill(0).map(() => sample(noteCandidates)!);
    setResultItems([{ id: getId(), notes }, ...resultItems]);  // front is newest
  }

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  }

  return (
    <Stack direction='column' spacing='1em'>

      {/* config section */}
      <Paper elevation={0}>
        <Stack
          py='1em'
          direction='row' alignItems='center'
          spacing={2} justifyContent='center' >
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
                <TextField type='number' label='Amount' fullWidth
                  value={noteAmount} onChange={handleNoteAmountChanged} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Autocomplete options={['C major', 'C minor']}
                  onChange={handleNoteSelectionChangedMode} renderInput={(params) =>
                    <TextField {...params} label='Modes' />
                  } />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel label='Select all'
                  onChange={handleNoteSelectionChangedAll}
                  control={<Checkbox />} />
              </Grid>
              <Grid item xs={12} height='4em'>
                <PianoSelect
                  selectedNotes={noteCandidates}
                  onSelectionChanged={handleNoteSelectionChangedManual} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Stack justifyContent='center' sx={{ px: '16px', py: '24px' }}>
          <Button startIcon={<BsFillDice5Fill />} variant='contained' size='large'
            disableElevation onClick={handleGenerateClicked}>
            Generate
          </Button>
        </Stack>
      </Paper>

      {/* result section */}
      {
        resultItems.length > 0 &&
        <ResultList>
          {
            resultItems.map((item) => (
              <ResultListItem key={item.id} notes={item.notes} />
            ))
          }
        </ResultList>
      }

      {/* snackbar for info / warning / error */}
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert severity={snackbarContent.severity} onClose={handleSnackbarClose}>
          {snackbarContent.text}
        </Alert>
      </Snackbar>

    </Stack>
  )
}
