import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar'
import Container from '@mui/material/Container';
import { colors, createTheme, ThemeProvider } from '@mui/material';

import NotesSection from './components/NotesSection';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.orange[400]
    }
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
