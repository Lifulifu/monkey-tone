// credits: https://github.com/markacola/react-vexflow/blob/master/src/index.js
import React, { useRef, useEffect, useState } from 'react'
import VexFlow from 'vexflow'

import { ScoreUtils } from '../util'


interface ScoreProps {
  notes: number[],
  widthPerNote?: number,
  clef?: string,
}

export default function Score({
  notes = [], clef, widthPerNote = 40 }: ScoreProps) {

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('score render')
    ScoreUtils.renderScore(container.current!, notes, widthPerNote, clef);
    return () => {  // clear all svgs
      container.current!.innerHTML = '';
    }
  }, [])

  return <div ref={container} />
}