# الأربعون النووية وزيادات ابن رجب

قارئ عربي هادئ، بخلفية بيضاء، للأحاديث الخمسين (٤٢ للنووي و٨ زيادات لابن رجب). يعمل دون اتصال (PWA)، بلا حسابات ولا إعلانات ولا تتبّع.

## Features
- Index of 50 headings (Nawawi / Ibn Rajab), Arabic search (diacritics/alef-insensitive), bookmarks, continue-reading.
- Reader: Prophet's words in deep green `#23634d`, divine speech (qudsi) `#2f4a6e`, Quran `#7a5a1e`; narrator/companion text neutral; prev/next, keyboard arrows.
- Settings: font size 18–30 (default 22), stored in localStorage. Arabic About/Source, Terms, Privacy pages.
- No audio (rights unconfirmed). Data model can later accept per-hadith audio timestamps.

## Run
`python3 -m http.server 8811` then open http://localhost:8811/ — or open `dist/fifty-hadith-standalone.html` directly.

## Build & test
```
python3 tools/parse.py && python3 tools/build.py && python3 tools/bundle.py
python3 tests/test_data.py
JSDOM_DIR=/path/with/jsdom node tests/test_app.mjs
```

## Content & licensing caveats
- Code: MIT (see LICENSE). Font: Amiri, SIL OFL 1.1 (`fonts/OFL.txt`).
- Hadith text: from IslamHouse (see `data/PROVENANCE.md`). Not covered by the MIT license; follow IslamHouse terms (attribution, no change in content; commercial use may need permission).
- Diacritics are as in the source (incomplete in places). Speech colouring is editorial and not yet scholar-reviewed. Check against printed editions.
