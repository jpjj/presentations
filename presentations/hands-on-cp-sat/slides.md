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

- Given $n$ workers, $n$ jobs, a cost per (worker, job) pair.
- Every worker does exactly one job, every job is done by exactly one worker.
- Minimze the total cost.



</div>
<div>

<v-click>

Model it like an IP:

```python {all|1|3|5-8|10|12-13}
J, W = range(n), range(n)
# given cost as a matrix
model = cp_model.CpModel()

x = {(w, j): model.new_bool_var("") for w in W for j in J}

for w in W:  # every worker does exactly one job
    model.add(sum(x[w, j] for j in J) == 1)
for j in J:  # every job is done by exactly one worker
    model.add(sum(x[w, j] for w in W) == 1)

model.minimize(sum(cost[w,j] * x[w, j] for w in W for j in J))

solver = cp_model.CpSolver()
status = solver.solve(model)
```

</v-click>

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
<div class="text-sm">

<v-clicks>

- Instead of `sum(...) == 1`: the global constraint `add_exactly_one`
- **Descriptive**: you say exactly *what* should be enforced
- Global constraints capture a whole **substructure** of the problem, and the solver has specialized algorithms for each of them

</v-clicks>

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

- $N$ **teams**, $K$ **tasks**
- Every task has a duration and a **time window**: we decide *when* it starts
- Teams and tasks must be **compatible**


</v-clicks>

</div>
<v-clicks>

- A team does one task at a time and has **unavailabilities**
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
- Tasks
- Time Intervals
- A Problem Class

```python
TeamId = NewType("TeamId", int)
TaskId = NewType("TaskId", int)


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


class Task(BaseModel, frozen=True):
    id: TaskId
    release: int = Field(ge=0)
    due: int = Field(gt=0)
    duration: int = Field(gt=0)
    compatible_teams: list[TeamId]


class WorkforceProblem(BaseModel):
    """Represents the problem instance."""
    name: str = ""
    teams: list[Team]
    tasks: list[Task]
    precedence: list[tuple[TaskId, TaskId]] = []  
    same_team: list[list[TaskId]] = []  
```


</v-click>
---

## What do we need?

<v-clicks>

Like in MIP modeling:
- Variables
- Constraints
- Objective Function

</v-clicks>


---

## Lets define functions to create the different variables.

```python
def add_assignment_variables(model: cp_model.CpModel, problem: WorkforceProblem):
    """x[j, k] = 1: team k does task j."""
    return {(t.id, k): model.new_bool_var(f"x_{t.id}_{k}") for t in problem.tasks for k in t.compatible_teams}

def add_used_team_variables(model: cp_model.CpModel, problem: WorkforceProblem):
    """used[k] = 1: team k does at least one task."""
    return {team.id: model.new_bool_var(f"used_{team.id}") for team in problem.teams}

def add_start_times_variables(model: cp_model.CpModel, problem: WorkforceProblem):
    """start[j] = z: task j starts at time z"""
    return {t.id: model.new_int_var(t.release, t.due - t.duration, f"start_{t.id}") for t in problem.tasks}
```


---

## The Integer Programming (IP) way: assignment

```python {all|3-4|5-6}
def add_assignment_constraints_ip(model: cp_model.CpModel, problem: WorkforceProblem, x, used):
    """Every task is done by exactly one compatible team, a team that does a task is used."""
    for t in problem.tasks:
        model.add(sum(x[t.id, k] for k in t.compatible_teams) == 1)
    for (j, k) in x:
        model.add(x[j, k] <= used[k])
```

<div class="grid grid-cols-2 gap-8 mt-6 text-sm">
<div>

<v-clicks>

- $\sum_{k \in K_j} x_{j,k} = 1 \quad \forall j$
- $x_{j,k} \leq used_k \quad \forall j,\ k \in K_j$

</v-clicks>

</div>
<div>

<v-clicks>

- $K_j$: the teams compatible with task $j$. Only compatible pairs get a variable.
- Time windows need no constraint at all: they are the **domain** of the start variable, $s_j \in [r_j,\ D_j - d_j]$

</v-clicks>

</div>
</div>

<!--
Notation for the whole chapter: s_j start, d_j duration, [r_j, D_j] time window (release, due).
-->

---

## The IP way: one task at a time

<v-click>

If two tasks share a team, **one of them comes first**: a new Boolean $y_{a,b}$ per pair of overlapping time windows.

</v-click>

```python {all|3-5|6|7-10}
def add_no_overlap_constraints_ip(model: cp_model.CpModel, problem: WorkforceProblem, x, start):
    """Two tasks on the same team must not overlap: one of them comes first."""
    for a, b in combinations(problem.tasks, 2):
        if a.release < b.due and b.release < a.due:  # windows overlap
            a_first = model.new_bool_var(f"first_{a.id}_{b.id}")
            M_ab, M_ba = a.due - b.release, b.due - a.release
            for k in set(a.compatible_teams) & set(b.compatible_teams):
                xa, xb = x[a.id, k], x[b.id, k]
                model.add(start[a.id] + a.duration <= start[b.id] + M_ab * (3 - xa - xb - a_first))
                model.add(start[b.id] + b.duration <= start[a.id] + M_ba * (2 - xa - xb + a_first))
```

<div v-click class="mt-4">

$$
\begin{aligned}
s_a + d_a &\leq s_b + M_{ab}\,(3 - x_{a,k} - x_{b,k} - y_{a,b}) \\
s_b + d_b &\leq s_a + M_{ba}\,(2 - x_{a,k} - x_{b,k} + y_{a,b})
\end{aligned}
\qquad \forall\, a, b \text{ overlapping},\ k \in K_a \cap K_b
$$

</div>

---

## How big is $M$?

<div class="grid grid-cols-2 gap-10 mt-4">
<div>

$$
s_a + d_a \leq s_b + M_{ab}\,\underbrace{(3 - x_{a,k} - x_{b,k} - y_{a,b})}_{=:\ \beta}
$$

<v-clicks>

- $\beta = 0$: both tasks on team $k$ **and** $a$ first. Then $s_a + d_a \leq s_b$ is enforced.
- $\beta \geq 1$: the constraint must be **switched off**, i.e. it may never cut anything:

</v-clicks>

<div v-click>

$$
M_{ab} \geq \max\,(s_a + d_a - s_b) = (D_a - d_a) + d_a - r_b = D_a - r_b
$$

</div>

</div>
<div>

<v-clicks>

- $M$ too **small**: cuts off feasible solutions, the "optimum" is wrong
- $M$ too **large**: weak LP relaxation, numerical trouble
- So we take the smallest valid $M$, per pair: `M_ab = a.due - b.release`
- Model size: one Boolean per pair, two constraints per pair **and** per shared team

</v-clicks>

</div>
</div>

<!--
Ask the audience first: what happens if M is too small? Too large?
-->

---

## The IP way: lunch breaks

<v-click>

Same pattern: a task on team $k$ is either **before** or **after** the break $u$, a new Boolean $b_{j,u}$.

</v-click>

```python {all|3-7|8-11}
def add_unavailability_constraints_ip(model: cp_model.CpModel, problem: WorkforceProblem, x, start):
    """A task on a team is either before or after each of the team's breaks."""
    for team in problem.teams:
        k = team.id
        for u in team.unavailabilities:
            for t in problem.tasks:
                if k in t.compatible_teams and t.release < u.end and u.start < t.due:
                    before = model.new_bool_var(f"before_{t.id}_{k}_{u.start}")
                    M1, M2 = t.due - u.start, u.end - t.release
                    model.add(start[t.id] + t.duration <= u.start + M1 * (2 - x[t.id, k] - before))
                    model.add(u.end <= start[t.id] + M2 * (1 - x[t.id, k] + before))
```

<div v-click class="mt-4">

$$
\begin{aligned}
s_j + d_j &\leq u^{start} + (D_j - u^{start})\,(2 - x_{j,k} - b_{j,u}) \\
u^{end} &\leq s_j + (u^{end} - r_j)\,(1 - x_{j,k} + b_{j,u})
\end{aligned}
$$

</div>

<div v-click class="text-sm opacity-70 mt-2">

Again two Big-M constraints, now per (task, team, break). The $M$s follow the same reasoning as before.

</div>

---

## The IP way: precedences and same-team groups

```python {all|1-5|8-15}
def add_precedence_constraints(model: cp_model.CpModel, problem: WorkforceProblem, start):
    """Task a ends before task b starts."""
    duration = {t.id: t.duration for t in problem.tasks}
    for a, b in problem.precedence:
        model.add(start[a] + duration[a] <= start[b])


def add_same_team_constraints(model: cp_model.CpModel, problem: WorkforceProblem, x):
    """All tasks of a group are done by the same team."""
    for first, *others in problem.same_team:
        for other in others:
            for team in problem.teams:
                k = team.id
                if (first, k) in x or (other, k) in x:
                    model.add(x.get((first, k), 0) == x.get((other, k), 0))
```

<div class="grid grid-cols-2 gap-8 mt-4 text-sm">
<div>

<v-clicks>

- $s_a + d_a \leq s_b \quad \forall (a, b) \in P$
- $x_{a,k} = x_{b,k} \quad \forall$ groups, $\forall k \in K_a \cup K_b$

</v-clicks>

</div>
<div v-click>

If only one of the two tasks is compatible with team $k$, the missing variable is $0$: the other task can't be done by $k$ either.

</div>
</div>

---

## The IP way: fair is fair

```python {all|3-4|5-6|7-9}
def add_fairness_constraints_ip(model: cp_model.CpModel, problem: WorkforceProblem, x, used):
    """Working time per team, and its max and min over the used teams."""
    total = sum(t.duration for t in problem.tasks)
    worked = {k: sum(t.duration * x[t.id, k] for t in problem.tasks if (t.id, k) in x) for k in used}
    max_worked = model.new_int_var(0, total, "max_worked")
    min_worked = model.new_int_var(0, total, "min_worked")
    for k in used:
        model.add(max_worked >= worked[k])
        model.add(min_worked <= worked[k] + total * (1 - used[k]))
    return worked, max_worked, min_worked
```

<div class="grid grid-cols-2 gap-8 mt-6 text-sm">
<div>

<v-clicks>

- $w_k = \sum_{j} d_j\, x_{j,k}$, $\quad w^{max} \geq w_k$
- $w^{min} \leq w_k + T\,(1 - used_k)$ with $T = \sum_j d_j$

</v-clicks>

</div>
<div v-click>

Unused teams work $0$: without the Big-M, they pull the minimum down to $0$.

</div>
</div>

---

## The objective

```python {all|3|4}
def add_objective(model: cp_model.CpModel, problem: WorkforceProblem, used, max_worked, min_worked):
    """Lexicographic: first the number of teams, then the unfairness."""
    total = sum(t.duration for t in problem.tasks)
    model.minimize(total * sum(used.values()) + max_worked - min_worked)
```

<v-clicks>

- $\min\ T \sum_k used_k + (w^{max} - w^{min})$
- The unfairness is always smaller than $T$, so **saving a team always wins**

</v-clicks>

---

## The complete IP

<div class="text-sm">

$$
\begin{aligned}
\min \quad & T \textstyle\sum_k used_k + w^{max} - w^{min} \\
\text{s.t.} \quad & \textstyle\sum_{k \in K_j} x_{j,k} = 1, \quad x_{j,k} \leq used_k && \text{assignment} \\
& s_a + d_a \leq s_b + M_{ab}\,(3 - x_{a,k} - x_{b,k} - y_{a,b}) && \text{one task at a time} \\
& s_b + d_b \leq s_a + M_{ba}\,(2 - x_{a,k} - x_{b,k} + y_{a,b}) \\
& s_j + d_j \leq u^{start} + M\,(2 - x_{j,k} - b_{j,u}), \quad u^{end} \leq s_j + M'\,(1 - x_{j,k} + b_{j,u}) && \text{lunch breaks} \\
& s_a + d_a \leq s_b, \quad x_{a,k} = x_{b,k} && \text{precedence, same team} \\
& w^{max} \geq w_k, \quad w^{min} \leq w_k + T\,(1 - used_k) && \text{fairness} \\
& s_j \in [r_j,\ D_j - d_j], \quad x, y, b, used \in \{0, 1\}
\end{aligned}
$$

</div>

<div v-click class="mt-4">

Only `model.add(...)`: every line is a linear constraint. Any MIP solver could take this model as it is.

</div>

---

## The complete IP in code

```python {all|2-5|7-12|14}
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

    add_objective(model, problem, used, max_worked, min_worked)
    return model, x, start
```

---

## [Live: solve the IP](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb)

<div class="grid grid-cols-[3fr_2fr] gap-8 mt-2">
<div>

<img src="/assets/workforce_baby_step4.png" class="w-full" />

<div class="text-sm opacity-70 mt-1 text-center">

Baby example: optimal with 2 teams, unfairness 2, cost $12 \cdot 2 + 2 = 26$. Why is 6/6 impossible? (Hint: tasks 3 and 5.)

</div>

</div>
<div class="text-sm" v-click>

On the challenge instances (30 s each):

| Instance | Tasks | constraints | result |
|---|---|---|---|
| instance_202 | 26 | 5,209 | optimal, 12.9 s |
| instance_24_56 | 25 | 4,379 | 1425, bound 1420 |
| instance_71 | 58 | 22,963 | 10125, bound 8912 |
| instance_19 | 62 | 33,445 | 9000, bound 5605 |

<div class="text-xs opacity-60">Measured locally (16 cores) with the complete notebook.</div>

<div v-click class="mt-4">

Correct, but the model grows with *pairs of tasks × teams*, and optimality is proven only once. Can we tell the solver more about the structure?

</div>

</div>
</div>

---

## The CP-SAT way

<v-clicks>

- Same variables, same problem, same optimal solutions
- But we describe the **structure** with global constraints, instead of encoding it in linear inequalities
- And we use **enforcement literals** instead of Big-M: `model.add(...).only_enforce_if(b)` only holds if `b` is true. No $M$ to choose!

</v-clicks>

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

## The CP-SAT way: assignment

```python {all|3-4|5-6}
def add_assignment_constraints_cp(model: cp_model.CpModel, problem: WorkforceProblem, x, used):
    """Every task is done by exactly one compatible team, a team that does a task is used."""
    for t in problem.tasks:
        model.add_exactly_one(x[t.id, k] for k in t.compatible_teams)
    for (j, k) in x:
        model.add_implication(x[j, k], used[k])
```

<v-clicks>

- `add_exactly_one` instead of $\sum_k x_{j,k} = 1$
- `add_implication(a, b)` means $a \Rightarrow b$, i.e. $x_{j,k} \leq used_k$

</v-clicks>

---

## The CP-SAT way: one task at a time, lunch breaks included

```python {all|5-6|7-8|9}
def add_no_overlap_constraints_cp(model: cp_model.CpModel, problem: WorkforceProblem, x, start):
    """One optional interval per (task, team), plus the team's breaks. No overlap per team."""
    for team in problem.teams:
        k = team.id
        intervals = [model.new_optional_fixed_size_interval_var(start[t.id], t.duration, x[t.id, k], "")
                     for t in problem.tasks if k in t.compatible_teams]
        intervals += [model.new_fixed_size_interval_var(u.start, u.duration, "")
                      for u in team.unavailabilities]
        model.add_no_overlap(intervals)
```

<v-clicks>

- **One** `add_no_overlap` per team replaces all pairwise Big-M constraints and all $y_{a,b}$
- A lunch break is an interval that is **always present**: it replaces `add_unavailability_constraints_ip` and all $b_{j,u}$

</v-clicks>

---

## The CP-SAT way: fair is fair

```python {all|7|8-9}
def add_fairness_constraints_cp(model: cp_model.CpModel, problem: WorkforceProblem, x, used):
    """Working time per team, and its max and min over the used teams."""
    total = sum(t.duration for t in problem.tasks)
    worked = {k: sum(t.duration * x[t.id, k] for t in problem.tasks if (t.id, k) in x) for k in used}
    max_worked = model.new_int_var(0, total, "max_worked")
    min_worked = model.new_int_var(0, total, "min_worked")
    model.add_max_equality(max_worked, list(worked.values()))
    for k in used:
        model.add(min_worked <= worked[k]).only_enforce_if(used[k])
    return worked, max_worked, min_worked
```

<v-clicks>

- `add_max_equality`: $w^{max} = \max_k w_k$
- The minimum only counts **used** teams: an enforcement literal instead of $T\,(1 - used_k)$
- Precedences, same-team groups and the objective are linear already: we reuse them as they are

</v-clicks>

---

## The complete CP-SAT model in code

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
| one team per task | `sum(...) == 1` | `add_exactly_one` |
| a team that works is used | `x <= used` | `add_implication` |
| one task at a time | $y_{a,b}$ + 2 Big-M per pair and shared team | optional intervals + `add_no_overlap` per team |
| lunch breaks | $b_{j,u}$ + 2 Big-M per (task, team, break) | fixed intervals in the same `add_no_overlap` |
| maximum working time | $w^{max} \geq w_k$ | `add_max_equality` |
| minimum over used teams | Big-M with $T$ | `only_enforce_if(used[k])` |
| precedences, same team | linear | linear |

</div>

<style scoped>
.compact :deep(td), .compact :deep(th) { padding-top: 0.3rem; padding-bottom: 0.3rem; }
</style>

---

## [Live: solve the CP-SAT way](https://colab.research.google.com/github/jpjj/O4A-Hands-On-CP-SAT/blob/main/cp_sat_complete.ipynb)

Same solver, same problem, 30 s each. The only difference: how we model it.

<div class="text-sm compact">

| Instance | Tasks | constraints IP way | constraints CP-SAT way | IP way | CP-SAT way |
|---|---|---|---|---|---|
| instance_202 | 26 | 5,209 | 1,106 | optimal, 12.9 s | optimal, **2.2 s** |
| instance_24_56 | 25 | 4,379 | 1,014 | 1425, bound 1420 | optimal, **7.9 s** |
| instance_71 | 58 | 22,963 | 2,324 | 10125, bound 8912 | optimal, **10.2 s** |
| instance_19 | 62 | 33,445 | 2,856 | 9000, bound 5605 | optimal, **18.5 s** |

</div>

<div class="text-xs opacity-60">Measured locally (16 cores) with the complete notebook; your Colab numbers will differ.</div>

<v-click>

The **same** best solutions everywhere. But the CP-SAT way proves all four optimal, the IP way only one.

</v-click>

<v-click>

<div class="text-sm opacity-70 mt-2">

MiniZinc Challenge (1 core, 20 min): CP-SAT proved all 5 workforce instances optimal, Gurobi (non-eligible reference entry) 3. On two instances Gurobi's best solution was **20% and 40% worse**.

</div>

</v-click>

<!--
Single run, no symmetry breaking yet: that comes next and brings instance_71 down to about a second.
-->

<style scoped>
.compact :deep(td), .compact :deep(th) { padding-top: 0.3rem; padding-bottom: 0.3rem; }
</style>

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

## Best practice: redundant constraints

<div class="text-lg mb-4">

*At any time: number of running tasks* $\leq$ *number of used teams*

</div>

```python {all|3-4|5-6}
def add_redundant_cumulative(model: cp_model.CpModel, problem: WorkforceProblem, used, start):
    """At any time: number of running tasks <= number of used teams."""
    num_used = model.new_int_var(0, len(problem.teams), "num_used")
    model.add(num_used == sum(used.values()))
    all_tasks = [model.new_fixed_size_interval_var(start[t.id], t.duration, "") for t in problem.tasks]
    model.add_cumulative(all_tasks, [1] * len(problem.tasks), num_used)
```

<v-clicks>

- **Implied** by the model: it removes no solution, unlike symmetry breaking
- One `add_cumulative` over **all** tasks: a direct lower bound on the number of teams, instead of failing team by team

</v-clicks>

<!--
Bleukx et al. use the same idea in their original model: they solve this cumulative relaxation (all teams identical) separately and add sum(used) >= lb.
The cumulative capacity must be a single (affine) variable, hence num_used: passing sum(used) directly gives MODEL_INVALID.
Valid only without team unavailabilities: with calendars the capacity would have to drop during off-times. The challenge instances have none.
-->

---

## Best practices pay off

CP-SAT way, time to optimal:

<div class="compact mt-4">

| Instance | Tasks | CP-SAT way | + symmetry breaking | + redundant constraint | + both |
|---|---|---|---|---|---|
| instance_202 | 26 | 1.6 s | **0.06 s** | 2.3 s | 0.08 s |
| instance_24_56 | 25 | 7.2 s | **0.08 s** | 5.8 s | 0.09 s |
| instance_71 | 58 | 11.9 s | 0.69 s | 0.65 s | **0.47 s** |
| instance_19 | 62 | 25.6 s | 1.41 s | 1.00 s | **0.63 s** |

</div>

<div class="text-xs opacity-60">Median of 3 seeds, 16 cores, 30 s limit. All runs optimal.</div>

<v-clicks>

- Symmetry breaking: **10 to 100 times** faster on every instance
- The redundant constraint alone only pays off on the **large** instances: there, it is as good as symmetry breaking
- Both together: fastest on the large instances, a bit slower on the small ones. Redundant constraints cost propagation time. **Measure!**

</v-clicks>

<!--
Measured with the functions of the complete notebook (create_cp_model, create_cp_model_tuned).
Per-seed times: instance_19 plain 27.4/18.8/25.6 s, + symmetry 1.73/0.90/1.41 s, + redundant 1.00/1.59/0.88 s, + both 0.63/0.47/1.91 s. instance_71 plain 9.7/12.8/11.9 s, + symmetry 0.89/0.34/0.69 s, + redundant 0.57/0.65/0.74 s, + both 0.52/0.38/0.47 s.
The "CP-SAT way" column differs slightly from the live slide: that one is a single run.
-->

<style scoped>
.compact :deep(td), .compact :deep(th) { padding-top: 0.3rem; padding-bottom: 0.3rem; }
</style>

---
layout: image-right
image: https://images.unsplash.com/photo-1787072966814-49a626076def?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D

#https://images.unsplash.com/photo-1701448150058-43d6d199b103?q=80&w=1287&auto=format&fit=crop
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
