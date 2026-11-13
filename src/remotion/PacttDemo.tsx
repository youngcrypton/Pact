import React from 'react';
import { Sequence } from 'remotion';
import { Scene1Problem } from './scenes/Scene1Problem.js';
import { Scene2MagicMoment } from './scenes/Scene2MagicMoment.js';
import { Scene3DaoSafety } from './scenes/Scene3DaoSafety.js';
import { Scene4NearSocial } from './scenes/Scene4NearSocial.js';
import { Scene5Outro } from './scenes/Scene5Outro.js';
import { KineticSubtitles } from './components/KineticSubtitles.js';
import { SubtitleCue } from './types.js';

const subtitleCues: SubtitleCue[] = [
  {
    fromFrame: 0,
    toFrame: 210,
    text: 'Decentralized autonomous organizations on NEAR face a massive friction: voting fatigue.',
    highlightWords: ['NEAR', 'friction:', 'voting', 'fatigue.'],
  },
  {
    fromFrame: 210,
    toFrame: 450,
    text: 'Routine micro-tasks require full council voting and proposal bonds, treating experienced contributors like strangers.',
    highlightWords: ['council', 'voting', 'proposal', 'bonds,'],
  },
  {
    fromFrame: 450,
    toFrame: 720,
    text: 'Pactt introduces 3-Tier Dynamic Approvals. When Alex submits a 4.5 NEAR task...',
    highlightWords: ['3-Tier', 'Dynamic', 'Approvals.', 'Alex', '4.5', 'NEAR'],
  },
  {
    fromFrame: 720,
    toFrame: 960,
    text: 'Pactt verifies deliverable integrity and settles the payout autonomously in < 4.2 seconds...',
    highlightWords: ['autonomously', '<', '4.2', 'seconds...'],
  },
  {
    fromFrame: 960,
    toFrame: 1200,
    text: "Alex's trust score increments to 175.5 points with zero council votes and zero delays.",
    highlightWords: ['175.5', 'points', 'zero', 'delays.'],
  },
  {
    fromFrame: 1200,
    toFrame: 1500,
    text: 'Custody never leaves the DAO. When a newcomer submits a task or rewards exceed 25 NEAR...',
    highlightWords: ['Custody', 'DAO.', '25', 'NEAR...'],
  },
  {
    fromFrame: 1500,
    toFrame: 1800,
    text: 'Pactt automatically bridges to Sputnik DAO v2 council consensus, keeping treasury funds completely protected.',
    highlightWords: ['Sputnik', 'DAO', 'v2', 'consensus,', 'protected.'],
  },
  {
    fromFrame: 1800,
    toFrame: 2070,
    text: 'Pactt protects treasuries with rolling 24-hour velocity caps and council dispute slashing.',
    highlightWords: ['24-hour', 'velocity', 'caps', 'dispute', 'slashing.'],
  },
  {
    fromFrame: 2070,
    toFrame: 2340,
    text: 'Completed work is permanently minted to NEAR Social as a portable Web3 soulbound credential.',
    highlightWords: ['NEAR', 'Social', 'soulbound', 'credential.'],
  },
  {
    fromFrame: 2340,
    toFrame: 2700,
    text: 'Visit pactt.terminall.workers.dev and explore our code on GitHub. Built for NEAR Hackathon 2026.',
    highlightWords: ['pactt.terminall.workers.dev', 'GitHub.', 'NEAR', 'Hackathon', '2026.'],
  },
];

export const PacttDemo: React.FC = () => {
  return (
    <div
      style={{
        width: '1920px',
        height: '1080px',
        position: 'relative',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Scene 1: The User Problem (0:00 - 0:15 | Frames 0 - 450) */}
      <Sequence from={0} durationInFrames={450}>
        <Scene1Problem />
      </Sequence>

      {/* Scene 2: The Magic Moment (0:15 - 0:40 | Frames 450 - 1200) */}
      <Sequence from={450} durationInFrames={750}>
        <Scene2MagicMoment />
      </Sequence>

      {/* Scene 3: Sputnik DAO Custody & Treasury Safety (0:40 - 1:00 | Frames 1200 - 1800) */}
      <Sequence from={1200} durationInFrames={600}>
        <Scene3DaoSafety />
      </Sequence>

      {/* Scene 4: NEAR's Role Concretely & SocialDB Proofs (1:00 - 1:18 | Frames 1800 - 2340) */}
      <Sequence from={1800} durationInFrames={540}>
        <Scene4NearSocial />
      </Sequence>

      {/* Scene 5: Outro & Call to Action (1:18 - 1:30 | Frames 2340 - 2700) */}
      <Sequence from={2340} durationInFrames={360}>
        <Scene5Outro />
      </Sequence>

      {/* Global High-Contrast Kinetic Subtitles Overlay */}
      <KineticSubtitles cues={subtitleCues} />
    </div>
  );
};
