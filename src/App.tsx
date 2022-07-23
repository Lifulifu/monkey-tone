import React from 'react';
import './App.css';
import Navbar from './components/Navbar'

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { colors, createTheme, ThemeProvider } from '@mui/material';

import NotesSection from './components/NotesSection';

const theme = createTheme({
  palette: {
    primary: {
      main: '#383B53'
    },
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <Container maxWidth='md'>
          <NotesSection />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
