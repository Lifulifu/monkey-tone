import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar'

import Container from '@mui/material/Container';
import { colors, createTheme, ThemeProvider } from '@mui/material';

import NoteGeneration from './components/NoteGeneration';
import InstrumentProvider from './components/InstrumentProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: '#383B53'
    },
  }
})

function App() {

  useEffect(() => {
    document.title = 'Monkey Tone';
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <Container sx={{ py: '2em' }} maxWidth='md'>
          <InstrumentProvider>
            <NoteGeneration />
          </InstrumentProvider>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
