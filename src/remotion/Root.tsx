import React from 'react';
import { Composition } from 'remotion';
import { PacttDemo } from './PacttDemo.js';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="PacttDemo"
        component={PacttDemo}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
