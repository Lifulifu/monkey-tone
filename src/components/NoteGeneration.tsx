import React, { useState, useEffect, useRef, useContext } from 'react'
import NoteGenerationSettingForm from './NoteGenerationSettingForm';
import PlaybackSettingForm from './PlaybackSettingForm';
import BeatSettingForm from './BeatSettingForm';

import { MidiUtils, Note, NoteDuration } from '../util';
import { InstrumentContext, audioContext } from './InstrumentProvider';
import ResultListItem from './ResultListItem';
import { v4 as getId } from 'uuid';
import sample from 'lodash/sample';
import { DEFAULT_SETTING } from '../assets/constants'

import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography'
import { BsFillDice5Fill } from 'react-icons/bs'

interface ResultItem {
  id: string,
  notes: Note[],
  isPlaying: boolean
}

interface SnackbarContent {
  severity: AlertColor,
  text: string
}

export default function NotesSection() {

  // note generation settings
  const [noteAmount, setNoteAmount] = useState(DEFAULT_SETTING.noteAmount);
  const [noteCandidates, setNoteCandidates] = useState(DEFAULT_SETTING.noteCandidates);

  // beat settings
  const [noteDurationCandidates, setNoteDurationCandidates] = useState<string[]>(DEFAULT_SETTING.noteDurationCondidates);

  // playback settings
  const [bpm, setBpm] = useState(DEFAULT_SETTING.playbackBpm);
  const { instrument, setInstrumentName, setGain } = useContext(InstrumentContext);

  const [resultItems, setResultItems] = useState<ResultItem[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarContent, setSnackbarContent] = useState<SnackbarContent>({ severity: 'warning', text: '' });

  // generate result items
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

  // result item controls
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
      const newNotes: Note[] = notes.map(({ note }) => {
        return {
          note,
          duration: sample(noteDurationCandidates) as NoteDuration
        }
      })
      return { id, notes: newNotes, ...rest }
    }))
  }

  const handleItemDelete = (targetId: string) => {
    setResultItems((resultItems) => resultItems.filter(({ id }) => id !== targetId))
  }

  // snack bar controls
  const openNewSnackbar = (severity: AlertColor, text: string) => {
    setSnackbarContent({ severity, text });
    setOpenSnackbar(true);
  }

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  }

  return (
    <Stack direction='column' spacing='1em'>

      {/* config section */}
      <Paper elevation={0} sx={{ overflow: 'hidden' }}>

        <NoteGenerationSettingForm
          defaultExpanded={true}
          onNoteAmountChange={(val) => setNoteAmount(val)}
          onNoteCandidatesChange={(val) => setNoteCandidates(val)} />

        <BeatSettingForm
          defaultExpanded={false}
          onNoteDurationCandidatesChange={(val) => setNoteDurationCandidates(val)}
        />

        <PlaybackSettingForm
          defaultExpanded={false}
          onBpmChange={(val) => setBpm(val)}
          onGainChange={(val) => setGain?.(val)}
          onInstrumentNameChange={(val) => setInstrumentName?.(val)} />

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
