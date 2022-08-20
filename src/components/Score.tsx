// credits: https://github.com/markacola/react-vexflow/blob/master/src/index.js
import React, { useRef, useEffect, useState } from 'react'
import VexFlow from 'vexflow'

import { ScoreUtils, Note, NoteDuration } from '../util'


interface ScoreProps {
  notes: Note[],
  widthPerNote?: number,
  clef?: string,
}

export default function Score({
  notes = [], clef, widthPerNote = 40 }: ScoreProps) {

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScoreUtils.renderScore(container.current!, notes, widthPerNote, clef);
    return () => {  // clear all svgs
      if (container.current)
        container.current!.innerHTML = '';
    }
  }, [notes])

  return <div ref={container} />
}