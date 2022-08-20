import React, { useState, useEffect, useRef, useContext } from 'react'
import PianoSelect from './PianoSelect';
import { MidiUtils, cartesianProduct, Note, NoteDuration } from '../util';
import { InstrumentContext, audioContext } from './InstrumentProvider';
import ResultListItem from './ResultListItem';
import { v4 as getId } from 'uuid';
import sample from 'lodash/sample';
import Soundfont from 'soundfont-player';
import { SOUNTFONT_INSTRUMENT_NAMES, NOTE_DURATION_OPTIONS } from '../assets/constants'

import Accordion from './CustomAccordion'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Autocomplete from '@mui/material/Autocomplete';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AiTwotoneSetting } from 'react-icons/ai'
import { BsFillDice5Fill } from 'react-icons/bs'
import { MdExpandMore, MdVolumeUp } from 'react-icons/md'

const { MidiNumbers } = require('react-piano');

interface SnackbarContent {
  severity: AlertColor,
  text: string
}

interface ResultItem {
  id: string,
  notes: Note[],
  isPlaying: boolean
}

interface NoteDurationItem {
  duration: string,
  imgUrl: string,
  checked: boolean
}

const PIANO_SELECT_MIN = MidiNumbers.fromNote('c4');
const PIANO_SELECT_MAX = MidiNumbers.fromNote('e6');
// ['c', 'c#', 'd' ...] X ['major', 'minor', ...]
const SCALE_OPTIONS = cartesianProduct(MidiUtils.PITCHES, Object.keys(MidiUtils.MODE_SEMITONE_STEPS))
  .map(([pitch, scaleType]) => ({ pitch, scaleType }))
const DEFAULT_NOTE_AMOUNT = 8;
const DEFAULT_BPM = 120;
const DEFAULT_INSTRUMENT_NAME: Soundfont.InstrumentName = 'acoustic_grand_piano';
const DEFAULT_NOTE_DURATION_CANDIDATE: Set<string> = new Set(['q.', 'q', '8']) as Set<string>;

export default function NotesSection() {

  const { instrument, setInstrumentName, setGain } = useContext(InstrumentContext);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<SnackbarContent>({ severity: 'warning', text: '' });
  const [resultItems, setResultItems] = useState<ResultItem[]>([]);
  const [noteDurationCandidates, setNoteDurationCandidates] = useState<NoteDurationItem[]>(
    NOTE_DURATION_OPTIONS.map(({ name, img }) => ({
      duration: name,
      imgUrl: img,
      checked: DEFAULT_NOTE_DURATION_CANDIDATE.has(name)
    }))
  );

  // -- generate --
  const [noteAmount, setNoteAmount] = useState<number>(DEFAULT_NOTE_AMOUNT);
  const [noteCandidates, setNoteCandidates] = useState<number[]>([]);

  // -- playback --
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const playEndCallbackTimer = useRef<number>(0);
  const playNotes = (notes: Note[], callback?: Function) => {
    if (!instrument) return;
    instrument.stop();

    const noteDuration = 60 / bpm;
    const scheduledNotes = [];
    let currTime = 0;
    for (let i = 0; i < notes.length; i++) {
      scheduledNotes.push({
        time: currTime,
        note: notes[i].note
      })
      currTime += noteDuration * MidiUtils.NOTE_DURATIONS[notes[i].duration];
    }
    instrument.schedule(audioContext.currentTime, scheduledNotes)

    if (callback) {
      playEndCallbackTimer.current = setTimeout(callback, 1000 * notes.length * noteDuration)
    }
  }

  const setItemIsPlaying = (targetId: string) => {
    setResultItems((resultItems) => resultItems.map(({ id, isPlaying, ...rest }) => {
      if (id === targetId)
        return { id, isPlaying: true, ...rest };
      else
        return { id, isPlaying: false, ...rest };
    }))
  }

  const setItemsIsPlayingFalse = () => {
    setResultItems((resultItems) => resultItems.map(({ id, isPlaying, ...rest }) => {
      return { id, isPlaying: false, ...rest }
    }))
  }

  // -- handlers --
  const handleNoteSelectionChangedManual = (selectedNotes: number[]) => {
    setNoteCandidates(selectedNotes);
  }

  const handleNoteSelectionChangedScale = (e: React.SyntheticEvent<Element, Event>, value: string | null) => {
    if (!value) return
    const [pitch, scale] = value.split(' ')
    const result = MidiUtils.scaleToMidiNumbers(pitch, scale);
    if (result)
      setNoteCandidates(MidiUtils.clipMidiRange(result, PIANO_SELECT_MIN, PIANO_SELECT_MAX));
  }

  const handleNoteSelectionChangedAll = (e: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    if (checked) setNoteCandidates(MidiUtils.getMidiRange(PIANO_SELECT_MIN, PIANO_SELECT_MAX));
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

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  }

  const handleGenerateClicked = () => {
    if (noteCandidates.length === 0) {
      openNewSnackbar('error', 'Select at least 1 candidate note');
      return;
    }
    const notes: Note[] = new Array(noteAmount).fill(0).map(() => {
      return {
        note: sample(noteCandidates)!,
        duration: 'q'
      }
    });
    const itemId = getId();

    setResultItems([
      { id: itemId, notes, isPlaying: true },  // newly added item, auto playback
      ...resultItems.map(({ isPlaying, ...rest }) => ({ isPlaying: false, ...rest }))  // other items, stop playback
    ]);
    clearTimeout(playEndCallbackTimer.current);
    playNotes(notes, setItemsIsPlayingFalse);
  }

  const handleBpmChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    let n = parseInt(e.target.value);
    if (n <= 0 || isNaN(n)) n = DEFAULT_BPM;
    setBpm(n);
  }

  const handleGainChanged = (e: Event, value: number | number[]) => {
    if (!setGain) return;
    setGain(value as number);
  }

  const handleInstrumentNameSelectionChanged = (
    e: React.SyntheticEvent<Element, Event>, value: Soundfont.InstrumentName | null) => {
    if (setInstrumentName && value)
      setInstrumentName(value);
  }

  const handleItemPlayStart = (id: string, notes: Note[]) => {
    setItemIsPlaying(id);
    clearTimeout(playEndCallbackTimer.current);
    playNotes(notes, setItemsIsPlayingFalse);
  }

  const handleItemApplyBeats = (targetId: string) => {
    setResultItems((resultItems) => resultItems.map((item) => {
      const { id, notes, ...rest } = item;
      if (id !== targetId)
        return item;

      // apply random beats to the notes
      const candidates = noteDurationCandidates
        .filter(({ checked }) => checked)  // sample from only the checked ones
        .map(({ duration }) => duration);
      const newNotes: Note[] = notes.map(({ note }) => {
        return {
          note,
          duration: sample(candidates) as NoteDuration
        }
      })

      return { id, notes: newNotes, ...rest }
    }))
  }

  const handleItemDelete = (targetId: string) => {
    setResultItems((resultItems) => resultItems.filter(({ id }) => id !== targetId))
  }

  const handleNoteDurationCandidateChange = (checked: boolean, duration: string) => {
    setNoteDurationCandidates((ori) => ori.map((item) => {
      if (item.duration === duration) {
        return {
          duration,
          checked,
          imgUrl: item.imgUrl
        }
      }
      return item;
    }))
  }

  return (
    <Stack direction='column' spacing='1em'>

      {/* config section */}
      <Paper elevation={0} sx={{ overflow: 'hidden' }}>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<MdExpandMore size={30} />}>
            <Stack direction='row' alignItems='center'>
              <AiTwotoneSetting />
              <Typography variant='subtitle1' ml='0.5em'>Generate Settings</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing='1em' alignItems='center'>
              <Grid item xs={12} md={3}>
                <TextField type='number' label='Amount' fullWidth
                  value={noteAmount} onChange={handleNoteAmountChanged} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Autocomplete options={
                  SCALE_OPTIONS.map(({ pitch, scaleType }) => `${pitch.toUpperCase()} ${scaleType}`)}
                  onChange={handleNoteSelectionChangedScale} renderInput={(params) =>
                    <TextField {...params} label='Scale' />
                  } />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel label='Select all'
                  onChange={handleNoteSelectionChangedAll}
                  control={<Checkbox />} />
              </Grid>
              <Grid item xs={12} height='4em'>
                <PianoSelect
                  noteRange={{
                    first: PIANO_SELECT_MIN,
                    last: PIANO_SELECT_MAX
                  }}
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
        <Paper elevation={0} >
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
                  <Grid item xs={12} md={3}>
                    <Autocomplete options={SOUNTFONT_INSTRUMENT_NAMES as Soundfont.InstrumentName[]}
                      onChange={handleInstrumentNameSelectionChanged}
                      defaultValue={DEFAULT_INSTRUMENT_NAME}
                      renderInput={(params) =>
                        <TextField {...params} label='Instrument' />
                      } />
                  </Grid>
                  <Grid item xs={12} md={3} alignItems='center'>
                    <Stack spacing={2} direction="row" alignItems="center">
                      <MdVolumeUp size={30} />
                      <Slider min={0} max={10} step={1} defaultValue={5}
                        onChange={handleGainChanged} />
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={false} sx={{ border: 'none' }}>
              <AccordionSummary expandIcon={<MdExpandMore size={30} />}>
                <Stack direction='row' alignItems='center'>
                  <AiTwotoneSetting />
                  <Typography variant='subtitle1' ml='0.5em'>Beat Settings</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  <Grid container>
                    {
                      noteDurationCandidates.map(({ duration, imgUrl, checked }) => (
                        <Grid item xs={2} md={1}>
                          <FormControlLabel
                            key={duration}
                            onChange={(_, checked) => handleNoteDurationCandidateChange(checked, duration)}
                            label={<img src={imgUrl} height='30px' />}
                            labelPlacement='top'
                            control={<Checkbox checked={checked} />} />
                        </Grid>
                      ))
                    }
                  </Grid>
                </FormGroup>
              </AccordionDetails>

            </Accordion>
            {
              resultItems.map((item) => (
                <ResultListItem
                  key={item.id}
                  notes={item.notes}
                  isPlaying={item.isPlaying}
                  onPlayStart={() => handleItemPlayStart(item.id, item.notes)}
                  onApplyBeats={() => handleItemApplyBeats(item.id)}
                  onDelete={() => handleItemDelete(item.id)}
                />
              ))
            }
          </Stack>
        </Paper>
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
