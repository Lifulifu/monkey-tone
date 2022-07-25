import React from 'react'

import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

interface Props {
  children: React.ReactNode,
  [x: string]: any
}

export default function ResultList({ children, ...otherProps }: Props) {
  return (
    <Paper elevation={0} {...otherProps}>
      <Stack direction='column' divider={<Divider orientation='horizontal' />}>
        <Box textAlign='center' py='1em'>
          <Typography variant='h4' color='grey.700'>
            Results
          </Typography>
        </Box>
        {
          children
        }
      </Stack>
    </Paper>
  )
}
