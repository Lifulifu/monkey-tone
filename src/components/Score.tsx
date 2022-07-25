// credits: https://github.com/markacola/react-vexflow/blob/master/src/index.js
import React, { useRef, useEffect, useState } from 'react'

import VexFlow from 'vexflow'

const { Renderer, Stave, StaveNote, Voice, Formatter } = VexFlow.Flow;

interface ScoreProps {
  notes: string[],
  clef?: string,
  width?: number,
  height?: number
}

export default function Score({
  notes = [],
  clef = 'treble',
  width = 450,
  height = 150,
}: ScoreProps) {

  const container = useRef<HTMLDivElement>(null);
  const renderer = useRef<VexFlow.Renderer>();

  useEffect(() => {
    if (!renderer.current) {
      renderer.current = new Renderer(container.current!, Renderer.Backends.SVG);
    }
    renderer.current.resize(500, 100);
    const context = renderer.current.getContext();
    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Stave(0, 0, 400);
    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");
    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    // Create the notes
    const notes = [
      // A quarter-note C.
      new StaveNote({ keys: ["c/4"], duration: "q" }),
      // A quarter-note D.
      new StaveNote({ keys: ["d/4"], duration: "q" }),
      // A quarter-note rest. Note that the key (b/4) specifies the vertical
      // position of the rest.
      new StaveNote({ keys: ["b/4"], duration: "qr" }),
      // A C-Major chord.
      new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
    ];

    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices([voice]).format([voice], 350);
    voice.draw(context, stave);

  }, [notes])

  return <div ref={container} />
}