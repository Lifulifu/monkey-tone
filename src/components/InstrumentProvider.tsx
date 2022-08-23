import React, { useEffect } from 'react'
import { useState, createContext } from "react";
import Soundfont from 'soundfont-player';
import { DEFAULT_SETTING } from '../assets/constants';

interface InstrumentContextType {
  setInstrumentName: React.Dispatch<React.SetStateAction<Soundfont.InstrumentName | null>> | null,
  setGain: React.Dispatch<React.SetStateAction<number>> | null,
  instrument: Soundfont.Player | null,
}

export const InstrumentContext = createContext<InstrumentContextType>({
  setInstrumentName: null,
  setGain: null,
  instrument: null
});

export const audioContext = new AudioContext();

export default function InstrumentProvider({ children }: { children: React.ReactNode }) {

  const [instrumentName, setInstrumentName] = useState<Soundfont.InstrumentName | null>(DEFAULT_SETTING.playbackInstrumentName);
  const [gain, setGain] = useState<number>(DEFAULT_SETTING.playbackGain);
  const [instrument, setInstrument] = useState<Soundfont.Player | null>(null);

  useEffect(() => {
    if (!instrumentName)
      return;
    Soundfont.instrument(audioContext, instrumentName, { gain })
      .then((instrument) => {
        setInstrument(instrument);
      })
  }, [instrumentName, gain])

  return (
    <InstrumentContext.Provider value={{
      setInstrumentName, setGain, instrument
    }}>
      {
        children
      }
    </InstrumentContext.Provider>
  )
}
