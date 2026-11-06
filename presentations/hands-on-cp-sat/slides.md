---
theme: default
colorSchema: light
routerMode: hash
favicon: 'https://raw.githubusercontent.com/jpjj/jpjj.github.io/main/assets/favicon_jpjsolutions.png'
background: https://images.unsplash.com/photo-1606567595334-d39972c85dbe?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D
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

<div class="absolute bottom-6 left-14 text-xs opacity-60">



All code runs in Google Colab: [homework notebook](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_homework.ipynb) · [complete notebook](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb)

</div>

<!--
Ask: Who did the homework? Hands up / emoji in the chat.
-->

---
layout: image-right
image: https://images.unsplash.com/photo-1621088358485-6bbd5bb488b2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D 
#https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=1287&auto=format&fit=crop
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


60 problems featured in the last 3 years of the MiniZinc Challenge:
- [jpjsolutions.com/minizinc-challenge](https://jpjsolutions.com/minizinc-challenge)



<!--
Pick a few problems and browse a little, to show the wide variety of OR problems CP-SAT solves well.
Clicking into the iframe gives it the keyboard focus: click outside it (e.g. on the title) before using the arrow keys to move on.
-->



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

</v-clicks>

---

## Your first CP-SAT model: an assignment problem

<div class="grid grid-cols-[2fr_3fr] gap-8 mt-2">
<div>

<br>

- Given $n$ workers, $n$ jobs, a cost $c$ per (worker, job) pair.
- Every worker does exactly one job, every job is done by exactly one worker.
- Minimze the total cost.



</div>
<div>

<v-clicks>

Model it like an IP:

```python {all|2|4|6-9|11|13-14}
J, W = range(n), range(n)
model = cp_model.CpModel()

x = {(w, j): model.new_bool_var("") for w in W for j in J}

for w in W:  # every worker does exactly one job
    model.add(sum(x[w, j] for j in J) == 1)
for j in J:  # every job is done by exactly one worker
    model.add(sum(x[w, j] for w in W) == 1)

model.minimize(sum(c[w, j] * x[w, j] for w in W for j in J))

solver = cp_model.CpSolver()
status = solver.solve(model)
```

</v-clicks>

</div>
</div>

<!--
Four steps: model, variables, constraints + objective, solve. Whoever has written a MIP feels at home.
-->

---

## Global constraints

<div class="grid grid-cols-[3fr_2fr] gap-8 mt-2">
<div>

```python {all|6,8}
model = cp_model.CpModel()

x = {(w, j): model.new_bool_var("") for w in W for j in J}

for j in J:  # every job is done by exactly one worker
    model.add_exactly_one(x[w, j] for w in W)
for w in W:  # every worker does exactly one job
    model.add_exactly_one(x[w, j] for j in J)

model.minimize(sum(cost[w][j] * x[w, j] for w in W for j in J))
```

</div>
</div>

<div v-click class="mt-6">

**Rule of thumb:** if a global constraint captures a substructure of your problem, use it. The model gets more concise, and the solver gets more insight into its structure. Let's do this on a real problem!

</div>

---
layout: image-right
image: https://images.unsplash.com/photo-1588591795084-1770cb3be374?q=80&w=1287&auto=format&fit=crop
---

# Let's model!
Chapter 2



---
layout: image-right
image: https://images.unsplash.com/photo-1714632427779-7a7fc09ec9ed?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D&auto=format&fit=crop
#https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1287&auto=format&fit=crop
---
 
# Workforce Allocation & Scheduling
Chapter 2

---

## The problem

<div class="grid grid-cols-2 gap-10 mt-2">
<div>

From industry (Bleukx et al., CP 2025, KU Leuven & Airbus)


<v-clicks>

- $K$ **teams**, $J$ **jobs**
- Every job has a duration and a **time window**: we decide *when* it starts
- Teams and jobs must be **compatible**


</v-clicks>

</div>
<v-clicks>

- A team does one job at a time and has **unavailabilities**
- **Precedences** and **same-team groups**

- **Objectives** (lexicographic)

  1. Minimize the number of teams
  2. Minimize unfairness: max − min working time

</v-clicks>
</div>

<img src="/assets/workforce_baby_problem3.png" class="w-5/6 mx-auto" />
<!-- KU Leuven and Airbus -->
---
layout: two-cols-header
layout-Class: gap-8
---

## Data Structures

::left:: 

- Teams
- Jobs
- Time Intervals
- A Problem Class

```python
TeamId = NewType("TeamId", int)
JobId = NewType("JobId", int)


class TimeInterval(BaseModel, frozen=True):
    """A period of time [start, end)."""

    start: int = Field(ge=0)
    end: int = Field(gt=0)

    @property
    def duration(self) -> int:
        return self.end - self.start
```


::right::


<v-click at="-1" >

```python
class Team(BaseModel, frozen=True):
    id: TeamId
    unavailabilities: list[TimeInterval] = []


class Job(BaseModel, frozen=True):
    id: JobId
    release: int = Field(ge=0)
    due: int = Field(gt=0)
    duration: int = Field(gt=0)
    compatible_teams: list[TeamId]


class WorkforceProblem(BaseModel):
    """Represents the problem instance."""

    name: str = ""
    teams: list[Team]
    jobs: list[Job]
    precedence: list[tuple[JobId, JobId]] = []
    same_team: list[list[JobId]] = []
```


</v-click>
---
layout: two-cols-header
layout-Class: gap-8
---

## What do we need?

::left::

<v-clicks>

Like in MIP modeling:
- Variables
- Constraints
- Objective Function

</v-clicks>

<v-clicks>

**15 min Breakout session!**

</v-clicks>

::right::

<v-clicks>

- $x_{j,k} \in \{0,1\}$, $j\in K_j$ assigning job $j$ to team $k$
    - $K_j$ is the set of teams compatible with job $j$
- $used_k \in \{0,1\}$ tracking whether team $k$ is used
- $s_j \in \mathbb{Z}\cap [r_j, D_j - d_j]$ start time of job $j$
    - $r_j$: Release date of job $j$
    - $D_j$: Due date of job $j$
    - $d_j$: duration of job $j$

</v-clicks>

<!-- hier eine Slide -->

---

## Lets define functions to create the variables

<br>

<v-clicks>

```python
def add_assignment_variables(model: cp_model.CpModel, problem: WorkforceProblem):
    """x[j, k] = 1: job j is assigned to team k"""
    return {
        (job.id, k): model.new_bool_var(f"x_{job.id}_{k}")
        for job in problem.jobs
        for k in job.compatible_teams
    }
```

```python
def add_used_team_variables(model: cp_model.CpModel, problem: WorkforceProblem):
    """used[k] = 1: team k does at least one job"""
    return {team.id: model.new_bool_var(f"used_{team.id}") for team in problem.teams}
```

```python
def add_start_times_variables(model: cp_model.CpModel, problem: WorkforceProblem):
    """start[j] = z: job j starts at time z"""
    return {
        job.id: model.new_int_var(
            job.release, job.due - job.duration, f"start_{job.id}"
        )
        for job in problem.jobs
    }
```
</v-clicks>

---

## The Integer Programming (IP) way: assignment

<br>

<v-clicks>

- Assignment constraint: 
    - $\sum_{k \in K_j} x_{j,k} = 1 \quad \forall j \in J$
- Connecting assignment to usage:
    - $x_{j,k} \leq used_k \quad \forall j,\ k \in K_j$

</v-clicks>

<br>

<v-click>

```python
def add_assignment_constraints_ip(
    model: cp_model.CpModel, problem: WorkforceProblem, x, used
):
    """Every job is done by exactly one compatible team, a team that does a job is used."""
    for job in problem.jobs:
        model.add(sum(x[job.id, k] for k in job.compatible_teams) == 1)
    for j, k in x:
        model.add(x[j, k] <= used[k])
```

</v-click>



---

## The IP way: one job at a time

<br>

<v-clicks>

- If two jobs $a$, $b$ share a team, **one of them comes first**:
    - a new Boolean $y_{a,b}$ per pair of overlapping time windows, $y_{a,b} = 1$: $a$ comes first
- $a$ before $b$ on team $k$:
    - $s_a + d_a \leq s_b + M_{ab}\,(3 - x_{a,k} - x_{b,k} - y_{a,b}) \quad \forall\, a, b \text{ overlapping},\ k \in K_a \cap K_b$
- $b$ before $a$ on team $k$:
    - $s_b + d_b \leq s_a + M_{ba}\,(2 - x_{a,k} - x_{b,k} + y_{a,b}) \quad \forall\, a, b \text{ overlapping},\ k \in K_a \cap K_b$

</v-clicks>

---

## The IP way: one job at a time, in code

<br>

```python
def add_no_overlap_constraints_ip(
    model: cp_model.CpModel, problem: WorkforceProblem, x, start
):
    """Two jobs on the same team must not overlap: one of them comes first."""
    for a, b in combinations(problem.jobs, 2):
        if a.release < b.due and b.release < a.due:  # windows overlap
            y_ab = model.new_bool_var(f"y_{a.id}_{b.id}")
            M_ab, M_ba = a.due - b.release, b.due - a.release
            for k in set(a.compatible_teams) & set(b.compatible_teams):
                xa, xb = x[a.id, k], x[b.id, k]
                model.add(
                    start[a.id] + a.duration
                    <= start[b.id] + M_ab * (3 - xa - xb - y_ab)
                )
                model.add(
                    start[b.id] + b.duration
                    <= start[a.id] + M_ba * (2 - xa - xb + y_ab)
                )
```

---

## How big is $M$?



$$
s_a + d_a \leq s_b + M_{ab}\,\underbrace{(3 - x_{a,k} - x_{b,k} - y_{a,b})}_{=:\ \beta}
$$

<v-clicks>

- $\beta = 0$: both jobs on team $k$ **and** $a$ first. Then $s_a + d_a \leq s_b$ is enforced.
- $\beta \geq 1$: the constraint must be **switched off**, i.e. it may never cut anything:

</v-clicks>

<v-click>

$$
M_{ab} \geq \max\,(s_a + d_a - s_b) = (D_a - d_a) + d_a - r_b = D_a - r_b
$$

</v-click>



<!--
Ask the audience first: what happens if M is too small? Too large?
-->

---

## The IP way: lunch breaks

<br>

<v-clicks>

- In short: Similar to the no-overlap constraint from before.
- Unavailabilities are like jobs that must be done from that team.
- More big M constraints.

</v-clicks>


---

## The IP way: precedences and same-team groups

<br>

<v-clicks>

- Precedence: job $a$ ends before job $b$ starts:
    - $s_a + d_a \leq s_b \quad \forall (a, b) \in P$
- Same-team groups: both jobs are done by the same team:
    - $x_{a,k} = x_{b,k} \quad \forall$ groups, $\forall k \in K_a \cup K_b$
    - If only one of the two jobs is compatible with team $k$, the missing variable is $0$:
        - The other job can't be done by $k$ either.

</v-clicks>

---

## The IP way: precedences and same-team groups, in code

<br>

```python
def add_precedence_constraints(
    model: cp_model.CpModel, problem: WorkforceProblem, start
):
    """Job a ends before job b starts."""
    duration = {job.id: job.duration for job in problem.jobs}
    for a, b in problem.precedence:
        model.add(start[a] + duration[a] <= start[b])
```
<br>

```python
def add_same_team_constraints(model: cp_model.CpModel, problem: WorkforceProblem, x):
    """All jobs of a group are done by the same team."""
    for first, *others in problem.same_team:
        for other in others:
            for team in problem.teams:
                k = team.id
                if (first, k) in x or (other, k) in x:
                    model.add(x.get((first, k), 0) == x.get((other, k), 0))
```

---

## The IP way: fairness

<br>

<v-clicks>

- Working time of team $k$:
    - $w_k = \sum_{j} d_j\, x_{j,k}$
- Maximum working time:
    - $w^{max} \geq w_k \quad \forall k$
- Minimum working time of the **used** teams, with $T = \sum_j d_j$:
    - $w^{min} \leq w_k + T\,(1 - used_k) \quad \forall k$
    - Unused teams work $0$: without the Big-M, they pull the minimum down to $0$.

</v-clicks>

---

## The IP way: fairness, in code

<br>

```python
def add_fairness_constraints_ip(
    model: cp_model.CpModel, problem: WorkforceProblem, x, used
):
    """Working time per team, and its max and min over the used teams."""
    total = sum(job.duration for job in problem.jobs)
    worked = {
        k: sum(job.duration * x[job.id, k] for job in problem.jobs if (job.id, k) in x)
        for k in used
    }
    max_worked = model.new_int_var(0, total, "max_worked")
    min_worked = model.new_int_var(0, total, "min_worked")
    for k in used:
        model.add(max_worked >= worked[k])
        model.add(min_worked <= worked[k] + total * (1 - used[k]))
    return worked, max_worked, min_worked
```

---

## The objective

<br>

<v-clicks>

- Lexicographic: first the number of teams, then the unfairness:
    - $\min\ T \sum_k used_k + (w^{max} - w^{min})$
- The unfairness is always smaller than $T$, so **saving a team always wins**

</v-clicks>

<br>

<v-click>

```python
def add_objective(
    model: cp_model.CpModel, problem: WorkforceProblem, used, max_worked, min_worked
):
    """Lexicographic: first the number of teams, then the unfairness."""
    total = sum(job.duration for job in problem.jobs)
    model.minimize(total * sum(used.values()) + max_worked - min_worked)
```

</v-click>



---
layout: image-right
image: /assets/meme_symmetry.png
backgroundSize: contain
---

## One more thing! break symmetries

Teams might be **interchangeable**: same skills, same calendar.

Example: Only if there are just **5** interchangable teams, every solution would have **5! = 120** symmetric "clones".

<v-clicks>

- Use interchangeable teams $k_1 < k_2$ in order:
    - $used_{k_1} \geq used_{k_2}$
- and sort them by working time:
    - $w_{k_1} \geq w_{k_2}$

</v-clicks>

<v-click>

```python
# interchangeable teams k1 < k2
model.add(used[k1] >= used[k2])
model.add(worked[k1] >= worked[k2])
```

</v-click>

<!--
On Colab's 2 cores (20 s): without symmetry breaking best 10125, bound 2357; with it, optimal (10125) in 0.3 s. 5 teams, perfectly fair (405 each).
-->

---

## The complete IP in code

<br>

```python {all|2|3-5|7-15|17|18}
def create_ip_model(problem: WorkforceProblem):
    model = cp_model.CpModel()
    x = add_assignment_variables(model, problem)
    used = add_used_team_variables(model, problem)
    start = add_start_times_variables(model, problem)

    add_assignment_constraints_ip(model, problem, x, used)
    add_no_overlap_constraints_ip(model, problem, x, start)
    add_unavailability_constraints_ip(model, problem, x, start)
    add_precedence_constraints(model, problem, start)
    add_same_team_constraints(model, problem, x)
    worked, max_worked, min_worked = add_fairness_constraints_ip(
        model, problem, x, used
    )
    add_team_symmetry_breaking(model, problem, used, worked)

    add_objective(model, problem, used, max_worked, min_worked)
    return model, x, start
```

---

## [Live: solve the IP](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb)



---

## The CP-SAT way



---

## The CP-SAT way: assignment

<br>

<v-clicks>

- Exactly one compatible team per job, instead of $\sum_{k \in K_j} x_{j,k} = 1$:
    - $\text{ExactlyOne}(\{x_{j,k} : k \in K_j\}) \quad \forall j \in J$
- A team that does a job is used, instead of $x_{j,k} \leq used_k$:
    - $x_{j,k} \Rightarrow used_k \quad \forall j,\ k \in K_j$

</v-clicks>

<br>

<v-click>

```python
def add_assignment_constraints_cp(
    model: cp_model.CpModel, problem: WorkforceProblem, x, used
):
    """Every job is done by exactly one compatible team, a team that does a job is used."""
    for job in problem.jobs:
        model.add_exactly_one(x[job.id, k] for k in job.compatible_teams)
    for j, k in x:
        model.add_implication(x[j, k], used[k])
```

</v-click>


---

## Interval variables

<div class="iv-demo">
  <div class="iv-line"><span class="iv-label">team k</span>
    <div class="iv-track">
      <div class="iv-box" style="left: 18%; width: 34%;">job j</div>
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


## The CP-SAT way: one job at a time, lunch breaks included

<v-clicks>

- One optional interval per job $j$ and compatible team $k$, present iff $x_{j,k}$:
    - $I_{j,k} = [s_j,\ s_j + d_j)$
- A lunch break $u$ of team $k$ is an interval that is **always present**:
    - $[u^{start},\ u^{end})$
- One global constraint per team:
    - $\text{NoOverlap}(\{I_{j,k} : k \in K_j\} \cup \{\text{breaks of } k\}) \quad \forall k$
- Replaces all pairwise Big-M constraints, all $y_{a,b}$ and all $b_{j,u}$

</v-clicks>

---

## The CP-SAT way: one job at a time, in code

<br>

```python {all|7-13|14-17|18}
def add_no_overlap_constraints_cp(
    model: cp_model.CpModel, problem: WorkforceProblem, x, start
):
    """One optional interval per (job, team), plus the team's breaks. No overlap per team."""
    for team in problem.teams:
        k = team.id
        intervals = [
            model.new_optional_fixed_size_interval_var(
                start[job.id], job.duration, x[job.id, k], ""
            )
            for job in problem.jobs
            if k in job.compatible_teams
        ]
        intervals += [
            model.new_fixed_size_interval_var(u.start, u.duration, "")
            for u in team.unavailabilities
        ]
        model.add_no_overlap(intervals)
```

---

## The CP-SAT way: fairness

<v-clicks>

- Maximum working time, instead of $w^{max} \geq w_k$:
    - $w^{max} = \max_k w_k$
- Minimum working time of the **used** teams, an enforcement literal instead of $T\,(1 - used_k)$:
    - $used_k \Rightarrow w^{min} \leq w_k \quad \forall k$


</v-clicks>

---

## The CP-SAT way: fairness, in code

<br>

```python {all|12|13,14}
def add_fairness_constraints_cp(
    model: cp_model.CpModel, problem: WorkforceProblem, x, used
):
    """Working time per team, and its max and min over the used teams."""
    total = sum(job.duration for job in problem.jobs)
    worked = {
        k: sum(job.duration * x[job.id, k] for job in problem.jobs if (job.id, k) in x)
        for k in used
    }
    max_worked = model.new_int_var(0, total, "max_worked")
    min_worked = model.new_int_var(0, total, "min_worked")
    model.add_max_equality(max_worked, list(worked.values()))
    for k in used:
        model.add(min_worked <= worked[k]).only_enforce_if(used[k])
    return worked, max_worked, min_worked
```

---

## The complete CP-SAT model in code

<br>

````md magic-move {lines: true}
```python
def create_ip_model(problem: WorkforceProblem):
    model = cp_model.CpModel()
    x = add_assignment_variables(model, problem)
    used = add_used_team_variables(model, problem)
    start = add_start_times_variables(model, problem)

    add_assignment_constraints_ip(model, problem, x, used)
    add_no_overlap_constraints_ip(model, problem, x, start)
    add_unavailability_constraints_ip(model, problem, x, start)
    add_precedence_constraints(model, problem, start)
    add_same_team_constraints(model, problem, x)
    worked, max_worked, min_worked = add_fairness_constraints_ip(model, problem, x, used)
    add_team_symmetry_breaking(model, problem, used, worked)

    add_objective(model, problem, used, max_worked, min_worked)
    return model, x, start
```
```python
def create_cp_model(problem: WorkforceProblem):
    model = cp_model.CpModel()
    x = add_assignment_variables(model, problem)
    used = add_used_team_variables(model, problem)
    start = add_start_times_variables(model, problem)

    add_assignment_constraints_cp(model, problem, x, used)
    add_no_overlap_constraints_cp(model, problem, x, start)

    add_precedence_constraints(model, problem, start)
    add_same_team_constraints(model, problem, x)
    worked, max_worked, min_worked = add_fairness_constraints_cp(model, problem, x, used)
    add_team_symmetry_breaking(model, problem, used, worked)

    add_objective(model, problem, used, max_worked, min_worked)
    return model, x, start
```
````

<div v-click class="mt-4 text-sm">

Same variables, same objective. Only the constraint functions change.

</div>

---

## IP way vs. CP-SAT way

<div class="text-sm compact">

| | IP way | CP-SAT way |
|---|---|---|
| one team per job | `sum(...) == 1` | `add_exactly_one` |
| a team that works is used | `x <= used` | `add_implication` |
| one job at a time | $y_{a,b}$ + 2 Big-M per pair and shared team | optional intervals + `add_no_overlap` per team |
| lunch breaks | $b_{j,u}$ + 2 Big-M per (job, team, break) | fixed intervals in the same `add_no_overlap` |
| maximum working time | $w^{max} \geq w_k$ | `add_max_equality` |
| minimum over used teams | Big-M with $T$ | `only_enforce_if(used[k])` |
| precedences, same team, symmetry breaking | linear | linear |

</div>

<style scoped>
.compact :deep(td), .compact :deep(th) { padding-top: 0.3rem; padding-bottom: 0.3rem; }
</style>

---

## [Live: solve the CP-SAT way](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb)

<!--
Single run, no symmetry breaking yet: that comes next and brings instance_71 down to about a second.
-->

<style scoped>
.compact :deep(td), .compact :deep(th) { padding-top: 0.3rem; padding-bottom: 0.3rem; }
</style>



---
layout: image-right
image: https://images.unsplash.com/photo-1787072966814-49a626076def?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D

#https://images.unsplash.com/photo-1701448150058-43d6d199b103?q=80&w=1287&auto=format&fit=crop
---

# A Peek: What is inside CP&#8209;SAT?
Chapter 3


---
layout: image-right
image: https://images.unsplash.com/photo-1676653323490-6bf1dcd695f4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D
---


## CP = Constraint Programming


<br>

<v-clicks>

- Every variable has a **domain**: the values it can still take
- **Propagate**: constraints remove impossible values
- **Search**: stuck? Guess, e.g. $x_{3,1} = 1$
- **Backtrack**: a domain is empty? Undo the guess, try the next branch
- Like a sudoku: fill in what follows, guess when stuck, erase on a contradiction

</v-clicks>


---

## Propagation in our model

<img src="/assets/propagator_diagram2.png" class="h-80 mx-auto" />

<v-clicks>

- Every arrow is a **propagator**: when a domain shrinks, the propagators connected to it wake up
- They run until nothing changes anymore, then search makes the next guess

</v-clicks>

---

## The missing link

<img src="/assets/propagator_diagram1.png" class="h-80 mx-auto" />

<v-clicks>

- $s$ and $used$ only talk through $x$: as long as no $x$ is fixed, nothing reaches $used$
- Four jobs that must run at the same time? No single propagator can conclude "at least four teams"
- A **direct link** from $s$ to $used$ can

</v-clicks>

<!--
The existing propagators each see one team (no_overlap) or one job (exactly one). "k overlapping jobs need k teams" is a pigeonhole argument across all of them: propagation alone can't derive it, and clause learning finds it only with a lot of search.
The new edge is not about a denser network per se: every extra propagator costs time. It pays off because it makes an inference no existing propagator can.
-->

---

## Let's use this theory!

<div class="text-lg mb-4">

*At any time: number of running jobs* $\leq$ *number of used teams*

</div>

<v-clicks>

- One interval per job, no matter which team does it, each needs capacity $1$:
    - $\text{Cumulative}(\{[s_j,\ s_j + d_j) : j \in J\},\ \text{capacity } \textstyle\sum_k used_k)$
- **Implied** by the model: it removes no solution, unlike symmetry breaking

</v-clicks>

<v-click>

```python
def add_redundant_cumulative(
    model: cp_model.CpModel, problem: WorkforceProblem, used, start
):
    """At any time: number of running jobs <= number of used teams."""
    num_used = model.new_int_var(0, len(problem.teams), "num_used")
    model.add(num_used == sum(used.values()))
    all_jobs = [
        model.new_fixed_size_interval_var(start[job.id], job.duration, "")
        for job in problem.jobs
    ]
    model.add_cumulative(all_jobs, [1] * len(problem.jobs), num_used)
```

</v-click>

<!--
Bleukx et al. use the same idea in their original model: they solve this cumulative relaxation (all teams identical) separately and add sum(used) >= lb.
The cumulative capacity must be a single (affine) variable, hence num_used: passing sum(used) directly gives MODEL_INVALID.
Valid only without team unavailabilities: with calendars the capacity would have to drop during off-times. The challenge instances have none.
-->

---

## SAT = Boolean Satisfiability

<br>

<div class="grid grid-cols-2 gap-10 mt-4">
<div>

<v-clicks>

- Only **Boolean** variables, constraints are **clauses**: "at least one literal is true"
- Same idea as CP: guess, propagate, backtrack
- But on a conflict: find out **why**, and **learn** a new clause
- The solver never makes the same mistake twice

</v-clicks>

</div>
<div v-click>

$$(\neg a \lor b) \land (\neg b \lor c) \land (\neg a \lor \neg c)$$

1. **Guess** $a = 1$
2. **Propagate** $b = 1$, then $c = 1$
3. **Conflict:** $(\neg a \lor \neg c)$ is violated
4. **Learn** $(\neg a)$ and jump back

</div>
</div>

---

## CP + SAT: Lazy Clause Generation

<br>

<v-clicks>

- Integer variables get Boolean twins like $[x \geq 7]$, created **lazily**, only when needed
- Every propagator **explains** what it deduces as a clause, e.g. from $x + y \leq 12$:
    - $[x \geq 7] \Rightarrow [y \leq 5]$
- So the SAT engine **learns from conflicts across all constraints**, including global ones like `no_overlap`

</v-clicks>


---

## But there is more... Simplex + Portfolio

<br>

<v-clicks>

- CP-SAT runs a dual-simplex to create cuts and bounds also used in the search loop.
- CP-SAT runs different **workers in parallel**: with and without LP, core-based, large neighborhood search, feasibility jump, ...
- They **share** solutions and bounds: one finds good solutions, another proves the bound
- `solver.parameters.num_workers` (default: all cores), `log_search_progress = True`

</v-clicks>

<v-click>

```text
Starting search at 0.05s with 8 workers.
6 full problem subsolvers: [core, default_lp, fixed, max_lp, no_lp, quick_restart]
2 first solution subsolvers: [fj, fs_random_no_lp]
#1       0.06s best:34590 next:[120,34589] fj_restart
#2       0.07s best:20640 next:[2025,20639] no_lp
```

</v-click>

<v-click>


- Cool tool to analyse logs: [cpsat-loganalyzer.krupke-algorithms.de](https://cpsat-loganalyzer.krupke-algorithms.de)

</v-click>

<!--
Log taken from our workforce model (instance_71, 8 workers), shortened.
With 2 workers (Colab), the same model runs only 1 full problem subsolver (default_lp) and 1 first solution subsolver (fj); the 13 LNS subsolvers are interleaved.
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
image: https://images.unsplash.com/photo-1658947969660-49437d905a75?q=80&w=2709&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D
# https://images.unsplash.com/photo-1466094899371-97b327dff551?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
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

- Head-to-head points per problem (open category, parallel search, 5 instances each)
- CP-SAT wins **15 of 20** problems, one tie
- Gurobi wins 4: **warehouse**, **gbac**, **surface-based TSP** and **rect-euler**, e.g. facility location and TSP: problems with strong LP relaxations
- Our workforce problem: **3.5 : 1.5** for CP-SAT

</v-clicks>

</div>
</div>

---
 
## When to use CP-SAT, when to use MIP?

<br>

| CP-SAT shines | MIP shines |
|---|---|
| Scheduling with disjunctions: intervals, no-overlap, calendars | Strong LP relaxations: flows, network design |
| Logical and combinatorial constraints, pure feasibility | Continuous variables, huge linear models |
| Routing with side constraints (`add_circuit`) | Facility location, classic TSP formulations |
| integer domains | fractional data |

<v-click>

**Know both tools.** And remember: CP-SAT has an LP relaxation inside, so it brings a bit of both worlds.

</v-click>

---

## Best practices for scalable CP-SAT models

<br>

<v-clicks>

1. **Tight domains** for every integer variable
2. **Enforcement literals** (`only_enforce_if`) instead of Big-M
3. **Global constraints** instead of hand-made decompositions
4. **Break symmetries** and add **redundancies** when useful
5. **Use all cores** and **read the log**
6. Integers only: **scale** fractional data

</v-clicks>

---

## Further Topics

<v-clicks depth="2">

More constraints for your toolbox:
- `add_no_overlap_2d` (packing), 
- `add_reservoir_constraint`,
- `add_multiple_circuit` (vehicle routing), 
- ...

More solver features:
- Solution hints (`add_hint`) and warm starts
- Assumptions for explaining infeasibility
- Callbacks for intermediate solutions

</v-clicks>

---
layout: cover
background: https://images.unsplash.com/photo-1606567595334-d39972c85dbe?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D
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
