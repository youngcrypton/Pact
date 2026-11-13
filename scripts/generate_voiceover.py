import asyncio
import os
import edge_tts

VOICE = "en-US-ChristopherNeural"
OUTPUT_DIR = os.path.join(os.getcwd(), "public", "audio")
PREVIEW_AUDIO_DIR = os.path.join(os.getcwd(), "src", "preview", "audio")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(PREVIEW_AUDIO_DIR, exist_ok=True)

ACTS = [
    {
        "id": "act1",
        "text": "Decentralized autonomous organizations on NEAR face severe voting fatigue. Routine micro-tasks under five NEAR require full council multi-sig consensus, proposal bonds, and days of delay. Even worse, Sputnik DAO purges claim records upon completion, treating veteran contributors like strangers. We built Pactt."
    },
    {
        "id": "act2",
        "text": "When Alex, a trusted contributor with one hundred forty-two trust points, submits a four point five NEAR task, Pactt verifies the deliverable and settles the payout instantly in four point two seconds. Zero council signatures, zero voting fatigue, and Alex earns thirty-three trust points."
    },
    {
        "id": "act3",
        "text": "Custody never leaves the DAO. When a newcomer submits work, or the reward exceeds twenty-five NEAR, Pactt automatically routes to Sputnik DAO v2 for multi-sig consensus. The council ledger tracks live quorum votes, keeping treasury funds completely protected."
    },
    {
        "id": "act4",
        "text": "Pactt protects treasuries with rolling twenty-four hour velocity caps and council dispute slashing. Completed work is permanently minted to NEAR Social on v1.social08.testnet as a portable, soulbound Web3 credential."
    },
    {
        "id": "act5",
        "text": "Instant DAO bounties. Zero voter fatigue. Try Pactt today on NEAR Testnet at pactt.terminall.workers.dev."
    }
]

async def generate_file(text, out_path, preview_path):
    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(text, VOICE, rate="+3%", pitch="+0Hz")
            await communicate.save(out_path)
            if os.path.getsize(out_path) > 1000:
                with open(out_path, "rb") as f:
                    data = f.read()
                    with open(preview_path, "wb") as pf:
                        pf.write(data)
                return True
        except Exception as e:
            print(f"Retry {attempt+1} due to {e}")
            await asyncio.sleep(2)
    return False

async def main():
    print("Generating voiceover audio files...")
    for act in ACTS:
        act_id = act["id"]
        out_f = os.path.join(OUTPUT_DIR, f"{act_id}.mp3")
        prev_f = os.path.join(PREVIEW_AUDIO_DIR, f"{act_id}.mp3")
        ok = await generate_file(act["text"], out_f, prev_f)
        size = os.path.getsize(out_f) if os.path.exists(out_f) else 0
        print(f"Act {act_id}: ok={ok}, size={size}")
        await asyncio.sleep(1)

    # Master composite audio
    master_f = os.path.join(OUTPUT_DIR, "master-voiceover.mp3")
    prev_master_f = os.path.join(PREVIEW_AUDIO_DIR, "master-voiceover.mp3")
    full_script = (
        ACTS[0]["text"] + "\n\n" +
        ACTS[1]["text"] + "\n\n" +
        ACTS[2]["text"] + "\n\n" +
        ACTS[3]["text"] + "\n\n" +
        ACTS[4]["text"]
    )
    ok_master = await generate_file(full_script, master_f, prev_master_f)
    print(f"Master: ok={ok_master}, size={os.path.getsize(master_f) if os.path.exists(master_f) else 0}")

if __name__ == "__main__":
    asyncio.run(main())
