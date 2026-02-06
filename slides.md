---
# try also 'default' to start simple
theme: default
# aspectRatio: 2/1
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://images.unsplash.com/photo-1520022911530-fea50671df2e?q=80&w=2499&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
# https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Hands-On Modeling
info: |
  ## Peter Pan
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
# duration of the presentation
duration: 35min

hide: false


---

## Mathematical Modeling Tips & Tricks
O4A Hands-On Session

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/jpjj/O4A-Hands-On-Modeling" target="_blank" alt="GitHub"
    class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>


---
layout: image-right

# the image source
image: /assets/peter.png
---
# Hello there!

My Name is Peter!

<v-click>
I like: 
</v-click>

<v-clicks>

- Math
- ...

</v-clicks>

---
zoom: 1.0
---
# Agenda

<v-clicks>

1. Introduction to a simple assignment/scheduling problem.
2. Creating first formulation.
3. Improving formulation with established modeling best-practices.
4. New reformulation, overcoming last bottlenecks and creating a far superior model.

</v-clicks>


---

## Tech Stack:

<div class="grid grid-cols-3 gap-8 mt-8">
  <div class="flex flex-col items-center">
    <img src="/assets/pyomo.png" class="h-20 mb-4" alt="Pyomo" />
    <code>pyomo</code>
    <span class="text-sm opacity-70">for modeling</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/assets/highs.png" class="h-20 mb-4" alt="HiGHS" />
    <code>highs</code>
    <span class="text-sm opacity-70">for solving</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="https://docs.pydantic.dev/latest/logo-white.svg" class="h-20 mb-4" alt="Pydantic" />
    <code>pydantic</code>
    <span class="text-sm opacity-70">for data validation</span>
  </div>
</div>


---

# The Problem
There are $N$ **workers** and $K$ **tasks**.

- Every task $j$ has a fixed start time $\alpha_j$ and end time $\omega_{j}$.
- Tasks are assigned to workers.
- Any worker $i$ could do any task $j$.
- Multiple tasks can be assigned to a single worker. But:
- If a worker has at least one task assigned to them, they start a shift:
- Workers have a minimum and a maximum shift length $D_{min}$ and $D_{max}$.
- All tasks assigned to a worker must be within this shift and they may not overlap.

**Objective:**
Minimize the sum of all shift lengths while fulfilling all tasks!

---
layout: two-cols
layoutClass: gap-16
---

## Show some small example

Let us say we have 3 **workers** and 3 **tasks**.
```python
N = 3 # number of workers
tasks = [
	(10, 12), # Task 0: 10:00 - 12:00 
	(11, 13), # Task 1: 11:00 - 13:00
	(20, 21), # Task 2: 20:00 - 21:00
]
D_min = 7
D_max = 10
```

::right::

<v-click>

## Observations
</v-click>


<v-clicks>

- Task 0 and 1 cannot be assigned to the same worker. They overlap.
- Task 0 and 2 cannot be assigned to the same worker because of $D_{max}$.
- Possible Schedule:

</v-clicks>

<v-click>

| Worker | Tasks | Shift |
| ----   |  ---- | ----  |
|   0    |  \[ 0 \]    | 10 - 17 |
|   1    |  \[ 1, 2 \]    | 11 - 21 |
|   2    |  \[ \]    | - |

</v-click>

<v-click>

Total cost: 7 + 10 + 0 = 17

</v-click>



---

## Let us visualize the solution

![Visualization](/assets/baby_example_solution.png)


---

# Breakout Session #1
Your turn!

Formulate a model to the problem introduced. How to model:

- Assignment of tasks to workers?
- Overlap of tasks not allowed?
- shift length of a worker:
	- No task: 0
	- At least one task:
		- Your shift will be at least at least $D_{min}$.
		- Your shift cannot be more than $D_{max}$.
- Your tools: **Define variables, constraints, objective function**!

---

# Assignment Problem Formulation
Remember: We have our input:
- number of workers $N$, 
- $K$ tasks with start and end time each, 
- $D_{min}$, 
- $D_{max}$

We need:
- Variables
- Constraints
- Objective Function

---

# Define Sets
Pyomo:

```python

def create_model_instance(problem: Problem) -> pyo.ConcreteModel
    # Create Model
    m = pyo.ConcreteModel("Worker Task Assignment")
    
    # Define Sets
    m.workers = pyo.RangeSet(problem.N)
    m.tasks = pyo.Set(initialize=problem.tasks)

```


---

## Define Variables

| Variable | Domain | Description |
|----------|--------|-------------|
| $y_i$ | $\mathbb{B}$ | $y_i = 1$ $\iff$ worker $i$ will have a shift |
| $x_{i,j}$ | $\mathbb{B}$ | $x_{i,j} = 1$ $\iff$ worker $i$ will do task $j$ |
| $s_i$ | $\mathbb{N}$ | shift start time of worker $i$ |
| $t_i$ | $\mathbb{N}$ | shift end time of worker $i$ |

---

## Going back to the example
![Visualization](/assets/baby_example_solution.png)

- $x_{1,1} = 1$ because worker 1 does task 1.
- $y_2 = 0$ because worker 2 does not work.
- $s_0 = 10$, $t_0 = 17$. Worker 0 starts at 10:00 and ends their shift at 17:00.


---

# Define Variables
Pyomo:
```python {10-15}

def create_model_instance(problem: Problem) -> pyo.ConcreteModel
    # Create Model
    m = pyo.ConcreteModel("Worker Task Assignment")
    
    # Define Sets
    m.workers = pyo.RangeSet(problem.N)
    m.tasks = pyo.Set(initialize=problem.tasks)

    # Define Variables
    m.y = pyo.Var(m.workers, domain=pyo.Binary)  # Worker has shift?
    m.x = pyo.Var(m.workers * m.tasks, domain=pyo.Binary)  # Worker i does task j?
    m.s = pyo.Var(m.workers, domain=pyo.NonNegativeIntegers)  # Shift start
    m.t = pyo.Var(m.workers, domain=pyo.NonNegativeIntegers)  # Shift end

```

--- 

# Define Parameters
Pyomo:
```python {10-}

def create_model_instance(problem: Problem) -> pyo.ConcreteModel
    
	  ...

    m.s = pyo.Var(m.workers, domain=pyo.NonNegativeIntegers)  # Shift start
    m.t = pyo.Var(m.workers, domain=pyo.NonNegativeIntegers)  # Shift end
		

    @m.Param()
    def DMIN(m):
        return problem.D_min

    @m.Param()
    def DMAX(m):
        return problem.D_max
```


---

# Constraints
Buckle up!


---
layout: center
---
### Every task needs to be served
$$\sum_{i=0}^{N-1} x_{i,j} = 1 \quad \forall \text{ tasks } j$$


<v-click>
```python
    @m.Constraint(m.tasks)
    def fulfill_all_tasks(m, j):
        return pyo.quicksum(m.x[i, j] for i in m.workers) == 1
```
</v-click>
---
layout: center
---

### No overlapping tasks for same worker
$$x_{i,j_1} + x_{i,j_2} \leq 1 \quad \forall \text{ workers } i, \forall \text{ overlapping task pairs } (j_1, j_2)$$

<v-click>
```python
		def get_overlapping_tasks(tasks: list[Task]) -> list[tuple(Task, Task)]:
			...

		m.overlapping_tasks = pyo.Set(initialize=get_overlapping_tasks(problem.tasks))

    @m.Constraint(m.workers, m.overlapping_tasks)
    def no_overlapping_tasks(m, i, j1, j2):
        return m.x[i, j1] + m.x[i, j2] <= 1
```
</v-click>
---
layout: center
---

### Minimum shift length
$$s_i + y_i \cdot D_{min} \leq t_i \quad \forall \text{ workers } i$$

<v-click>
```python
    @m.Constraint(m.workers)
    def minimum_shift_length(m, i):
        return m.s[i] + m.y[i] * m.DMIN <= m.t[i]
```
</v-click>
---
layout: center
---

### Maximum shift length
$$t_i \leq s_i + y_i \cdot D_{max} \quad \forall \text{ workers } i$$

<v-click>
```python
    @m.Constraint(m.workers)
    def maximum_shift_length(m, i):
        return m.t[i] <= m.s[i] + m.y[i] * m.DMAX
```
</v-click>
---
layout: center
---

## Rewind:
$$s_i + y_i \cdot D_{min} \leq t_i \quad \forall \text{ workers } i$$
$$t_i \leq s_i + y_i \cdot D_{max} \quad \forall \text{ workers } i$$

<v-clicks>

- If $y_i = 0$, we get:
	- $s_i \leq t_i$ and $t_i \leq s_i$, so: 
	- $s_i = t_i$. 
- If $y_i = 1$, we get:
	- $s_i + D_{min} \leq t_i \leq s_i + D_{max}$, so:
	-  $D_{min} \leq t_i - s_i \leq D_{max}$.

</v-clicks>

---
layout: center
---

### Task end before shift end
$$x_{i,j} \cdot \omega_j \leq t_i \quad \forall \text{ workers } i, \forall \text{ tasks } j$$

<v-click>
```python
    @m.Constraint(m.workers, m.tasks)
    def task_end_before_shift_end(m, i, j):
        return m.x[i, j] * j.end <= m.t[i]
```
</v-click>
---
layout: center
---

### Task start after shift start (using Big-M)
$$s_i \leq x_{i,j} \cdot \alpha_j + (1 - x_{i,j}) \cdot M \quad \forall \text{ workers } i, \forall \text{ tasks } j$$


<v-click>
```python

    @m.Constraint(m.workers, m.tasks)
    def task_start_after_shift_start(m, i, j):
        return m.s[i] <= m.x[i, j] * j.start + (1 - m.x[i, j]) * M
```
</v-click>

---
layout: center
---

## Wait, why?
$$s_i \leq x_{i,j} \cdot \alpha_j + (1 - x_{i,j}) \cdot M \quad \forall \text{ workers } i, \forall \text{ tasks } j$$

<v-click>

- This constraint should have no effect if $x_{i,j} = 0$. This is why we use **big-M** here.
- Without the term $(1 - x_{i,j}) \cdot M$ , $s_i$ would be forced to be $0$ if $x_{i,j}=0$ for some $j$.

</v-click>

---
layout: center
---

## Objective Function
Minimize all shift lengths:
$$\min \sum_{i=0}^{N-1} (t_i - s_i)$$

<v-click>
```python
    @m.Objective(sense=pyo.minimize)
    def total_costs(m):
        return pyo.quicksum(m.t[i] - m.s[i] for i in m.workers)

```
</v-click>


---

# And that's it!

```python

def create_model_instance(problem: Problem) -> pyo.ConcreteModel:
    # Create Model
    m = pyo.ConcreteModel("Worker Task Assignment")
    
    # Define Sets
    ...
    # Define Parameters
    ...
    # Define Variables
    ...
    # Define Constraints
    ...
    # Define Objective
		...

    return m

```

---
layout: image-right
zoom: 0.4
---

# And that's it!

```python

M = 1000  # Big-M constant


def create_model_instance(problem: Problem) -> pyo.ConcreteModel:
    """Create the basic assignment model."""
    overlapping_task_pairs = get_overlapping_tasks(problem.tasks)

    # Create Model
    m = pyo.ConcreteModel("Worker Task Assignment")
    
    # Define Sets
    m.workers = pyo.RangeSet(problem.N)
    m.tasks = pyo.Set(initialize=problem.tasks)
    m.overlapping_tasks = pyo.Set(initialize=overlapping_task_pairs)

    # Define Parameters
    @m.Param()
    def DMIN(m):
        return problem.D_min

    @m.Param()
    def DMAX(m):
        return problem.D_max

    # Define Variables
    m.y = pyo.Var(m.workers, domain=pyo.Binary)  # Worker has shift?
    m.x = pyo.Var(m.workers * m.tasks, domain=pyo.Binary)  # Worker i does task j?
    m.s = pyo.Var(m.workers, domain=pyo.NonNegativeIntegers)  # Shift start
    m.t = pyo.Var(m.workers, domain=pyo.NonNegativeIntegers)  # Shift end

    # Constraint 1: Every task needs to be served
    @m.Constraint(m.tasks)
    def fulfill_all_tasks(m, j):
        return pyo.quicksum(m.x[i, j] for i in m.workers) == 1

    # Constraint 2: No overlapping tasks for same worker
    @m.Constraint(m.workers, m.overlapping_tasks)
    def no_overlapping_tasks(m, i, j1, j2):
        return m.x[i, j1] + m.x[i, j2] <= 1

    # Constraint 3: Minimum shift length
    @m.Constraint(m.workers)
    def minimum_shift_length(m, i):
        return m.s[i] + m.y[i] * m.DMIN <= m.t[i]

    # Constraint 4: Maximum shift length
    @m.Constraint(m.workers)
    def maximum_shift_length(m, i):
        return m.t[i] <= m.s[i] + m.y[i] * m.DMAX

    # Constraint 5: Task start after shift start (Big-M)
    @m.Constraint(m.workers, m.tasks)
    def task_start_after_shift_start(m, i, j):
        return m.s[i] <= m.x[i, j] * j.start + (1 - m.x[i, j]) * M

    # Constraint 6: Task end before shift end
    @m.Constraint(m.workers, m.tasks)
    def task_end_before_shift_end(m, i, j):
        return m.x[i, j] * j.end <= m.t[i]

    # Objective: Minimize total shift time
    @m.Objective(sense=pyo.minimize)
    def total_costs(m):
        return pyo.quicksum(m.t[i] - m.s[i] for i in m.workers)

    return m

```


---

## Let's take this baby for a test drive


```python
m = create_model_instance(problem)
solver = Highs()
solver.solve(m)
```

---

## Well, this did not go as planned...

---

# Breakout Session #2
Your turn!

How can we improve the model formulation?

- Where are its weak points?
- Try to reduce number of variables & constraints while sticking to the problem logic.
- Which constraints might cause trouble regarding the integrality gap?

---
layout: two-cols-header
layoutClass: gap-16
---



## Let's analyze what makes this problem hard

::left::
### Run Analysis Script
```python
analyze_model(model_25, problem_25_10)
```
<v-click>
Output:
```
Model Analysis:
  Binary variables (y, x): 260
  Integer variables (s, t): 20
  Total constraints: 925
  Constraints by type:
    - fulfill_all_tasks: 25
    - no_overlapping_tasks: 380
    - minimum_shift_length: 10
    - maximum_shift_length: 10
    - task_start_after_shift_start: 250
    - task_end_before_shift_end: 250
```
</v-click>
::right::

<v-click>

### Observation:
</v-click>

<v-clicks>

1. **Many variables and constraints**
2. **Many overlap constraints** - Scales with $O(K^2)$
3. **Symmetry is a problem** - Permuting workers gives equivalent solutions
4. **Big-M is bad** - Creates weak LP relaxations

</v-clicks>

---
layout: section
---
# Part 3: Model Improvements

---
layout: image-right

image: /assets/loose_formulation.png
---
## Some theory

Weak/loose formulation: 
- The linear relaxation's feasible region is much larger than necessary
- Solving the relaxed LP gets us fractional solutions that are far from any integer solution. 
- Large integrality gap, 
- More branch-and-bound nodes & longer solve times.

---
layout: image-right

image: /assets/tight_formulation.png
---
## Some theory

Tight formulation: 
- The linear relaxation's feasible region closely approximates the convex hull of integer feasible solutions. 
- The LP relaxation bound is close to the optimal integer solution value!
- Branch & Bound finds integer solution much faster.

## Goal:
Revisit our constraints, make them tighter!
---
layout: center
---

## Improvement 1: Tighter Big-M

Problem constraint:
$$s_i \leq x_{i,j} \cdot \alpha_j + (1 - x_{i,j}) \cdot M$$

<v-click>

**Why is a large M bad?** 

- In the linear relaxation, the optimal solution can exploit slack.
- Example: for $M=1000$ and $x_{i,j}= 0.99$, we get: $s_i \leq 0.99 \cdot \alpha_j + 10$

</v-click>

<v-click>


**Solution:** Make M as tight as possible! The maximum value $s_i$ can take is $24 - D_{min}$ (latest possible shift start).
$$M = 24 - D_{min}$$

</v-click>


---
layout: image-right

image: /assets/meme_symmetry.png
---

## Improvement 2: Symmetry Breaking


**Problem:**

For instance (25,10), a single solution can have up to $10!$ duplicate solutions by permuting workers!

**One Solution:** 

Order workers by shift start time (or some other criterion).
New constraint:

$$s_{i-1}  \leq s_i \quad \forall i > 1$$

```python
    @m.Constraint(m.workers)
    def symmetry_breaker(m, i):
        if i == 1:
            return pyo.Constraint.Skip
        return m.s[i - 1] <= m.s[i]
```


---

## Improvement 3: Cutting Planes (Clique Constraints)

**Idea:** Reduce the solution space of the LP relaxation without reducing the MILP solution space.

**Original overlap constraint:** One constraint per overlapping task *pair*.

**Better:** For each hour, at most one task active at that hour can be assigned to a worker.

$$\sum_{j : \text{task } j \text{ active at hour } h} x_{i,j} \leq 1 \quad \forall i, \forall h \in [0, 23]$$

This gives us only 24 constraint groups instead of $O(K^2)$!

---

## Improvement 4: Variable Bounds

Add explicit bounds on shift start and end times. These bounds are outside of the constraints and help the solver in the presolve phase.
- $s_i \in [0, 24 - D_{min}]$
- $t_i \in [D_{min}, 24]$

---

21 small bonus: set bounds for variables

Here we need some more theoretical proof. Maybe in the books or googling again?

and run it.
As said before, construct (next to be baby set) 3 kinds of sets:
1. Can be solved by first model
2. Can be solver by improved model, but not by first model
3. Can be solved by flow model, but not by improved model.

---

22 Let us solve, again!

Dann lass den ganzen Bums nochmal laufen! Lass die Leute sehen, wie es auch einmal schneller geht (mit 25, 10). Dann mach (50, 20). Geht immer noch! Dann mach (100, 40).
Es läuft und läuft... Was tun wir jetzt? Wir haben schon so viel aus dem Model rausgeholt, es so tight gemacht. Aber es ist immer noch nicht gut...

---

23 What is the problem?

Das Problem: Immer noch recht großes Problem: 
Sehe hier: 4000 + 40 +40 + 40 Entscheidungsvariablen.
Constraints: Auch viele. Wie also kleiner?
D.h. Anzahl Constraints und Variablen skaliert mit $O(NM)$!

---

24  Breakout! Lass die Leute diskutieren, wie man das Ding vielleicht ganz anders formulieren kann.



# Ernsthafte Frage: Wie viel Zeit haben wir hier?
vielleicht sind wir hier nach 45 Minuten und können dann nochmal tief in den Flow gehen?

---

25 Have you ever heard about a flow?

Grant reveal! Flow.
Make the next things pop up one by one:
- What is a minimum cost flow?
- We have a directed graph with nodes and arcs.
- One node is a source with a certain supply.
- One node is a sink with a same amout of demand.
- We want to get all these units of demand via the graph network from sink to source. However:
	- Arcs can have capacities, meaning only a certain amount can pass them.
	- Arcs also have costs that are incurred for each unit of flow using that arc.
- The goal: Get demand to the sink while only using minimal costs.
This problem can be formulated as a LP.

---

26 Show LP formulation. 

- Flow conservation constraint.
- Capacity Constraint
- objective.

---

27 The cool thing about this flow:

The matrix is totally unimodular. This means it is very nice! The optimal solution to the LP found by the simplex method is an integer solution!
That means these problems are very easy to solve.

---

28 Why should I care?

You guessed it. We can formulate our problem as a flow model

---

29 Zeige Zeichnung von Excalidraw.


**Motivation**

Think about the flow being hour workers. We have as much flow units as we have workers.
Depending on how the flow travels the network shows us which worker should be assigned to which task.
Vielleicht hier schonmal ein Bild wo man sieht: Von links nach rechts durch den Flow heißt durch den Tag gehen.

---

30 First decision: When does a worker start its day?

<!-- 1. ![[Screenshot from 2026-01-27 17-51-59.png]] -->
2. It is like on a game board. And we see now how the workers go about their day. Every hour, they decide: Do I work on a task or do I wait?

---

31 Let us zoom in on the case a worker starts their day at 10:00

<!-- 1. ![[Pasted image 20260127175501.png]] -->
Every hour, they can decide: Do I wait or do I do a task? **Use updated pictuge above with task 1 also so people understand on the missing out cost**
If I do a task, I might be gone for some time.

---

32 Worker also have to end their day at some point. This where their costs are paid: 

<!-- ![[Pasted image 20260127180455.png]] -->

---

33 We have such a row path for any kind of start time

Maybe show a picture here, too.

---

34 We also have an extra task for workers not working. 

 <!-- ![[Pasted image 20260127180608.png]] -->

---

34 We need to put an incentive to do the tasks, though

Didn't we forgot something?
- Give them huge negative costs
- Add the constraints that these are linked together.

Nun wieder Pyomo Code und die Ideen (mit Flow State) Side by side.

- Variables:
	- Only f, for any arc we have, none-negative integer
- Constraints:
	- Flow Conservation constraint:
		- sum(f_a for a outgoing from v) - sum(f_a for a incoming to v) = supply(v)
	- Capa constraints: Gibt es keine!
	- Task constraint:
		- sum(f_a for a representing task i) <= 1
- Objective:
	- minimize sum(c_a * f_a for a arc in G)

---

Dann final die alte Instanz, die nicht lösbar war, nun mit Flow lösen. Boom Super schnell!



Man erkennt:
Man hat nicht so super viele Knoten und Kanten:
Man hat 24 - 7 possible paths. Eine Task kann höchstens 10 mal auftauchen, eher weniger wegen am Anfang,Ende sein oder Länge. Sagen wir also.

Hier sehen wir: 
Wenn wir drivers erhöhen, passiert gar nichts. Wenn wir tasks erhöhen, taucht eine Task höchstens bei 10 Neuen Dingen auf, eher weniger. Somit ist Scaling hier $O(M)$. Much better! Außerdem! Ein Flow ist totally unimodular, unser ist aber kein einfacher Min Cost Flow mehr. Warum?
Das gute: Spätestens nach M Branches (wahrscheinlich früher) sind wir schon am Ziel!

Darum besser!

---

Was könnte man noch zum Abschluss sagen:
Was ist wenn noch größer wird? Decomposition strategies, Metaheursitiscs, this is scheduling after all! In this case, it was important for the client to hae it optimal.

Other thoughts: This formulation allows us to have arbitrary costs!
What was not so nice: If not feasible, nothing is returned. For the client, bad! At least give us some solution! Idea: The solution with the maximum number of served tasks while still minimizing the total shift time.

The real problem had some extras we did not touch: 
1. It was not just hours, but more granular.
2. More complicated cost function (overtime charge)
3. Creating a schedule not for a day but for a total week. Additional objectives: Fairness Constraints.
