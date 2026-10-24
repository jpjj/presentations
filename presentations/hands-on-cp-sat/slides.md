---
theme: default
colorSchema: light
routerMode: hash
favicon: 'https://raw.githubusercontent.com/jpjj/jpjj.github.io/main/assets/favicon_jpjsolutions.png'
background: https://images.unsplash.com/photo-1466094899371-97b327dff551?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
title: Hands-On CP-SAT
info: |
  ## Jens-Peter Joost
  Presentation slides for the second Optimization for All Hands-On Session: Constraint Programming with CP-SAT.
  Find the notebooks [here](https://github.com/jpjj/O4A-Hands-On-CP-SAT)
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
duration: 120min

hide: false
---

## Hands-On CP-SAT
The solver that keeps winning · O4A Hands-On Session

<div class="abs-bl m-6 text-sm opacity-50">
  jpjsolutions.com/presentations/hands-on-cp-sat
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/jpjj/O4A-Hands-On-CP-SAT" target="_blank" alt="GitHub"
    class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
  <a href="https://jpjsolutions.com" target="_blank" alt="Website"
    class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <span class="jpj-logo" aria-label="JPJ Solutions"></span>
  </a>
</div>

<style scoped>
.jpj-logo {
  display: inline-block;
  width: 1.1em;
  height: 1.1em;
  background-color: currentColor;
  -webkit-mask: url(/assets/jpjsolutions_logo.svg) center / contain no-repeat;
          mask: url(/assets/jpjsolutions_logo.svg) center / contain no-repeat;
}
</style>

<!--
Welcome! Second hands-on session for O4A. Thank the hosts.
120 minutes, two breakout sessions, questions in between and at the end.
-->

---
layout: image-right

image: /assets/peter.png
---

# Hello again!

I'm Peter!

<v-clicks>

```
2018             M.Sc. Maths
2019 - 2025      OR Scientist at DHL
Since 2025       OR Freelancer
```

</v-clicks>

---
zoom: 1.0
---

# Today's chapters

<div class="flex flex-col gap-2">

<v-clicks>

<div class="chapter-row">
  <div class="chapter-num">01</div>
  <div class="chapter-title">Why do I need CP-SAT?</div>
</div>

<div class="chapter-row">
  <div class="chapter-num">02</div>
  <div class="chapter-title">Let's model!</div>
</div>

<div class="chapter-row">
  <div class="chapter-num">03</div>
  <div class="chapter-title">A quick look into CP-SAT's engine room</div>
</div>

<div class="chapter-row last">
  <div class="chapter-num">04</div>
  <div class="chapter-title">When to (not) use CP-SAT, wrap-up &amp; Q&amp;A</div>
</div>

</v-clicks>

</div>

<style scoped>
.chapter-row {
  display: grid;
  grid-template-columns: 4rem 1fr;
  align-items: center;
  gap: 1.25rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.chapter-row.last { border-bottom: none; }
.chapter-num {
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 2.25rem;
  font-weight: 600;
  color: #0c384a;
  line-height: 1;
}
.chapter-title {
  font-weight: 700;
  font-size: 1.3rem;
  line-height: 1.3;
}
</style>

---

## Tech Stack:
<br>
<div class="grid grid-cols-2 gap-8 mt-8">
  <div class="flex flex-col items-center">
    <img src="/assets/ortools.png" class="h-20 mb-4" alt="OR-Tools" />
    <code>ortools</code>
    <span class="text-sm opacity-70">CP-SAT for modeling &amp; solving</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/assets/pydantic.svg" class="h-20 mb-4" alt="Pydantic" style="filter: brightness(0) saturate(100%) invert(12%) sepia(95%) saturate(7471%) hue-rotate(304deg) brightness(101%) contrast(109%);" />
    <code>pydantic</code>
    <span class="text-sm opacity-70">for data validation</span>
  </div>
</div>

<div class="mt-12 text-sm opacity-70">

All code runs in Google Colab: [homework notebook](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_homework.ipynb) · [complete notebook](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb)

</div>

<!--
Ask: Who did the homework? Hands up / emoji in the chat.
-->

---
layout: image-right
image: https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=1287&auto=format&fit=crop
---

# Why do I need CP-SAT?
Chapter 1

---
layout: center
class: text-center
---

# CP-SAT is ...

<v-clicks>

- powerful
- useful
- accessible

</v-clicks>

---
layout: image-right
image: /assets/screenshot_cpsat_challenge_results.png
---

## CP-SAT is powerful

<div class="absolute bottom-6 left-14 text-xs opacity-60">

Source: [minizinc.org/challenge](https://www.minizinc.org/challenge/)

</div>

---

## The MiniZinc Challenge

<div class="grid grid-cols-2 gap-10 mt-4">
<div>

<v-clicks>

- Annual competition of **constraint programming solvers**, held since **2008**
- Organized by the MiniZinc team (Monash University, OPTIMA)
- A wide variaty of combinatorial problems need to be solved.
- Various CP solvers (and MIP solvers) compete.
- Everyone gets the **same models**, written in the solver-independent language MiniZinc
</v-clicks>

</div>
<div>

<v-clicks>

- The CP modelling language MiniZinc has been featured at an O4A event. If you want to find out more, check out [Guido Tack's seminar on Youtube](https://www.youtube.com/watch?v=uXBGAiRPRPY)


<!-- - **20 problems × 5 instances = 100 instances**
- **20 minutes** per instance
- Categories: *Fixed search*, *Free* (1 core), *Parallel* (8 cores), *Open* (portfolios), *Local search*
- **Borda scoring:** on every instance, every solver plays against every other solver: solved beats unsolved, better beats worse, faster breaks ties -->

</v-clicks>

</div>
</div>

<!--
Borda / "complete scoring": a solver earns points by beating each other solver on each instance.
-->

<!-- ---

## Who competes?

<div class="grid grid-cols-2 gap-10 mt-4">
<div>

**17 solvers competing for medals**

<div class="text-sm opacity-80 mt-2">

Atlantis, Choco-solver (CP and CP+LCG), Crusher, CUFE, JaCoP, NuCS, **OR-Tools CP-SAT**, CP-SAT LS, Parasol, PicatSAT, Pumpkin, QiuQi-MIXSolver, Sabori CSP, SICStus Prolog, Yuck

</div>

</div>
<div v-click>

**14 reference entries** (not eligible for prizes)

<div class="text-sm opacity-80 mt-2">

**Gurobi 12, CPLEX, HiGHS, SCIP, Cbc** (MIP solvers), IBM CP Optimizer, Chuffed, Gecode, Huub, MiniFolio, Thornbill, ...

</div>

<div class="mt-6">

The organizers run the big commercial MIP solvers on every instance too. The MiniZinc model is translated into a MIP automatically.

</div>

</div>
</div> -->

<!--
Important: the MIP solvers do not compete for medals. They are reference entries, but they do take part in the scoring.
-->

---

## CP-SAT is useful



60 problems featured in the last 3 years of the MiniZinc Challenge

Link to the website where people can browse.
Do you find a problem that is similar to the one you need to solve?



<!-- ---

## Counting the MIP solvers, too

<div class="grid grid-cols-[3fr_2fr] gap-10 mt-2">
<div>

<BordaRanking category="free" :top="12" />

</div>
<div class="text-sm">

<v-clicks>

- Free category: **one core**, 20 minutes per instance
- Scores recomputed from the official `results.json`, **including** the reference entries
- Gurobi lands at **#7**, HiGHS at **#11**
- With **8 cores**, Gurobi climbs to **#2**, still **20% behind** CP-SAT (2,188 vs. 1,744)

</v-clicks>

</div>
</div> -->



---

## CP-SAT is accessible

- Open source, free to use.
- If you want to model an integer problem, get right into it here.
- gehe ins notebook, starte easy modelling!!!


```python
# a CP-SAT model
for j in tasks:
    model.add_exactly_one(x[j, k] for k in teams)
for k in teams:
    model.add_no_overlap(intervals[k])
model.minimize(total * sum(used) + unfairness)

solver.solve(model)
```


---

Mehr von dem MIP-Modeller View heraus.

Starte mit einem einfachen Problem.

Assignment-Problem zum Beispiel.

Dann zeige, dass man mit globl constraints coole sachen machen kann.

mehr nicht. Dann sagen wir: Let us deep dive into one of the use-cases.

Vielleicht hier schon: Da sind geile Resources wie zum Beispiel CP-Sat Primer, um das zu lernen.




---
layout: image-right
image: https://images.unsplash.com/photo-1588591795084-1770cb3be374?q=80&w=1287&auto=format&fit=crop
---

# Let's model!
Chapter 2



---
layout: image-right
image: https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1287&auto=format&fit=crop
---
 
# Workforce Allocation & Scheduling
Use case

---

## The problem

<div class="grid grid-cols-2 gap-10 mt-2">
<div>

From industry (Bleukx et al., CP 2025), part of the MiniZinc Challenge 2026.

<v-clicks>

- $N$ **teams**, $K$ **tasks**
- Every task has a duration and a **time window**: we decide *when* it starts
- Only **compatible** teams can do a task
- A team does one task at a time and has **unavailabilities**
- **Precedences** and **same-team groups**

</v-clicks>

</div>
<div v-click>

**Objectives** (lexicographic)

1. Minimize the number of teams
2. Minimize unfairness: max − min working time

$$\Big(\sum_j d_j\Big) \cdot \#\text{teams} + (\max - \min)$$

</div>
</div>

---
 
## Sounds familiar?

<div class="grid grid-cols-2 gap-10 mt-2">
<div>

**Session #1:** workers, tasks with **fixed** times

$$s_i \leq x_{i,j} \cdot \alpha_j + (1 - x_{i,j}) \cdot M$$

</div>
<div v-click>

**Today:** the start times are **variables** too. As a MIP, every pair of tasks $(a, b)$ that might share a team needs an ordering binary, a "same team" variable and two Big-M constraints: $O(K^2)$ of them.

</div>
</div>

<div v-click class="mt-6">

<img src="/assets/workforce_baby.png" class="w-full" />

<div class="text-sm opacity-70 mt-1 text-center">

Baby example: 6 tasks, 3 teams, team 0 has a lunch break (hatched). Optimal: 2 teams, cost 26.

</div>

</div>

---

## Interval variables

<div class="iv-demo">
  <div class="iv-line"><span class="iv-label">team k</span>
    <div class="iv-track">
      <div class="iv-box" style="left: 18%; width: 34%;">task j</div>
      <div class="iv-off" style="left: 60%; width: 12%;">lunch</div>
    </div>
  </div>
  <div class="iv-legend">
    <span style="left: 18%;">start<sub>j</sub></span>
    <span style="left: 52%;">start<sub>j</sub> + d<sub>j</sub></span>
  </div>
</div>

<v-clicks>

- An **interval** has a start, a size and an end with $start + size = end$
- An **optional interval** has a **presence literal**: it only exists if the literal is true
- One optional interval per (task $j$, team $k$), present iff $x_{j,k}$
- `add_no_overlap(intervals of team k)` lets only **present** intervals take part

</v-clicks>

<style scoped>
.iv-demo { margin: 1.5rem 0 2rem; }
.iv-line { display: flex; align-items: center; gap: 1rem; }
.iv-label { width: 4rem; color: #52514e; font-size: 0.9rem; }
.iv-track { position: relative; flex: 1; height: 2.2rem; border-bottom: 1px solid #c3c2b7; }
.iv-box, .iv-off { position: absolute; top: 0.2rem; height: 1.8rem; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
.iv-box { background: #4682b4; color: white; font-weight: 700; }
.iv-off { background: repeating-linear-gradient(45deg, #e1e0d9, #e1e0d9 4px, #f4f4f2 4px, #f4f4f2 8px); color: #52514e; }
.iv-legend { position: relative; height: 1.4rem; margin-left: 5rem; font-size: 0.75rem; color: #52514e; }
.iv-legend span { position: absolute; transform: translateX(-50%); }
</style>

---

## The model

```python {all|2-3|4-6|8-12|all}
# Variables
x = {(t.id, k): model.new_bool_var("") for t in tasks for k in t.compatible_teams}
start = {t.id: model.new_int_var(t.release, t.due - t.duration, "") for t in tasks}
interval = {(t.id, k): model.new_optional_fixed_size_interval_var(
                start[t.id], t.duration, x[t.id, k], "")
            for t in tasks for k in t.compatible_teams}

for t in tasks:  # every task is done by exactly one compatible team
    model.add_exactly_one(x[t.id, k] for k in t.compatible_teams)
for k in teams:  # one task at a time, respect the calendar
    off = [model.new_fixed_size_interval_var(u.start, u.duration, "") for u in unavailable[k]]
    model.add_no_overlap([interval[t.id, k] for t in tasks if (t.id, k) in interval] + off)
```

<v-click>

No ordering variables, no Big-M. Precedences, same-team groups and the fairness objective are a few linear constraints (see notebook).

</v-click>

---

## A challenge instance: 58 tasks, 18 teams

<img src="/assets/workforce_71.png" class="mt-4" />

<v-click>

**Optimal**: 5 teams, perfectly fair (405 each). CP-SAT proves it in **under a second**.

</v-click>

---
layout: image-right
image: c
---

## Best practice: break symmetries

Most teams are **interchangeable**: same skills, same calendar.

A solution with 5 teams can be relabeled in $18 \cdot 17 \cdot 16 \cdot 15 \cdot 14 > 10^6$ ways.

<v-click>

```python
# interchangeable teams k1 < k2
model.add(used[k1] >= used[k2])
model.add(worked[k1] >= worked[k2])
```

</v-click>

<v-click>

| (2 workers, 120 s) | best | bound |
|---|---|---|
| without | 10125 | 2163 |
| **with** | **10125** | **10125** in 0.7 s |

</v-click>

<!--
Callback to session 1: same meme! Without symmetry breaking CP-SAT finds the optimum quickly but cannot prove it.
-->

---

## [Live: CP-SAT vs. MIP](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb)

Same instances, same symmetry breaking, tight pair-specific Big-M for the MIP (Pyomo + HiGHS), 30 s each:

<div class="text-sm compact">

| Instance | Tasks | CP-SAT | time | MIP (HiGHS) | bound | time |
|---|---|---|---|---|---|---|
| instance_202 | 26 | **1125** | 0.1 s | **1125** | 1125 | 5.2 s |
| instance_24_56 | 25 | **1425** | 0.1 s | **1425** | 1425 | 0.4 s |
| instance_71 | 58 | **10125** | 0.4 s | no solution | 4050 | 30 s |
| instance_19 | 62 | **9000** | 0.7 s | 21690 | 3600 | 30 s |

</div>

<v-click>

MIP is **not hopeless**: on small instances HiGHS keeps up. The disjunctive structure at scale is what hurts.

<div class="text-xs opacity-60">Measured locally with the complete notebook; your Colab numbers will differ slightly.</div>

</v-click>

<v-click>

<div class="text-sm opacity-70 mt-2">

MiniZinc Challenge (1 core, 20 min): CP-SAT proved all 5 instances optimal, Gurobi 3. On two instances Gurobi's best solution was **20% and 40% worse**.

</div>

</v-click>

<style scoped>
.compact :deep(td), .compact :deep(th) { padding-top: 0.3rem; padding-bottom: 0.3rem; }
</style>




---
layout: image-right
image: https://images.unsplash.com/photo-1701448150058-43d6d199b103?q=80&w=1287&auto=format&fit=crop
---

# What is inside CP&#8209;SAT?
Chapter 3

---
   
## SAT solving: conflict-driven clause learning (CDCL)

<div class="grid grid-cols-2 gap-10 mt-4">
<div>

Boolean variables, constraints are **clauses**:

$$(\neg a \lor b) \land (\neg b \lor c) \land (\neg a \lor \neg c)$$

<v-clicks>

1. **Decide** $a = 1$
2. **Propagate** $b = 1$, then $c = 1$
3. **Conflict:** $(\neg a \lor \neg c)$ is violated
4. **Learn** the clause $(\neg a)$ and jump back

</v-clicks>

</div>
<div v-click>

The learned clause stays for the rest of the search: the solver never makes the same mistake twice.

<br>

Modern SAT solvers handle **millions of variables** this way.

</div>
</div>

---

## Lazy Clause Generation = CP + SAT

<div class="grid grid-cols-2 gap-10 mt-4">
<div>

<v-clicks>

- Integer variables are linked to Boolean literals like $[x \geq 7]$, created **lazily** when needed
- Every propagator **explains** what it deduces as a clause:

$$\neg[x \geq 7] \lor [y \leq 5] \quad \text{(from } x + y \leq 12\text{)}$$

- The SAT engine can now **learn from conflicts across all constraints**, including global ones like `no_overlap` or `circuit`

</v-clicks>

</div>

</div>

---

## CP-SAT: five components

<v-clicks>

1. A **clause learning SAT solver** at the core
2. A **CP layer** with Boolean, integer and interval variables, and scheduling & routing constraints
3. A **simplex** for a global **linear relaxation**: relaxation, cuts, heuristics, duality, like a MIP solver
4. One unified model representation (protobuf) through presolve, search and LNS
5. A **portfolio of specialized workers** that share bounds and solutions

</v-clicks>

<div v-click class="mt-6 text-sm opacity-70">

Source: official CP-SAT description, MiniZinc Challenge 2026. The details: [CPAIOR 2020 masterclass](https://www.youtube.com/watch?v=lmy1ddn4cyw) by Laurent Perron and Frédéric Didier.

</div>

---

## The portfolio in the solver log

```text {all|3|4|5|7-8}
Starting search at 0.05s with 8 workers.
...
6 full problem subsolvers: [core, default_lp, fixed, max_lp, no_lp, quick_restart]
2 first solution subsolvers: [fj, fs_random_no_lp]
13 interleaved subsolvers: [feasibility_pump, graph_arc_lns, ..., scheduling_intervals_lns, ...]

#1       0.06s best:34590 next:[120,34589] fj_restart
#2       0.07s best:20640 next:[2025,20639] no_lp
```

<v-clicks>

- Different strategies run **in parallel** and share what they find: with and without LP, core-based, large neighborhood search, feasibility jump, ...
- `solver.parameters.num_workers` (default: all cores) and `log_search_progress = True`
- **Read the log!** It tells you what presolve did and which worker found which solution.

</v-clicks>

<!--
Log taken from our workforce model (instance_71, 8 workers).
-->

---

## Want to go deeper?

<div class="mt-8">

- [**The CP-SAT Primer**](https://d-krupke.github.io/cpsat-primer/) by Dominik Krupke: the best guide to CP-SAT
- [**CPAIOR 2020 masterclass**](https://www.youtube.com/watch?v=lmy1ddn4cyw) by Laurent Perron and Frédéric Didier: how CP-SAT works inside
- [**OR-Tools documentation**](https://developers.google.com/optimization/cp)

</div>





---
layout: image-right
image: https://images.unsplash.com/photo-1466094899371-97b327dff551?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

# When to use CP-SAT?
Chapter 4

---

## CP-SAT vs. Gurobi, problem by problem from the 2026 Challenge

<div class="grid grid-cols-[3fr_2fr] gap-8">
<div>

<HeadToHead />

</div>
<div class="text-sm mt-6">

<v-clicks>

- Head-to-head points per problem (free category, 1 core, 5 instances each)
- CP-SAT wins **15 of 20** problems
- Gurobi wins on **warehouse** (facility location), **surface-based TSP** and **gbac**: problems with strong LP relaxations
- Our three use cases: **nonogram 4.5 : 0.5, orthorio 4.1 : 0.9, workforce 3.4 : 1.6**

</v-clicks>

</div>
</div>

---
 
## When to use CP-SAT, when to use MIP?

| CP-SAT shines | MIP shines |
|---|---|
| Scheduling with disjunctions: intervals, no-overlap, calendars | Strong LP relaxations: flows, network design |
| Logical and combinatorial constraints, pure feasibility | Continuous variables, huge linear models |
| Routing with side constraints (`add_circuit`) | Facility location, classic TSP formulations |
| Small to medium integer domains | Very large numbers, fractional data |

<v-click>

**Know both tools.** And remember: CP-SAT has an LP relaxation inside, so it brings a bit of both worlds.

</v-click>

---

## Best practices for scalable CP-SAT models

<v-clicks>

1. **Tight domains** for every integer variable
2. **Enforcement literals** (`only_enforce_if`) instead of Big-M
3. **Global constraints** instead of hand-made decompositions
4. **Break symmetries** and add **dominance rules**
5. **Booleans** over integer "labels" where possible
6. **Use all cores** and **read the log**
7. Integers only: **scale** fractional data

</v-clicks>

---

## Further Topics

<v-clicks depth="2">

More constraints for your toolbox:
- `add_no_overlap_2d` (packing), `add_cumulative` (resources with capacity), `add_reservoir_constraint`
- `add_multiple_circuit` (vehicle routing), `add_element`, `add_allowed_assignments` (tables)

More solver features:
- Solution hints (`add_hint`) and warm starts
- Assumptions for explaining infeasibility
- Callbacks for intermediate solutions

</v-clicks>

---
layout: cover
background: https://images.unsplash.com/photo-1466094899371-97b327dff551?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

<br>
<br>

## Thank you! Any questions?

<br>
<br>
<br>
<br>

<div class="flex flex-col gap-4 mt-8">

  <a href="https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb" target="_blank" class="flex items-center gap-2 text-xl opacity-85 hover:opacity-100">
    <carbon-logo-python class="text-2xl" /> All the code to run in Google Colab
  </a>
  <a href="https://www.youtube.com/@Optimization4All/playlists" target="_blank" class="flex items-center gap-2 text-xl opacity-85 hover:opacity-100">
    <carbon-logo-youtube class="text-2xl" /> More O4A Hands-On Sessions
  </a>
  <a href="https://www.linkedin.com/in/jens-peter-joost/" target="_blank" class="flex items-center gap-2 text-xl opacity-85 hover:opacity-100">
    <carbon-logo-linkedin class="text-2xl" /> Let's connect
  </a>
</div>

<br>
<br>
<br>
<br>

jpjsolutions.com/presentations/hands-on-cp-sat
