# MEIT case study evidence

Reviewed 2026-10-02 (Asia/Seoul). This is an editorial evidence ledger, not a claim of new hardware testing.

## Existing site

The baseline is portfolio commit `d614e44`: plain HTML/CSS/JavaScript, hash navigation for Home/About/Research/Links, no build dependencies, Arial, white background, gray text/dividers, 1120px inner-page maximum, breakpoints at 900/650px, restrained menu animation and reduced-motion support. Projects was empty; Awards already existed under About. There was no project-detail template or math dependency. The revised static `/awards/meit/` page reuses the header, menu, typography and spacing; it adds native MathML, page-specific CSS and a two-image carousel with GIF autoplay. Existing `noindex,nofollow` is preserved deliberately.

## Source snapshots

| Repository | Reviewed HEAD | Verification |
| --- | --- | --- |
| meit-ios | `4cb0035803c17acf0306a38ba9291c95464bcd3b` | Clean local checkout; GitHub API confirms public repository and matching remote main |
| meit-ee | `fe6a578cdb07521e3e6075aa58b041cd8a9bf479` | Remote HEAD fetched into a separate research copy; local C:\meit-ee was still at f4bb79d |
| meit-ai | `54ec195957972371ad4ba7b8e56bc58a734efa0f` | Clean local checkout; remote HEAD matches |

GitHub repository metadata was rechecked for the revision: MEIT-competition/meit-ee has private=false and remote HEAD fe6a578. The portfolio now offers the verified-public iOS and Embedded / Electronics repositories. The AI source link is removed by request. The original source repositories were not modified.

The latest EE changes after f4bb79d modify `display.html` and add optional display-server calls to `laptop/ios_motor_bridge.py`; they do not replace the final wearable command path.

## Current implementation

| Claim | Source |
| --- | --- |
| iPhone stereo capture, runtime format validation | meit-ios `Audio/WearableStereoCapture.swift`, `CapturePCMAdapter.swift` |
| Linear RMS EMA 0.25; entry 0.7 dB; release 0.5 dB; silence -65 dBFS | `Audio/StereoDirectionEstimator.swift` |
| Persistent AVAudioConverter, equal-weight downmix, bounded producer queue | `Audio/AIInputProcessor.swift` |
| 16 kHz mono PCM16LE, 40,000 samples / 80,000 bytes / 2.5 seconds | `Audio/AIInputBuffer.swift`, `bridge/meit_ai_adapter.py` |
| HTTP wearable observe/infer/status integration | `bridge/wearable.py`, `bridge/server.py`, app networking |
| AI returns probabilities and dBFS; judge determines danger | meit-ai `classifier/adapter.py`, `decision/judge.py`; iOS `bridge/meit_ai_adapter.py` |
| YAMNet with Dense head and temperature calibration | meit-ai `model/train_yamnet.py`, `classifier/adapter.py` |
| Active firmware excludes microphones and TDoA | meit-ee `firmware/main/CMakeLists.txt`: main.c, ble_svc.c, motor.c, cmd_parse.c |
| BLE CMD v2, 6-byte header + 2 bytes/step, max 14 bytes | `laptop/protocol.py`, `firmware/main/config.h`, `cmd_parse.c` |
| GPIO21 LEFT, GPIO13 RIGHT, 20 kHz 8-bit PWM, cap 119 | `firmware/main/config.h` and `motor.c` |
| Crash 500 ms; Horn 240/140/240 ms; Siren 260/150/260/150/260 ms | `laptop/haptic_profile.json`, `haptic.py` |
| Live confidence-based intensity fallback (no dBFS supplied) | `laptop/ios_motor_bridge.py` event fields and `build_command` call; `haptic.py` |
| No exactly-once guarantee or physical motor ACK | `ios_motor_bridge.py` stores last handled event only; BLE write result does not measure actuation |

README contradictions were resolved against code: references to four iPhones, rear directions, loudness-driven intensity, CMD v3 and old clip lengths are not presented as the final single-iPhone wearable configuration.

## Individual authorship

Git log, selected diffs, and blame were inspected. Authored commits support these contributions; merge commits alone are not treated as authorship.

| Work | Author evidence | Page treatment |
| --- | --- | --- |
| iOS frontend, format conversion, ring, HTTP integration | All 32 commits at reviewed iOS HEAD are authored by jihyep; e860aaa, 66eff72, 114a7b1, 6391f7c, 4cb0035 | My Contribution |
| Direction cue smoothing and hysteresis | ed3a266, 87c2d7e; current estimator blame | My Contribution |
| Initial DRV8833 sequencer and task/deadline ownership | d4775d2, 1b6d3b1; current motor.c blame 275–291 | My Contribution and Actuation; final team profiles omitted from individual work |
| GPIO correction / bring-up | bb2b625, 21404dd | My Contribution |
| Embedded acquisition and TDoA work | 0aa5ec9, 0c8c361, 424af33 | Earlier engineering contribution, not final runtime |
| Old BLE audio exact-length guard | 97b5a42 | My validation fix, not ownership of the full BLE stack |
| Final BLE protocol/motor-only migration and haptic profile | MINSEO-0: 2317771, f3d48aa, 8b56f88, f4bb79d | Team Implementation |
| Latest EE display integration | yeseun2005 / 이예은, ending fe6a578 | Team Implementation |
| AI model, calibration, decision logic | meit-ai authors JuYeong, Haydnkr, yeseun2005, 이예은; model and root README | Team Implementation |
| Holder design and fabrication | Final presentation team and holder-design slides | Team Implementation |

Code excerpts: AIInputBuffer.swift 73–79; StereoDirectionEstimator.swift 66–75; motor.c 285–291 at fe6a578; original audio_capture.c routing at 0c8c361. Excerpts are copied, not rewritten illustrative code.

## Historical deep dive

The original four-microphone code at 0aa5ec9 / 0c8c361 uses FRONT/RIGHT/BACK/LEFT, nominal radius 0.08 m, opposite pairs LEFT–RIGHT and BACK–FRONT, 48 kHz, dual-I2S, shared GPIO5/6 clocks and GPIO7/15 inputs. GCC-PHAT, fractional peak interpolation, delay-domain bus-skew correction and atan2-based sector assignment are historical, not active final functionality.

The preserved resampler uses 33-tap windowed-sinc low-pass filtering followed by division-by-three decimation with persistent phase. Current iOS conversion instead uses AVAudioConverter at the observed native rate.

Arithmetic checked: 1/48,000 = 20.833333 microseconds; 343/48,000 m = 7.145833 mm; 343/16,000 m = 21.4375 mm; floor(255*3000/6400) = 119; 119/255 = 46.6667%. Timing granularity is not localization accuracy.

## Documents and media

Notion page `3eb906085d2180d89527dc91e0d5475f`, “[정리] Electronics and embedded system + ios”, was read in full. Image placement distinguishes the nested failed-prototype collection from the explicitly final circuit collection. The page’s first photo confirms the Silver Award and 900,000-won placard.

| Asset | Origin / use |
| --- | --- |
| final-hardware.jpg | First HEIC under final circuit; hero |
| circuit.jpg | Second HEIC under final circuit; hardware section |
| prototype-top.jpg | Third HEIC under final circuit; retained final top-view asset |
| ios-app.png | First screenshot under app interface; iOS section |
| app-demo.gif / app-demo-still.jpg | Original 461,608-byte GIF; autoplay in the second carousel slide; still asset retained |
| silver-award.jpg | Top-of-page HEIC of Silver Award placard and team awards; recognition |
| initial-prototype.jpg | Four-microphone/eight-motor failed-prototype group; labeled initial/debugging |
| Official competition poster | Not supplied or located; not fabricated or substituted with the presentation |

HEIC images converted to JPEG, EXIF orientation applied, maximum side 1600px. The portfolio contains no signed Notion/S3 URLs. Large original 34–37 MB prototype PNGs are not shipped.

The attachment `MEIT_[팔방송이]_ 본선자료.pdf` is a 26-page raster finals presentation, not a competition poster. All pages were rendered for overview; pages 1, 11, 18 and 26 were inspected at page scale. It supports team scope, final architecture and the unresolved microphone problem. Its model-level accuracy/26.8 ms claims are deliberately not copied as full-system metrics. Competition name/theme/date/prize and the final network failure are also explicitly supplied by the user.

## Limits and exclusions

- No fabricated official poster, numerical direction accuracy, end-to-end latency or overall physical E2E PASS.
- No claim that CENTER establishes front, stereo identifies rear, or confidence measures danger/loudness/distance.
- No claim of a solved microphone electrical root cause.
- No fixed 48 kHz iPhone capture assumption, old BLE AUDIO path as final runtime, or eight motors in the final belt.
- No individual attribution of AI training, the whole BLE stack, or mechanical fabrication.
- Host/subsystem evidence is distinguished from complete hardware verification; no firmware/iOS compilation or new physical tests were performed for this website edit.

## Publication

No commit, push, GitHub Pages deployment or search-indexing change is performed. The detail route has static title/description/canonical/Open Graph metadata and a local final-hardware social image. Existing noindex settings remain intact.

## Portfolio revision inputs

The user supplied a complete-system photograph showing the laptop result UI, belt hardware and iPhone. It is stored as final-system.jpg with its whole frame preserved. The attached WHAT / WHERE / HOW presentation slide informed the Overview text and is not embedded as an image.

The latest user request overrides the earlier Korean-title requirement: Recognition now uses an English translation. The requested public prize label is $900 Prize throughout the rendered portfolio. Internal provenance references remain in this ledger; rendered captions retain filenames only.
