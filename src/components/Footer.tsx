import React from 'react'
import { Box, Link, Typography } from '@mui/material'
import { MdLightbulbOutline } from 'react-icons/md'

const GITHUB_LINK = 'https://github.com/Lifulifu';

export default function Footer() {
  return (
    <Box sx={{
      textAlign: 'center',
      color: 'secondary.main',
      mb: '1em'
    }}>
      <Typography variant='subtitle1' alignItems='center'>
        <MdLightbulbOutline />Pro tip: Glide on the piano to toggle multiple notes!
      </Typography>
      <Typography variant='body2'>
        Made by <Link href={GITHUB_LINK}>lifulifu</Link>
      </Typography>
    </Box>
  )
}
