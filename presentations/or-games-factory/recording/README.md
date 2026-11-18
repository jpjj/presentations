# Recording the videos of this deck

The scripts in this folder made the videos under `public/assets/clips-play/` (two per game, on
the backup slides), `public/assets/videos/facility-dashboard.mp4` (the video of the
facility-location tool) and the tool's still pictures `public/assets/facility-*.jpg` (the three
maps on "One tool, three networks", and the two pictures of the whole tool). They are not part of
the deck's build; run them again only when a game or the tool has changed.

They need `ffmpeg`, and a checkout **and build** of two other repositories:

| Video | Repository | Build it with |
|---|---|---|
| the fourteen game clips | `jpjj/games` | `npm ci && npm run build:pages` |
| the facility-location video and pictures | `jpjj/jpjj.github.io` | `npm ci && npm run build` |

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

- `<game>-start.mp4` — the title screen, the press on Start, the first moves of level 1
  (Dungeon Hoard's runs about 15 s: the fight, then the first pieces packed).
- `<game>-finish.mp4` — the last move of level 5, then the comparison with the solver for that
  level. One cut in between (the comparisons of levels 1–4 are stepped past off-camera), and a
  second cut where a comparison runs longer than a few seconds.

The recorder also writes a `.jpg` still beside each clip. The slides do not use them, so they are
not committed.

Levels 1–4 are played off-camera with the solver's own answers. In six games level 5 is played
**a bit worse than the best**, so the solver visibly wins; in Dungeon Hoard the pack is filled to
the optimum (a pack with an empty cell looked wrong):

| Game | Level-5 play |
|---|---|
| Dungeon Hoard | the solver's own pack: the player matches the proven optimum |
| Norias of the Dunes | every wheel where it waters the most palms that are still dry |
| The Spice Route | nearest port first with every crossing repaired; on camera one last crossing is made and repaired |
| The Quest Board | best hero–contract pair first |
| Plunder Deck | the solver's deck with one piece left on the quay |
| Cart & Run | most gold per weight first |
| The Labyrinth Keeper | one wall a tile off |

Every script stops with an error unless the play scored as described (strictly below the optimum;
equal to it in Dungeon Hoard) **and** the game's live solve reported a proof. The numbers in the clips are the ones that run produced; each
script prints them at the end.

## How it works

The games render in software here, far slower than real time. So the games repo's own recorder
(`scripts/lib/howto.mjs` there) steps the game's clock one frame at a time, takes a screenshot per
frame and lets `ffmpeg` cut the video; moves are real pointer events with a drawn finger.
`lib/game.mjs` wraps that for these clips. The dashboard is a plain web page: `lib/screen.mjs`
records it the same way (screenshot per frame, drawn cursor) in real time.

## The facility-location tool

`facility-dashboard.mjs` first takes the pictures (the map in the three views Current, Potential —
the page's own example — and Optimal; the whole tool on the example), then records the video:
Current → Optimal → Potential, where constraints are released one by one and one is added, ending
on that same example with the price of each remaining constraint. The script stops with an error
if a total is not the one the slides quote (9,004 / 7,815 / 7,166 k€) or if the video does not end
on the page's example.
