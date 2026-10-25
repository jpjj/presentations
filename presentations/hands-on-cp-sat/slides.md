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

# Hello!

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

I will later insert the iframe to the website I created for all the different problems. I will pick some here and browse a little bit for people to understand that it CP-SAT is useful in solving a bit variaty of OR problems.



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

<v-clicks>

- **Open source** (Apache 2.0), part of Google OR-Tools, free for commercial use
- `pip install ortools` and you are ready to go: Python, C++, Java, C#
- Excellent free learning material: [**The CP-SAT Primer**](https://d-krupke.github.io/cpsat-primer/) by Dominik Krupke
- And it is **easy to model**. Let's see!

</v-clicks>

---

## Your first CP-SAT model: an assignment problem

<div class="grid grid-cols-[2fr_3fr] gap-8 mt-2">
<div>

4 workers, 4 jobs, a cost per (worker, job).

Every worker does exactly one job, every job is done by exactly one worker.

<div class="text-sm mt-4">

| | Excav. | Concr. | Wiring | Paint. |
|---|---|---|---|---|
| Ana | 90 | 80 | 75 | **70** |
| Ben | 35 | 85 | **55** | 65 |
| Chloe | 125 | **95** | 90 | 95 |
| David | **45** | 110 | 95 | 115 |

</div>

<div v-click="5" class="text-sm">

Optimal: **265**

</div>

</div>
<div>

```python {all|1|3|5-8|10|12-13}
model = cp_model.CpModel()

x = {(w, j): model.new_bool_var("") for w in W for j in J}

for w in W:  # every worker does exactly one job
    model.add(sum(x[w, j] for j in J) == 1)
for j in J:  # every job is done by exactly one worker
    model.add(sum(x[w, j] for w in W) == 1)

model.minimize(sum(cost[w][j] * x[w, j] for w in W for j in J))

solver = cp_model.CpSolver()
status = solver.solve(model)
```

<div class="text-sm opacity-70 mt-2">

Looks just like a MIP. And that's fine!

</div>

</div>
</div>

<!--
Four steps: model, variables, constraints + objective, solve. Whoever has written a MIP feels at home.
-->

---

## The same model, the CP-SAT way

<div class="grid grid-cols-[3fr_2fr] gap-8 mt-2">
<div>

```python {all|3|5|6-7|9}
model = cp_model.CpModel()

job_of = [model.new_int_var(0, 3, "") for w in W]   # which job?
cost_of = [model.new_int_var(0, 125, "") for w in W]

model.add_all_different(job_of)
for w in W:  # cost_of[w] == cost[w][job_of[w]]
    model.add_element(job_of[w], cost[w], cost_of[w])

model.minimize(sum(cost_of))
```

</div>
<div class="text-sm">

<v-clicks>

- Say **what you mean**: "which job does Ana do?" is one integer, not four Booleans
- `add_all_different`: both families of constraints in **one line**
- `add_element`: look up a value with a variable index
- These are **global constraints**: they capture a whole substructure, and the solver has specialized algorithms for each of them

</v-clicks>

</div>
</div>

<div v-click class="mt-6">

**The CP-SAT way:** find the structure in your problem and use the global constraint that describes it. Let's do this on a real problem!

</div>

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

</div>
</div>

<div v-click class="mt-8 text-xl text-center">

That's a lot at once. Let's **slice the elephant**.

</div>

---

## Slicing the elephant

<div class="steps mt-4">

<div class="step-row" v-click>
  <div class="step-num">1</div>
  <div><b>Who does what?</b> Fixed start times, compatibility, minimize #teams</div>
  <div class="step-tag">intervals, <code>add_no_overlap</code></div>
</div>

<div class="step-row breakout" v-click>
  <div class="step-num">🗣️</div>
  <div><b>Breakout 1</b></div>
  <div></div>
</div>

<div class="step-row" v-click>
  <div class="step-num">2</div>
  <div><b>When?</b> Time windows: we decide the start times</div>
  <div class="step-tag">enforcement literals</div>
</div>

<div class="step-row" v-click>
  <div class="step-num">3</div>
  <div><b>The real world:</b> precedences, same-team groups, lunch breaks</div>
  <div class="step-tag">fixed intervals</div>
</div>

<div class="step-row breakout" v-click>
  <div class="step-num">🗣️</div>
  <div><b>Breakout 2</b></div>
  <div></div>
</div>

<div class="step-row last" v-click>
  <div class="step-num">4</div>
  <div><b>Fair is fair:</b> fairness as a second objective</div>
  <div class="step-tag">lexicographic objectives</div>
</div>

</div>

<div v-click class="mt-6 text-sm opacity-80">

Steps 1 and 2: first the **MIP way**, then the **CP-SAT way**. Everything is in the notebook.

</div>

<style scoped>
.step-row {
  display: grid;
  grid-template-columns: 3rem 1fr 14rem;
  align-items: center;
  gap: 1rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.step-row.last { border-bottom: none; }
.step-row.breakout { color: #52514e; font-size: 0.9rem; }
.step-num {
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 1.6rem;
  font-weight: 600;
  color: #0c384a;
  line-height: 1;
  text-align: center;
}
.step-tag { font-size: 0.85rem; color: #52514e; }
</style>

---

## Step 1: Who does what?

<v-clicks>

- For now, every task has a **fixed start time**: $release + duration = due$
- Decide only which **compatible** team does which task
- A team does one task at a time
- Minimize the number of teams used

</v-clicks>

<div v-click class="mt-6">

<img src="/assets/workforce_baby_step1.png" class="w-full" />

<div class="text-sm opacity-70 mt-1 text-center">

Baby example: 6 tasks, 3 teams. Tasks 0, 1 and 4 all run between 1 and 2: we need **3 teams**.

</div>

</div>

---

## Step 1: the MIP way

<div class="grid grid-cols-[3fr_2fr] gap-8 mt-2">
<div>

```python {all|2-3|5-6|7-8|10-13|15}
# x[j, k]: team k does task j     used[k]: team k is used
x = {(t.id, k): model.new_bool_var("") for t in tasks for k in t.compatible_teams}
used = {k: model.new_bool_var("") for k in teams}

for t in tasks:  # every task is done by one compatible team
    model.add_exactly_one(x[t.id, k] for k in t.compatible_teams)
for (j, k) in x:  # a team that does a task is used
    model.add_implication(x[j, k], used[k])

for a, b in combinations(tasks, 2):
    if a.release < b.due and b.release < a.due:  # overlap in time
        for k in set(a.compatible_teams) & set(b.compatible_teams):
            model.add(x[a.id, k] + x[b.id, k] <= 1)

model.minimize(sum(used.values()))
```

</div>
<div class="text-sm mt-4">

<v-clicks>

- One constraint per **pair** of overlapping tasks and per team that could do both
- Works fine. But the solver sees thousands of small, unrelated constraints instead of the structure behind them:

</v-clicks>

<div v-click class="mt-4 text-base">

*Every team has a timeline, and its tasks must not overlap on it.*

</div>

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

## Step 1: the CP-SAT way

```python {all|1|3-6|7}
start = {t.id: t.release for t in tasks}  # fixed start times, for now
for k in teams:
    intervals = [model.new_optional_fixed_size_interval_var(
                     start[t.id], t.duration, x[t.id, k], "")
                 for t in tasks
                 if k in t.compatible_teams]
    model.add_no_overlap(intervals)
```

<v-clicks>

- Replaces all the pairwise constraints: **one global constraint per team**
- Same answer on the baby example: **3 teams**
- Note: `start` is just a parameter here. Keep that in mind!

</v-clicks>

---
layout: center
class: text-center
---

# 🗣️ Breakout session 1

<div class="text-left mt-8 text-lg">

In reality, a customer gives us a **time window**, and *we* decide when a task starts.

<v-clicks>

- What changes in the **MIP way**? Which new variables and constraints do you need? How many?
- What changes in the **CP-SAT way**?
- Can we save a team in the baby example?

</v-clicks>

</div>

<!--
~10 minutes. Afterwards collect answers: ordering variables per pair, Big-M / enforcement literals. CP-SAT way: almost nothing changes.
-->

---

## Step 2: When? Time windows

<v-clicks>

- Every task gets a real time window, the start time becomes a **variable**
- The time window is the variable's **domain**, no constraints needed:

</v-clicks>

<v-click>

```python
start = {t.id: model.new_int_var(t.release, t.due - t.duration, "") for t in tasks}
```

</v-click>

<div v-click class="mt-6">

<img src="/assets/workforce_baby_step2.png" class="w-full" />

<div class="text-sm opacity-70 mt-1 text-center">

The flexibility saves a team: **2 teams** are enough now.

</div>

</div>

---

## Step 2: the MIP way

```python {all|2|3|4-7}
for a, b in combinations(tasks, 2):
    if a.release < b.due and b.release < a.due:  # windows overlap
        a_first = model.new_bool_var("")
        for k in set(a.compatible_teams) & set(b.compatible_teams):
            xa, xb = x[a.id, k], x[b.id, k]
            model.add(start[a.id] + a.duration <= start[b.id]).only_enforce_if(xa, xb, a_first)
            model.add(start[b.id] + b.duration <= start[a.id]).only_enforce_if(xa, xb, ~a_first)
```

<div class="grid grid-cols-[1fr_1.5fr_1fr] gap-6 mt-6 text-sm">

<div v-click>

If two tasks share a team, **one of them comes first**: a new Boolean per pair.

</div>

<div v-click>

In a MIP solver, this is a **Big-M** constraint:

$$s_a + d_a \leq s_b + M (3 - x_{a,k} - x_{b,k} - first)$$

</div>

<div v-click>

In CP-SAT: an **enforcement literal**. The constraint only holds if all literals are true. No $M$ to choose!

</div>

</div>

---

## Step 2: the CP-SAT way

```diff
- start = {t.id: t.release for t in tasks}
+ start = {t.id: model.new_int_var(t.release, t.due - t.duration, "") for t in tasks}
```

<v-click>

**That's it.** The intervals move along with their start, the rest of the model stays the same.

</v-click>

<div v-click class="mt-8">

Model size on a challenge instance (58 tasks, 18 teams):

| | variables | constraints |
|---|---|---|
| MIP way | 1,725 | 22,740 |
| CP-SAT way | 1,088 | 2,118 |

<div class="text-sm opacity-70">

The MIP way grows with *pairs of tasks × teams*, the CP-SAT way with *compatible (task, team) pairs*.

</div>

</div>

---

## Step 3: The real world strikes back

<div class="grid grid-cols-[3fr_2fr] gap-8 mt-2">
<div>

```python {all|1-3|5-6|8-11}
# lunch breaks: fixed intervals in the same no_overlap
intervals += [model.new_fixed_size_interval_var(u.start, u.duration, "")
              for u in team.unavailabilities]

for a, b in problem.precedence:  # a ends before b starts
    model.add(start[a] + duration[a] <= start[b])

for first, *others in problem.same_team:  # same team
    for other in others:
        for k in teams:
            model.add(x.get((first, k), 0) == x.get((other, k), 0))
```

</div>
<div class="text-sm">

<v-clicks>

- An unavailability is an interval that is **always present**. One new line!
- Precedences: one linear constraint each
- Same-team groups: equal assignment variables

</v-clicks>

</div>
</div>

<div v-click class="mt-4">

<img src="/assets/workforce_baby_step3.png" class="w-5/6 mx-auto" />

<div class="text-sm opacity-70 mt-1 text-center">

Team 0 has lunch from 4 to 5, task 0 before task 2, tasks 3 and 5 by the same team. Still **2 teams**. Is the work shared fairly? Only by luck.

</div>

</div>

---
layout: center
class: text-center
---

# 🗣️ Breakout session 2

<div class="text-left mt-8 text-lg">

Second objective: **fairness**, the max − min working time of the **used** teams. The number of teams still comes first.

<v-clicks>

- How do you model the maximum and the minimum working time?
- Why is the minimum harder than the maximum?
- How do you combine two objectives, so that saving a team always beats fairness?

</v-clicks>

</div>

<!--
~10 minutes. Key insights: min over used teams needs an enforcement literal; weight the first objective with the total duration.
-->

---

## Step 4: Fair is fair

<div class="grid grid-cols-[3fr_2fr] gap-8 mt-2">
<div>

```python {all|1-2|3-4|5-7|9}
worked = {k: sum(t.duration * x[t.id, k] for t in tasks if k in t.compatible_teams)
          for k in teams}
max_worked = model.new_int_var(0, total, "")
min_worked = model.new_int_var(0, total, "")
for k in teams:
    model.add(max_worked >= worked[k])
    model.add(min_worked <= worked[k]).only_enforce_if(used[k])

model.minimize(total * sum(used.values()) + max_worked - min_worked)
```

</div>
<div class="text-sm">

<v-clicks>

- Unused teams work 0: without the enforcement literal, they pull the minimum down to 0
- Lexicographic: the unfairness is always smaller than the total duration, so **saving a team always wins**

</v-clicks>

</div>
</div>

<div v-click class="mt-4">

<img src="/assets/workforce_baby_step4.png" class="w-5/6 mx-auto" />

<div class="text-sm opacity-70 mt-1 text-center">

Optimal: 2 teams, unfairness 2, cost $12 \cdot 2 + 2 = 26$. Why is 6/6 impossible? (Hint: tasks 3 and 5.)

</div>

</div>

---

## A challenge instance: 58 tasks, 18 teams

<img src="/assets/workforce_71.png" class="mt-4" />

<v-click>

CP-SAT finds this solution quickly. But **proving** that it is optimal is hard: on Colab's 2 cores, the bound is still far off after 20 seconds.

</v-click>

---
layout: image-right
image: /assets/meme_symmetry.png
backgroundSize: contain
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

| (2 cores, 20 s) | best | bound |
|---|---|---|
| without | 10125 | 2357 |
| **with** | **10125** | **10125** in 0.3 s |

**Optimal:** 5 teams, perfectly fair (405 each).

</v-click>

---

## [Live: the MIP way vs. the CP-SAT way](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb)

Same solver, same constraints, same symmetry breaking, 30 s each. The only difference: how we model *one task at a time*.

<div class="text-sm compact">

| Instance | Tasks | constraints MIP way | constraints CP-SAT way | MIP way | CP-SAT way |
|---|---|---|---|---|---|
| instance_202 | 26 | 5,261 | 1,175 | optimal, 0.3 s | optimal, 0.1 s |
| instance_24_56 | 25 | 4,431 | 1,083 | optimal, 0.2 s | optimal, 0.2 s |
| instance_71 | 58 | 23,013 | 2,391 | optimal, 7.3 s | optimal, **0.6 s** |
| instance_19 | 62 | 33,501 | 2,931 | 9000, bound 7200 | optimal, **0.4 s** |

</div>

<v-click>

On small instances, the MIP way keeps up. At scale, the global constraint wins. On Colab's 2 cores, the MIP way does not even prove instance_71 optimal within 30 s.

<div class="text-xs opacity-60">Measured locally (16 cores) with the complete notebook; your Colab numbers will differ.</div>

</v-click>

<v-click>

<div class="text-sm opacity-70 mt-2">

MiniZinc Challenge (1 core, 20 min): CP-SAT proved all 5 workforce instances optimal, Gurobi (non-eligible reference entry) 3. On two instances Gurobi's best solution was **20% and 40% worse**.

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
- Our workforce problem: **3.4 : 1.6** for CP-SAT

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
