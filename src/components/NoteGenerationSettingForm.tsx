import React, { useState } from 'react'
import PianoSelect from './PianoSelect';
import { MidiUtils, cartesianProduct } from '../util';
import { DEFAULT_SETTING } from '../assets/constants';

import Accordion from './CustomAccordion'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AiTwotoneSetting } from 'react-icons/ai'
import { MdExpandMore } from 'react-icons/md'

interface Props {
  defaultExpanded?: boolean,
  onNoteAmountChange: (noteAmount: number) => any,
  onNoteCandidatesChange: (candidates: number[]) => any
}

// ['c', 'c#', 'd' ...] X ['major', 'minor', ...]
const SCALE_OPTIONS = cartesianProduct(MidiUtils.PITCHES, Object.keys(MidiUtils.MODE_SEMITONE_STEPS))
  .map(([pitch, scaleType]) => ({ pitch, scaleType }))

export default function NoteGenerationSettingForm({ defaultExpanded, onNoteAmountChange, onNoteCandidatesChange }: Props) {

  const [noteCandidates, setNoteCandidates] = useState<number[]>([]);
  const changeNoteCandidates = (notes: number[]) => {
    setNoteCandidates(notes);  // update local state
    onNoteCandidatesChange(notes);  // pass to parent component
  }

  const handleNoteSelectionChangedManual = (selectedNotes: number[]) => {
    changeNoteCandidates(selectedNotes);
  }

  const handleNoteSelectionChangedScale = (e: React.SyntheticEvent<Element, Event>, value: string | null) => {
    if (!value) return
    const [pitch, scale] = value.split(' ')
    const result = MidiUtils.scaleToMidiNumbers(pitch, scale);
    if (result)
      changeNoteCandidates(MidiUtils.clipMidiRange(result,
        DEFAULT_SETTING.pianoSelectMin,
        DEFAULT_SETTING.pianoSelectMax));
  }

  const handleNoteSelectionChangedAll = (e: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    if (checked) changeNoteCandidates(MidiUtils.getMidiRange(DEFAULT_SETTING.pianoSelectMin, DEFAULT_SETTING.pianoSelectMax));
    else changeNoteCandidates([]);
  }

  const handleNoteAmountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    let n = parseInt(e.target.value);
    if (n < 1 || isNaN(n)) n = 1;
    if (n > 64) n = 64;
    onNoteAmountChange(n);
  }

  return (
    <Accordion defaultExpanded={defaultExpanded}>
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
              defaultValue={DEFAULT_SETTING.noteAmount}
              onChange={handleNoteAmountChanged} />
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
                first: DEFAULT_SETTING.pianoSelectMin,
                last: DEFAULT_SETTING.pianoSelectMax,
              }}
              selectedNotes={noteCandidates}
              onSelectionChanged={handleNoteSelectionChangedManual} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
