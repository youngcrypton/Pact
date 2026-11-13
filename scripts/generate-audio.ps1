Add-Type -AssemblyName System.Speech

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Zira Desktop')
$synth.Rate = 0
$synth.Volume = 95

$acts = @(
  @{ id = "act1"; text = "The way decentralized autonomous organizations coordinate micro-tasks on NEAR is broken. Routine bounties face multi-day voting fatigue and lost reputation. Introducing Pactt: the earned trust coordination layer on NEAR." },
  @{ id = "act2"; text = "Designed from the ground up for speed and transparency. When trusted core contributors submit verified work, Pactt algorithmic engine verifies deliverable integrity and releases escrow in under four point two seconds with zero council delays." },
  @{ id = "act3"; text = "Behind the speed lies mathematical security. Tiered routing automatically escalates high-capital allocations to Sputnik DAO multi-sig consensus, while rolling velocity caps and dispute slashing protect treasury vaults." },
  @{ id = "act4"; text = "Reputation that outlives any single DAO. Every completed bounty mints a permanent, non-transferable soulbound badge directly into NEAR Social, creating an immutable on-chain record across the ecosystem." },
  @{ id = "act5"; text = "Instant micro-bounties. Total treasury security. Portable on-chain trust. The future of decentralized work is live at pactt dot terminall dot workers dot dev. Build on NEAR with Pactt today." }
)

$outDir = Join-Path $PSScriptRoot "..\out\audio"
if (!(Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

foreach ($a in $acts) {
  $file = Join-Path $outDir "$($a.id).wav"
  $synth.SetOutputToWaveFile($file)
  $synth.Speak($a.text)
  $synth.SetOutputToDefaultAudioDevice()
  $len = (Get-Item $file).Length
  Write-Host "Generated $file ($len bytes)"
}

$synth.Dispose()
Write-Host "Audio synthesis complete!"
