---
theme: default
colorSchema: light
routerMode: hash
favicon: /assets/favicon.png
background: /assets/hub-cover.jpg
title: Can you beat the Algorithm?
info: |
  ## Can you beat the Algorithm? Using GenAI to create an OR Games Factory
  Jens-Peter Joost (JPJ Solutions)

  GOR working group "Praxis der Mathematischen Optimierung", 111th meeting:
  Optimization in the era of Generative AI. Flix SE, Munich, 26 November 2026.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
duration: 35min
---

# Can you beat the Algorithm?

## Using GenAI to create an OR Games Factory

Jens-Peter Joost · JPJ Solutions

<div class="abs-bl m-6 text-sm opacity-70">
  GOR AG Praxis der Mathematischen Optimierung · Munich · 26 November 2026
</div>

<!--
DRAFT 3, to Peter's feedback of 16 Nov. TODO marks what still needs your input.

The whole deck runs on "next" alone: nothing has to be played or clicked live.
Every game moment is a silent video. A video either starts when its slide opens,
or it shows a still picture first and starts on the next "next" (noted on each slide).

Timing (35 min + 10 min discussion):
 0– 4  Ice breaker: the Norias of the Dunes play-through (2:48)
 4– 7  Why games?
 7–15  Building the arcade
15–20  The seven games, as clips
20–30  So what?
30–35  Take-aways

The pictures and game names are still links to the live sites, for a laptop with internet. They are not needed.
-->

---
layout: two-cols
layoutClass: gap-8
disabled: true
---

# Let's play

Norias of the Dunes

<v-clicks>

- A desert, thirsty palms, a handful of water wheels.
- Each wheel waters the palms within its reach.
- Water as many palms as you can.

</v-clicks>

::right::

<br>
<br>

[![Norias of the Dunes: click to open the game](/assets/games/norias-of-the-dunes.jpg)](https://games.jpjsolutions.com/norias-of-the-dunes/)

<!--
Three clicks for the rules. The next slide is the play-through.
-->

---
layout: full
class: video-slide
---

<SlidevVideo autoplay autoreset="slide" muted controls poster="/assets/games/norias-of-the-dunes.jpg">
  <source src="/assets/videos/norias-of-the-dunes.mp4" type="video/mp4" />
</SlidevVideo>

<!--
VIDEO, starts by itself, no sound, 2:48: the full play-through of Norias of the Dunes, all five oases.
Talk over it. "Next" moves on at any time.

What to say while it runs: a game (a setting, a few wheels, a score); behind it a facility-location problem
(where do you put a limited number of sites to serve the most demand?); and an algorithm that solves
the same level live and proves the best answer. The solver is a MILP (maximal covering location), solved by HiGHS in the browser.
-->

---
layout: two-cols
layoutClass: gap-8
---

# Why games?

<v-clicks>

- Great **Introduction people to OR**: students, end users, stakeholders.
- Players engage with the problem **on a deeper level** (compared to reading slides).
- But games take a long time to code and I am not a game developer...

</v-clicks>

::right::

<div class="h-full flex items-center justify-center">

<SlidevVideo v-click="3" class="stay-visible" autoplay autoreset="slide" muted poster="/assets/apple-game.jpg">
  <source src="/assets/videos/apple-game.mp4" type="video/mp4" />
</SlidevVideo>

</div>

<!--
VIDEO: the picture is on the slide from the start. The clip starts with the third bullet ("Last year I built that game myself").
TODO (Peter): the clip is still missing. Save it as public/assets/videos/apple-game.mp4 (no sound). Until then the picture stays.

The game: my apple-collection game, a capacitated vehicle routing problem (jpjj.github.io/cvrp_game).
At the DHL fair people had to solve a small CVRP instance by hand. It really made them understand what our division does.
-->

---
layout: quote
---

# Enter GenAI


---
class: genai-slide
---

<br>

<div class="genai-grid">
<figure>
  <SlidevVideo autoplay autoreset="slide" muted loop>
    <source src="/assets/genai/1-pelican.mp4" type="video/mp4" />
  </SlidevVideo>
  <figcaption>Claude Opus 5.5 (Anthropic): a pelican on a bike, built in Three.js. Source: <a href="https://x.com/addyosmani/status/2102436416437580159">Addy Osmani on X, 22 Sep 2026</a></figcaption>
</figure>
<figure>
  <SlidevVideo autoplay autoreset="slide" muted loop>
    <source src="/assets/genai/2-penthouse.mp4" type="video/mp4" />
  </SlidevVideo>
  <figcaption>GPT-6 Astra (OpenAI): the demo house, from Blender to Unreal Engine 5. Source: <a href="https://x.com/Dimillian/status/2095596700815516004">Thomas Ricouard on X, 3 Sep 2026</a></figcaption>
</figure>
<figure>
  <SlidevVideo autoplay autoreset="slide" muted loop>
    <source src="/assets/genai/3-project-genie.mp4" type="video/mp4" />
  </SlidevVideo>
  <figcaption>Genie 3 (Google DeepMind): worlds you can walk through. Source: <a href="https://www.youtube.com/watch?v=YxkGdX4WIBE">Google DeepMind, "Project Genie", 29 Jan 2026</a></figcaption>
</figure>
<figure>
  <SlidevVideo autoplay autoreset="slide" muted loop>
    <source src="/assets/genai/4-gemini-omni-orbs.mp4" type="video/mp4" />
  </SlidevVideo>
  <figcaption>Gemini Omni (Google): generated video. Source: <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-3-5-videos">Google, The Keyword, 29 May 2026</a></figcaption>
</figure>
</div>

<!--
Four clips, all running at once, no sound, in a loop. The sources are under each clip.
1 Pelican: made with Claude Opus 5.5, but posted by Addy Osmani, not by Anthropic. Anthropic's own launch film has no pelican.
2 House: GPT-6 Astra. Posted by Thomas Ricouard, who built "the demo house for our launch blog post" at OpenAI. It is a house, not a penthouse.
3 and 4 are my picks, both from Google: generated worlds (Genie 3) and generated video (Gemini Omni). Neither was built by a coding agent.
With GenAI and coding agents I felt free to try more: first the apple game and a few others. Then the idea got bigger: an arcade.
-->

---
layout: image-right
image: /assets/original-games-arcade.jpg
---

# Building the arcade

<!--
The picture: the first arcade, the flat version from June.
-->

---
layout: two-cols
layoutClass: gap-8
---

# One flagship first

Dungeon Hoard

<v-clicks>

"Create a game where you are the hero slaying monsters. After a monster is slayn, you have to loot the items into your inventory. Your inventory is a 2d grid and every item has different shape and different value. The goal is to get as much value with you as possible since you cannot carry all (too many items for your inventory)."

</v-clicks>

::right::

<div class="h-full flex items-center justify-center">

<SlidevVideo v-click class="stay-visible" autoplay autoreset="slide" muted poster="/assets/videos/dungeon-hoard-original.jpg">
  <source src="/assets/videos/dungeon-hoard-original.mp4" type="video/mp4" />
</SlidevVideo>

</div>

<!--
First "next": the prompt. Second "next": the VIDEO starts (no sound, 1:18), me playing the very first version, one HTML file.
Before that the right side shows a still picture of it.
-->

---
layout: two-cols
layoutClass: gap-8
---

# Refine, in a loop

```mermaid {scale: 0.62}
flowchart LR
  P[I play it] --> F[I give feedback]
  F --> A[The agent builds]
  A --> P
```

<v-clicks>

- From one static HTML file to a real project: tests, a real solver in the browser.
- When I was satisfied, I wrote the recipe **recipe**.

</v-clicks>

::right::

<div v-click class="recipe">

### The recipe

1. Pick an **OR problem** and dress it in a setting.
2. Build the game around a few small, handcrafted levels.
3. Build a **real solver**, with a test that proves the optimum.
4. Build the reveal: **you against the algorithm**, with the honest gap.
5. Explain the problem and where it shows up in business.
6. Done means: build green, tests green, a full play-through in a headless browser.

</div>

<!--
The recipe appears with the fourth "next", after the three bullets.
It lives in one file in the repo that the agent reads first: what the project is for,
how a game is built, and what "done" means. The slide is the short form; the file has ten steps.
One rule in it is not negotiable: say "optimal" only when the solver has proven it.
-->

---

# The factory run

<v-clicks>

- Scheduled claude routines. One run every two hours.
1. Read value `i` from file.
2. `if i % 5 == 0`: brainstorm new ideas and tidy the repo.
3. `else:`  **pick idea from backlog and execute the recipe.**
4. increment `i`
5. Commit & Push
- Result: **25 new games in four days** (22–25 June 2026).

</v-clicks>

<!--
Each run was a fresh session: pick an idea, build the solver with tests, build the game,
play it through in a headless browser, merge if everything is green.
Source: AUTORUN_LOG.md on the `experiment` branch of the games repo.
-->

---
layout: image
image: /assets/all-games.webp
backgroundSize: contain
---

<!--
All 32 title cards of the old version: my 7 plus the 25 from the automatic runs.
Bin packing, scheduling, graph colouring, min-cost flow, set cover, spanning trees, and more.
-->

---
layout: fact
disabled: True
---

# 32 → 7

Many of the automatic ideas lacked creativity. Seven stayed: six were my ideas, one was the AI's.

<!--
The solvers were fine. The games were often the same game in a new costume.
(The AI's surviving idea was the maze game. No need to say which, unless asked.)
-->

---

# Enter Fable 5.2



"Hello Claude, I want...

<v-clicks>

- Cool 3d graphics for all games!
- An island which functions as my hub world!
- And a dragon as a pet!"

</v-clicks>

<!--
Tools: Claude Code throughout. The 2D versions mostly with Claude Opus 4.8, the 3D overhaul with Claude Fable 5.2.
An anecdote, not a benchmark.
-->

---
layout: two-cols
layoutClass: gap-8
disabled: true
---

# Before

June: flat pages

![The first version of Dungeon Hoard: a flat page with an emoji monster](/assets/dh-2d.jpg)

::right::

# After

November: a world

![Dungeon Hoard today: a 3D dungeon](/assets/games/dungeon-hoard.jpg)

---
layout: full
class: video-slide
---

<SlidevVideo v-click class="stay-visible" autoplay autoreset="slide" muted poster="/assets/games/hub.jpg">
  <source src="/assets/videos/optimal-realm-into-dungeon-hoard.mp4" type="video/mp4" />
</SlidevVideo>

<!--
The slide opens on the picture of the island. "Next" starts the VIDEO (no sound, 1:21):
me walking across the Optimal Realm and into Dungeon Hoard. "Next" again moves on.
-->

---
layout: two-cols
layoutClass: gap-8
zoom: 0.62
---

## [Dungeon Hoard](https://games.jpjsolutions.com/dungeon-hoard/)

<SlidevVideo autoplay autoreset="slide" controls>
  <source src="/assets/clips/dungeon-hoard-1.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click autoplay autoreset="slide" controls>
  <source src="/assets/clips/dungeon-hoard-2.mp4" type="video/mp4" />
</SlidevVideo>

<!--
LET ME SHOW YOU, about 5 minutes. Seven games, one slide each.
Arriving on a slide plays the first clip; "next" plays the second; "next" again goes to the next game.
In every game a real solver runs live in the browser, and "optimal" is only said when it is proven.

Dungeon Hoard: 2D knapsack / packing.
-->

---
layout: two-cols
layoutClass: gap-8
zoom: 0.62
---

## [Norias of the Dunes](https://games.jpjsolutions.com/norias-of-the-dunes/)

<SlidevVideo autoplay autoreset="slide" controls>
  <source src="/assets/clips/norias-of-the-dunes-1.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click autoplay autoreset="slide" controls>
  <source src="/assets/clips/norias-of-the-dunes-2.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Norias of the Dunes: maximal covering location.
-->

---
layout: two-cols
layoutClass: gap-8
zoom: 0.62
---

## [The Spice Route](https://games.jpjsolutions.com/spice-route/)

<SlidevVideo autoplay autoreset="slide" controls>
  <source src="/assets/clips/spice-route-1.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click autoplay autoreset="slide" controls>
  <source src="/assets/clips/spice-route-2.mp4" type="video/mp4" />
</SlidevVideo>

<!--
The Spice Route: travelling salesman.
-->

---
layout: two-cols
layoutClass: gap-8
zoom: 0.62
---

## [The Quest Board](https://games.jpjsolutions.com/quest-board/)

<SlidevVideo autoplay autoreset="slide" controls>
  <source src="/assets/clips/quest-board-1.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click autoplay autoreset="slide" controls>
  <source src="/assets/clips/quest-board-2.mp4" type="video/mp4" />
</SlidevVideo>

<!--
The Quest Board: assignment.
-->

---
layout: two-cols
layoutClass: gap-8
zoom: 0.62
---

## [Plunder Deck](https://games.jpjsolutions.com/plunder-deck/)

<SlidevVideo autoplay autoreset="slide" controls>
  <source src="/assets/clips/plunder-deck-1.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click autoplay autoreset="slide" controls>
  <source src="/assets/clips/plunder-deck-2.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Plunder Deck: 3D loading with stacking rules.
-->

---
layout: two-cols
layoutClass: gap-8
zoom: 0.62
---

## [Cart & Run](https://games.jpjsolutions.com/cart-and-run/)

<SlidevVideo autoplay autoreset="slide" controls>
  <source src="/assets/clips/cart-and-run-1.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click autoplay autoreset="slide" controls>
  <source src="/assets/clips/cart-and-run-2.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Cart & Run: prize-collecting capacitated routing.
-->

---
layout: two-cols
layoutClass: gap-8
zoom: 0.62
---

## [The Labyrinth Keeper](https://games.jpjsolutions.com/labyrinth-keeper/)

<SlidevVideo autoplay autoreset="slide" controls>
  <source src="/assets/clips/labyrinth-keeper-1.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click autoplay autoreset="slide" controls>
  <source src="/assets/clips/labyrinth-keeper-2.mp4" type="video/mp4" />
</SlidevVideo>

<!--
The Labyrinth Keeper: shortest-path interdiction.
-->

---
layout: section
---

# So what?

---
layout: two-cols
layoutClass: gap-8
---

# What a world we live in

Have you tried the latest LLM models for your work?

<v-clicks>

- We have all seen what they do for **coding** & modelling.
- Fable 5.2. on solving:

</v-clicks>

::right::

<div v-click class="h-full flex flex-col items-center justify-center">
  <img src="/assets/fable-miplib.png" alt="The MIPLIB statement from the Fable 5.2 Instagram post" class="max-h-105 rounded" />
  <div class="text-xs opacity-60 mt-2">
    Source: <a href="https://www.instagram.com/p/DfsFpYDIHYa/?img_index=4">instagram.com/p/DfsFpYDIHYa</a>, picture 4
  </div>
</div>

<!--
Source: the vendor's own announcement (Anthropic, 9 Nov 2026); the solutions were submitted to MIPLIB.
The picture carries its own small print: "an earlier version of Claude Fable 5.2", teams of up to 300 agents,
and "proofs checked only by separate Claude agents so far". Say it before someone asks.
TODO (Peter): check miplib.zib.de the week before and quote what is listed there. People who know MIPLIB closely are in the room.

Careful with the wording: this result is about SOLVING given instances. On modelling from a text description,
a 2026 benchmark built from MIPLIB (MIPLIB-NL, arXiv 2602.10450) reports a sharp drop on real-size models.
If someone asks: say so.
-->

---
layout: statement
---

# Was that ever the problem?*

*... that needed to be solved to make a project succed?

---
 
# What did hold us back

<v-clicks>

- **Data Quality**
- **Requirements Engineeing**
- **Stakeholder Management**
- **Change Management**
- ...

</v-clicks>

---

# A common picture

<v-clicks>

- Developers, users and stakeholders have to 
  - **speak the same language**
  - feel **the same pain** 
  - envision **the same solution**
- Words and formulas rarely get them there.
- **Visualisation does.**

</v-clicks>

---
layout: statement
---

# And what are games, if not interactive visualisations?

---
layout: two-cols
layoutClass: gap-8
---

# The game

Where do the water wheels go?

[![Norias of the Dunes: click to open the game](/assets/games/norias-of-the-dunes.jpg)](https://games.jpjsolutions.com/norias-of-the-dunes/)

::right::

# The project

Where do the warehouses go?

[![The facility-location tool: click to open it](/assets/facility-opening.jpg)](https://jpjsolutions.com/use-cases/facility-location/)

<!--
No live demo needed: the two pictures side by side make the point.
The tool on the right is a neutral copy, on made-up data, of what I built for a client.
-->

---
layout: full
class: video-slide
---

<SlidevVideo v-click class="stay-visible" autoplay autoreset="slide" muted poster="/assets/videos/facility-dashboard.jpg">
  <source src="/assets/videos/facility-dashboard.mp4" type="video/mp4" />
</SlidevVideo>

<!--
The slide opens on a still of the tool. "Next" starts the VIDEO (no sound, 21 s). "Next" again moves on.
What happens in it, on the neutral copy with made-up data:
1. The opening network costs €9.00M a year; the proved optimum is €7.17M.
2. I close Stuttgart: the cost moves at once.
3. I pick up Kassel and hand it to Köln: that is a rule now.
4. "Start from the optimum".
5. Two things real life might ask for: München stays open, Kassel is served from Berlin.
6. "Re-optimise around my rules": the best plan that keeps both costs €7.65M, and each rule gets a price:
   München +€441k, Kassel +€23k a year.
Everything in the video was solved live while it was recorded.
-->

---
layout: two-cols
layoutClass: gap-8
disabled: true
---

# A client project

Planners play facility location

<v-clicks>

- A visualisation, built with AI, of their own network question.
- They open and close sites and move customers.
- They can always compare with the **optimal solution**.
- And they can add **their own rules**, as they like.

</v-clicks>

::right::

<br>
<br>

[![The facility-location tool with two planner rules priced: click to open it](/assets/facility-rules.jpg)](https://jpjsolutions.com/use-cases/facility-location/)

<!--
TODO (Peter): one or two real things the planners changed, and why.
On the neutral copy every rule gets a price: e.g. "München stays open": +€441k a year.
-->

---

# What it gave us

<v-clicks>

- A fast exchange about **how the problem is defined**.
- The **requirements that were missing** came up by themselves.
- People without a technical background **understood and valued** what the solver can do.
- Non-techies engaging with the development of the project, driving **change management**.

</v-clicks>

---

# Take-aways

<v-clicks>

1. **(Interactive) Visualisation is key.**
2. OR can be visualised **very interactively**.
3. **We all have the tools. Let's get creative.**

</v-clicks>

---
layout: two-cols
layoutClass: gap-8
---

# Can you beat the algorithm?

Try it

### games.jpjsolutions.com

<br>

The facility tool:

**jpjsolutions.com/use-cases/facility-location**

<br>

Jens-Peter Joost · jpjsolutions.com

::right::

![QR code to games.jpjsolutions.com](/assets/qr-games.svg)

<!--
10 minutes of discussion.
Questions to expect: what did it cost in hours and money; did you read the code; would you trust it on a client model;
client data and confidentiality; did the games bring any business; does this hold beyond toy instances.
-->

---
layout: two-cols
layoutClass: gap-8
---

## Backup: [Dungeon Hoard](https://games.jpjsolutions.com/dungeon-hoard/)

<SlidevVideo class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/dungeon-hoard-start.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/dungeon-hoard-finish.mp4" type="video/mp4" />
</SlidevVideo>

<!--
BACKUP, a second set of clips for the seven games (upright phone format, about 10 s each, no sound).
Left: the title screen, the press on Start, the first moves of level 1. It plays when the slide opens.
Right ("next"): the end of level 5, then the solver's answer for that level.
In six games level 5 is played a bit worse than the best; in Dungeon Hoard the pack is filled to the optimum.
One cut in each right clip: the comparisons of levels 1–4 are left out.
The solve times in the clips are those of the recording machine (a slow one).

Dungeon Hoard: 2D knapsack / packing.
Left clip (about 15 s): the first fight, then the first two pieces go into the pack.
Right clip, stage 5: the last piece fills the pack. 825, and the solver proves that 825 is the optimum.
-->

---
layout: two-cols
layoutClass: gap-8
---

## Backup: [Norias of the Dunes](https://games.jpjsolutions.com/norias-of-the-dunes/)

<SlidevVideo class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/norias-of-the-dunes-start.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/norias-of-the-dunes-finish.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Norias of the Dunes: maximal covering location.
Right clip, oasis 5: every wheel goes where it waters the most palms that are still dry. 27 palms; the proven optimum is 30.
-->

---
layout: two-cols
layoutClass: gap-8
---

## Backup: [The Spice Route](https://games.jpjsolutions.com/spice-route/)

<SlidevVideo class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/spice-route-start.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/spice-route-finish.mp4" type="video/mp4" />
</SlidevVideo>

<!--
The Spice Route: travelling salesman.
Right clip, voyage 5: the round crosses itself (405.6 leagues), the crossing is repaired (337.6 leagues, no legs cross),
and the proven shortest round is still shorter: 284.3. No crossings does not mean optimal.
-->

---
layout: two-cols
layoutClass: gap-8
---

## Backup: [The Quest Board](https://games.jpjsolutions.com/quest-board/)

<SlidevVideo class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/quest-board-start.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/quest-board-finish.mp4" type="video/mp4" />
</SlidevVideo>

<!--
The Quest Board: assignment.
Right clip, day 5: best hero–contract pair first. 544 gold; the proven optimum is 567.
-->

---
layout: two-cols
layoutClass: gap-8
---

## Backup: [Plunder Deck](https://games.jpjsolutions.com/plunder-deck/)

<SlidevVideo class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/plunder-deck-start.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/plunder-deck-finish.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Plunder Deck: 3D container loading.
Right clip, island 5: the solver's deck with one piece, the Caged Parrot, left on the quay. 448 gold; the proven optimum is 470.
-->

---
layout: two-cols
layoutClass: gap-8
---

## Backup: [Cart & Run](https://games.jpjsolutions.com/cart-and-run/)

<SlidevVideo class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/cart-and-run-start.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/cart-and-run-finish.mp4" type="video/mp4" />
</SlidevVideo>

<!--
Cart & Run: prize-collecting vehicle routing with capacities.
Right clip, room 5: most gold per weight first. 133 gold banked; the proven optimum is 145.
-->

---
layout: two-cols
layoutClass: gap-8
---

## Backup: [The Labyrinth Keeper](https://games.jpjsolutions.com/labyrinth-keeper/)

<SlidevVideo class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/labyrinth-keeper-start.mp4" type="video/mp4" />
</SlidevVideo>

::right::

## &nbsp;

<SlidevVideo v-click class="h-105 mx-auto" autoplay autoreset="slide" muted controls>
  <source src="/assets/clips-play/labyrinth-keeper-finish.mp4" type="video/mp4" />
</SlidevVideo>

<!--
The Labyrinth Keeper: shortest-path network interdiction.
Right clip, labyrinth 5: one wall a tile off. The hero needs 12 steps; the proven longest forced path is 14.
-->
