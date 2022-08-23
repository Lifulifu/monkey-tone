import React from 'react'
import { SOUNTFONT_INSTRUMENT_NAMES, DEFAULT_SETTING } from '../assets/constants'
import { InstrumentName } from 'soundfont-player';

import Accordion from './CustomAccordion'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AiTwotoneSetting } from 'react-icons/ai'
import { MdExpandMore, MdVolumeUp } from 'react-icons/md'

interface Props {
  defaultExpanded?: boolean,
  onBpmChange: (bpm: number) => any,
  onInstrumentNameChange: (instrumentName: InstrumentName | null) => any,
  onGainChange: (gain: number) => any
}

export default function PlaybackSettingForm({
  defaultExpanded,
  onBpmChange,
  onInstrumentNameChange,
  onGainChange
}: Props) {

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let n = parseInt(e.target.value);
    if (n <= 1 || isNaN(n)) n = DEFAULT_SETTING.playbackBpm;
    onBpmChange(n);
  }

  const handleInstrumentNameSelectionChanged = (
    e: React.SyntheticEvent<Element, Event>, value: InstrumentName | null) => {
    onInstrumentNameChange(value);
  }

  const handleGainChanged = (e: Event, value: number | number[]) => {
    onGainChange(value as number);
  }

  return (
    <Accordion defaultExpanded={defaultExpanded}>
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
              defaultValue={DEFAULT_SETTING.playbackBpm}
              onChange={handleBpmChange}
              inputProps={{ step: 10 }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete options={SOUNTFONT_INSTRUMENT_NAMES as InstrumentName[]}
              onChange={handleInstrumentNameSelectionChanged}
              defaultValue={DEFAULT_SETTING.playbackInstrumentName}
              renderInput={(params) =>
                <TextField {...params} label='Instrument' />
              } />
          </Grid>
          <Grid item xs={12} md={3} alignItems='center'>
            <Stack spacing={2} direction="row" alignItems="center">
              <MdVolumeUp size={30} />
              <Slider min={0} max={10} step={1} defaultValue={DEFAULT_SETTING.playbackGain}
                onChange={handleGainChanged} />
            </Stack>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
