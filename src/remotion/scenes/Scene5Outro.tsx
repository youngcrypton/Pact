import React from 'react';
import { commonBackgroundStyle } from '../styles.js';
import { OutroCard } from '../components/OutroCard.js';
import { KineticSubtitles } from '../components/KineticSubtitles.js';

export const Scene5Outro: React.FC = () => {
  return (
    <div style={commonBackgroundStyle}>
      <OutroCard />

      <KineticSubtitles
        tag="LIVE ON TESTNET"
        subtitle="Instant DAO bounties. Zero voter fatigue. Visit pactt.terminall.workers.dev and try Pactt today on NEAR Testnet."
      />
    </div>
  );
};

