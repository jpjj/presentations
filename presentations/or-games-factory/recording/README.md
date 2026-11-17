# Recording the videos of this deck

The scripts in this folder made the videos under `public/assets/clips-play/` (two per game, on
the backup slides) and `public/assets/videos/facility-dashboard.mp4` (the dashboard slide). They
are not part of the deck's build; run them again only when a game or the dashboard has changed.

They need `ffmpeg`, and a checkout **and build** of two other repositories:

| Video | Repository | Build it with |
|---|---|---|
| the fourteen game clips | `jpjj/games` | `npm ci && npm run build:pages` |
| the dashboard video | `jpjj/jpjj.github.io` | `npm ci && npm run build` |

Playwright and Chromium are borrowed from those checkouts (`CHROMIUM_PATH` overrides the browser).

```sh
# from the root of this repository
GAMES_REPO=../games        node presentations/or-games-factory/recording/norias-of-the-dunes.mjs
WEBSITE_REPO=../jpjj.github.io node presentations/or-games-factory/recording/facility-dashboard.mjs
```

One script per game: `dungeon-hoard`, `norias-of-the-dunes`, `spice-route`, `quest-board`,
`plunder-deck`, `cart-and-run`, `labyrinth-keeper`. `HOWTO_DRAFT=<dir>` makes a quick, rough pass
into `<dir>` (a minute or two) — look at that before spending ten to twenty minutes on the real one.

## What the game clips show

Upright phone screen, about ten seconds each, no sound.

- `<game>-start.mp4` — the title screen, the press on Start, the first moves of level 1.
- `<game>-finish.mp4` — the last move of level 5, then the comparison with the solver for that
  level. One cut in between (the comparisons of levels 1–4 are stepped past off-camera), and a
  second cut where a comparison runs longer than a few seconds.

The recorder also writes a `.jpg` still beside each clip. The slides do not use them, so they are
not committed.

Levels 1–4 are played off-camera with the solver's own answers. Level 5 is played **a bit worse
than the best**, so the solver visibly wins:

| Game | Level-5 play |
|---|---|
| Dungeon Hoard | the solver's pack with its cheapest piece left on the floor |
| Norias of the Dunes | every wheel where it waters the most palms that are still dry |
| The Spice Route | always on to the nearest port |
| The Quest Board | best hero–contract pair first |
| Plunder Deck | the solver's deck with one piece left on the quay |
| Cart & Run | most gold per weight first |
| The Labyrinth Keeper | one wall a tile off |

Every script stops with an error unless the play scored strictly below the optimum **and** the
game's live solve reported a proof. The numbers in the clips are the ones that run produced; each
script prints them at the end.

## How it works

The games render in software here, far slower than real time. So the games repo's own recorder
(`scripts/lib/howto.mjs` there) steps the game's clock one frame at a time, takes a screenshot per
frame and lets `ffmpeg` cut the video; moves are real pointer events with a drawn finger.
`lib/game.mjs` wraps that for these clips. The dashboard is a plain web page: `lib/screen.mjs`
records it the same way (screenshot per frame, drawn cursor) in real time.
