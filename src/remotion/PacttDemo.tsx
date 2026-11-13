import React from 'react';
import { Series, Audio, staticFile } from 'remotion';
import { Scene1LandingAndProblem } from './scenes/Scene1LandingAndProblem.js';
import { Scene2InstantAutoPayout } from './scenes/Scene2InstantAutoPayout.js';
import { Scene3SputnikDaoSafety } from './scenes/Scene3SputnikDaoSafety.js';
import { Scene4NearRoleAndSocialDB } from './scenes/Scene4NearRoleAndSocialDB.js';
import { Scene5Outro } from './scenes/Scene5Outro.js';

export const PacttDemo: React.FC = () => {
  return (
    <>
      <Series>
        {/* Scene 1: Landing Page Transition & The Problem (0:00 - 0:22.5, 675 frames) */}
        <Series.Sequence durationInFrames={675}>
          <Audio src={staticFile('audio/act1.mp3')} volume={0.95} />
          <Scene1LandingAndProblem />
        </Series.Sequence>

        {/* Scene 2: The Magic Moment - Tier 1 Instant Auto-Payout (0:22.5 - 0:42.0, 585 frames) */}
        <Series.Sequence durationInFrames={585}>
          <Audio src={staticFile('audio/act2.mp3')} volume={0.95} />
          <Scene2InstantAutoPayout />
        </Series.Sequence>

        {/* Scene 3: High-Capital Safety - Tier 3 Sputnik DAO Multi-Sig (0:42.0 - 1:00.0, 540 frames) */}
        <Series.Sequence durationInFrames={540}>
          <Audio src={staticFile('audio/act3.mp3')} volume={0.95} />
          <Scene3SputnikDaoSafety />
        </Series.Sequence>

        {/* Scene 4: Anti-Cheat & Explaining NEAR's Role (1:00.0 - 1:16.0, 480 frames) */}
        <Series.Sequence durationInFrames={480}>
          <Audio src={staticFile('audio/act4.mp3')} volume={0.95} />
          <Scene4NearRoleAndSocialDB />
        </Series.Sequence>

        {/* Scene 5: Production Outro & Call to Action (1:16.0 - 1:30.0, 420 frames) */}
        <Series.Sequence durationInFrames={420}>
          <Audio src={staticFile('audio/act5.mp3')} volume={0.95} />
          <Scene5Outro />
        </Series.Sequence>
      </Series>
    </>
  );
};

