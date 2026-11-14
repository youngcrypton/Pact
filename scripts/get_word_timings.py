import asyncio
import edge_tts
import json

ACTS = [
    ('act1', 'Decentralized autonomous organizations on NEAR face severe voting fatigue. Routine micro-tasks under five NEAR require full council multi-sig consensus, proposal bonds, and days of delay. Even worse, Sputnik DAO purges claim records upon completion, treating veteran contributors like strangers. We built Pactt.'),
    ('act2', 'When Alex, a trusted contributor with one hundred forty-two trust points, submits a four point five NEAR task, Pactt verifies the deliverable and settles the payout instantly in four point two seconds. Zero council signatures, zero voting fatigue, and Alex earns thirty-three trust points.'),
    ('act3', 'Custody never leaves the DAO. When a newcomer submits work, or the reward exceeds twenty-five NEAR, Pactt automatically routes to Sputnik DAO v2 for multi-sig consensus. The council ledger tracks live quorum votes, keeping treasury funds completely protected.'),
    ('act4', 'Pactt protects treasuries with rolling twenty-four hour velocity caps and council dispute slashing. Completed work is permanently minted to NEAR Social on v1.social08.testnet as a portable, soulbound Web3 credential.'),
    ('act5', 'Instant DAO bounties. Zero voter fatigue. Try Pactt today on NEAR Testnet at pactt.xyz.')
]

async def analyze():
    for act_id, text in ACTS:
        comm = edge_tts.Communicate(text, 'en-US-ChristopherNeural', rate='+3%', boundary='WordBoundary')
        words = []
        async for chunk in comm.stream():
            if chunk['type'] == 'WordBoundary':
                words.append({
                    'offset_ms': chunk['offset'] / 10000,
                    'duration_ms': chunk['duration'] / 10000,
                    'text': chunk['text']
                })
        print(f"=== {act_id} ({len(words)} words) ===")
        for w in words:
            sec = w['offset_ms'] / 1000
            frame = int(sec * 30)
            txt = w['text']
            print(f"  {sec:5.2f}s (f{frame:03d}): {txt}")

if __name__ == "__main__":
    asyncio.run(analyze())
