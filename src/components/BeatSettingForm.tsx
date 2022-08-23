import React, { useState } from 'react'

import { NOTE_DURATION_OPTIONS, DEFAULT_SETTING } from '../assets/constants'

import Accordion from './CustomAccordion'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { AiTwotoneSetting } from 'react-icons/ai'
import { MdExpandMore } from 'react-icons/md'

export interface NoteDurationItem {
  duration: string,
  imgUrl: string,
  checked: boolean
}

interface Props {
  defaultExpanded?: boolean,
  onNoteDurationCandidatesChange: (durationCandidates: string[]) => any
}

export default function BeatSettingForm({
  defaultExpanded,
  onNoteDurationCandidatesChange
}: Props) {

  const [noteDurationOptions, setNoteDurationOptions] = useState<NoteDurationItem[]>(
    NOTE_DURATION_OPTIONS.map(({ name, img }) => ({
      duration: name,
      imgUrl: img,
      checked: DEFAULT_SETTING.noteDurationCondidates.includes(name)
    })))

  const handleNoteDurationCandidateChange = (checked: boolean, duration: string) => {
    // update local state
    const newState = noteDurationOptions.map((item) => {
      if (item.duration === duration) {
        return { duration, checked, imgUrl: item.imgUrl }
      }
      return item;
    })
    setNoteDurationOptions(newState);

    // pass to parent
    onNoteDurationCandidatesChange(
      newState
        .filter(({ checked }) => checked)
        .map(({ duration }) => duration));
  }

  return (
    <Accordion defaultExpanded={defaultExpanded} >
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
              noteDurationOptions.map(({ duration, imgUrl, checked }) => (
                <Grid item xs={2} md={1} key={duration}>
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
    </Accordion >
  )
}
