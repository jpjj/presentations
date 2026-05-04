---
# try also 'default' to start simple
theme: default
colorSchema: light
routerMode: hash
favicon: 'https://raw.githubusercontent.com/jpjj/jpjj.github.io/main/assets/favicon_jpjsolutions.png'
# aspectRatio: 2/1
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://images.unsplash.com/photo-1466094899371-97b327dff551?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
# https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Hands-On Modeling
info: |
  ## Jens-Peter Joost
  Presentation slides for Optimization for all Hands-On Session.
  Find notebook [here](https://github.com/jpjj/O4A-Hands-On-Modeling)
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

## Hands-On MIP Modeling
O4A Hands-On Session

<div class="abs-bl m-6 text-sm opacity-50">
  jpjsolutions.com/presentations/hands-on-modeling
</div>

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
# Chapters

<v-clicks>

1. Introduction to a simple assignment/scheduling problem.
2. Creating a simple formulation.
3. Creating an improved formulation with established modeling best-practices.
4. New reformulation, overcoming last bottlenecks.

</v-clicks>


---

## Tech Stack:
<br>
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
    <img src="https://docs.pydantic.dev/latest/logo-white.svg" class="h-20 mb-4" alt="Pydantic" style="filter: brightness(0) saturate(100%) invert(12%) sepia(95%) saturate(7471%) hue-rotate(304deg) brightness(101%) contrast(109%);" />
    <code>pydantic</code>
    <span class="text-sm opacity-70">for data validation</span>
  </div>
</div>

<!-- Fastapi, langchain, langraph -->

---
layout: image-right
image: https://images.unsplash.com/photo-1593967758432-181c2d9a6495?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

# The Problem
Chapter 1

---

There are $N$ **workers** and $K$ **tasks**.

<v-clicks>

- Tasks are assigned to workers.
- Any worker $i$ could do any task $j$.
- Multiple tasks can be assigned to a single worker. But:
- If a worker has at least one task assigned to them, they start a shift.
- Workers have a minimum and a maximum shift length $D_{min}$ and $D_{max}$.
- Every task $j$ has a fixed start time $\alpha_j$ and end time $\omega_{j}$.
- All tasks assigned to a worker must be within this shift and they may not overlap.


</v-clicks>

<v-click>

**Objective:**
Minimize the sum of all shift lengths while fulfilling all tasks!


</v-click>

---
layout: two-cols
layoutClass: gap-16
---

## Some small example

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

Formulate the problem as a MIP. How to model:

- Assignment of tasks to workers?
- Overlap of tasks not allowed?
- shift length of a worker:
	- No task: 0
	- At least one task:
		- Your shift will be at least $D_{min}$.
		- Your shift cannot be more than $D_{max}$.
- Your tools: **Define variables, constraints, objective function**!

---
layout: image-right
image: https://images.unsplash.com/photo-1499796683658-b659bc751db1?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

# The Simple Model
Chapter 2


---
layout: two-cols-header
---

# Assignment Problem Formulation
We have our input:
::left::

<v-click>

- number of workers $N$, 
- $K$ tasks with start and end time each, 
- $D_{min}$, 
- $D_{max}$

</v-click>

<v-click at="+2">

We need:
- Variables
- Constraints
- Objective Function

</v-click>

::right::


<v-click at="-1" >

```python
class Task(BaseModel, frozen=True):
    """Represents a task with an id, start time and end time."""
    id: int
    start: int
    end: int


class Problem(BaseModel):
    """Represents the problem instance."""
    tasks: list[Task] = Field(description="tasks to be assigned to workers")
    N: int = Field(description="Number of workers N", ge=1)
    D_min: int = Field(description="Minimum shift length", ge=0)
    D_max: int = Field(description="Maximum shift length", ge=0)
```


</v-click>


---

# Define Sets
Pyomo:

```python
def create_model_instance(problem: Problem) -> pyo.ConcreteModel
    # Create Model
    m = pyo.ConcreteModel("Worker Task Assignment")
    
    # Define Sets
    m.workers = pyo.RangeSet(0, problem.N-1)
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
    m.workers = pyo.RangeSet(0, problem.N-1)
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
layout: two-cols-header
layout-Class: gap-8
---

## Rewind:
$$s_i + y_i \cdot D_{min} \leq t_i \quad \forall \text{ workers } i$$
$$t_i \leq s_i + y_i \cdot D_{max} \quad \forall \text{ workers } i$$


::left::
<v-click>

**Case $y_i = 0$:**

</v-click>
<v-click>

$\Rightarrow s_i \leq t_i \text{ and } t_i \leq s_i$ 

</v-click>
<v-click>

$\Rightarrow s_i = t_i$

</v-click>

::right::
<v-click>


**Case $y_i = 1$:**
</v-click>
<v-click>

$\Rightarrow s_i + D_{min} \leq t_i \leq s_i + D_{max}$

</v-click>
<v-click>

$\Rightarrow D_{min} \leq t_i - s_i \leq D_{max}$

</v-click>


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
layout: two-cols-header
layout-Class: gap-8
---

## Why big-M?
$$s_i \leq x_{i,j} \cdot \alpha_j + (1 - x_{i,j}) \cdot M \quad \forall \text{ workers } i, \forall \text{ tasks } j$$

::left::

<v-click>

**Case $x_{i,j} = 0$:**

</v-click>
<v-click>

$\Rightarrow s_i \leq M$ 

</v-click>

::right::
<v-click>


**Case $x_{i,j} = 1$:**
</v-click>
<v-click>

$\Rightarrow s_i \leq \alpha_j$

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
    m.workers = pyo.RangeSet(0, problem.N-1)
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

## [Let's solve some problems](https://colab.research.google.com/github/jpjj/O4A-Hands-On-Modeling/blob/main/mathematical_modeling_complete.ipynb)


```python
m = create_model_instance(problem)
solver = Highs()
solver.solve(m)
```

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
2. **Many overlap constraints** - Scales with $O(N\cdot K^2)$
3. **Symmetry is a problem** - Permuting workers gives equivalent solutions
4. **Big-M is bad** - Creates weak LP relaxations

</v-clicks>

---
layout: image-right
image: https://images.unsplash.com/photo-1517217004452-4ff260cb5598?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

# The Improved Formulation
Chapter 3

---
layout: image-right

image: /assets/branch_and_bound.png
backgroundSize: 80%
zoom: 0.9

---
## Some Theory 1

Modern solvers use "Branch & Bound" to solve MIPs:

<v-clicks depth="2">

- Solve the linear relaxation (LR) of the problem.
- If not all variables of the optimal solution have integer values, pick one with float value $(y_i= 0.5)$ and create 2 new scenarios (branches):
    1. LR with constraint $y_i \leq 0$
    2. LR with constraint $y_i \geq 1$
- Rinse and repeat until LR has integral solution. Use the solution's value as a bound to cut off branches.
- If no branch is left to be discovered, return best integral solution found.

</v-clicks>


---
layout: image-right

image: /assets/loose_formulation.png
backgroundSize: 80%
---
## Some Theory 2

Weak/loose formulation: 

<v-clicks>

- The LR's feasible region is much larger than necessary
- Solving the relaxed MIP gets us fractional solutions that are far from any integer solution. 
- More branch-and-bound nodes & longer solve times.

</v-clicks>

---
layout: image-right

image: /assets/tight_formulation.png
backgroundSize: 80%
---
## Some Theory 3


Tight formulation:

<v-clicks depth="2">

- The linear relaxation's feasible region closely approximates the convex hull of integer feasible solutions. 
- The LP relaxation bound is close to the optimal integer solution value!
- Branch & Bound finds integer solution much faster.

</v-clicks>

<v-click>

## Goal:
Revisit our constraints, make them tighter!

</v-click>


---
layout: center
---

## Improvement 1: Tighter Big-M

$$s_i \leq x_{i,j} \cdot \alpha_j + (1 - x_{i,j}) \cdot M$$

**Why is a large M bad?** 

<v-clicks>

- In the linear relaxation, the optimal solution can exploit slack.
- Example: for $M=1000$ and $x_{i,j}= 0.99$, we get: $s_i \leq 0.99 \cdot \alpha_j + 10$
- This means the shift start of a worker $i$ doing a 99% share of task $j$ can be almost 10 hours after the task's start time! 

</v-clicks>

<v-click>


**Solution:** Make M as tight as possible! The maximum value $s_i$ can take is $24 - D_{min}$ (latest possible shift start).
$$M = 24 - D_{min}$$

</v-click>



---

## Improvement 2: Cutting Planes (Clique Inequality)
<br>

**Original overlap constraint:** One constraint per overlapping task *pair*:
$$x_{i,j_1} + x_{i,j_2} \leq 1 \quad \forall i, \forall \text{ overlapping } (j_1, j_2)$$

<br>

<v-click>

**Better:** For each hour, at most one task active at that hour can be assigned to a worker.

$$\sum_{j \text{ active at hour } h} x_{i,j} \leq 1 \quad \forall i, \forall h \in \mathbb{N}_{<24}$$

</v-click>


---
layout: two-cols-header
---

## Why is the new formulation tighter?
<br>

<v-clicks>

### Example:

Let us say we have 3 overlapping tasks $j_1, j_2, j_3$.

</v-clicks>

::left::

<v-clicks>

**Original overlap constraint:**:
$$x_{i,j_1} + x_{i,j_2} \leq 1$$
$$x_{i,j_2} + x_{i,j_3} \leq 1$$
$$x_{i,j_1} + x_{i,j_3} \leq 1$$
Feasible values for $x$:
$$x_{i,j_1} = x_{i,j_2} = x_{i,j_3} = 0.5$$

</v-clicks>

::right::

<v-clicks>

**New overlap constraint:** Since all three tasks overlap, there must be an hour $h'$ where they are all active.

$$x_{i,j_1} + x_{i,j_2} + x_{i,j_3} \leq \sum_{j \text{ active at hour } h'} x_{i,j}\leq 1$$
Setting the three variables to $0.5$ is no longer feasible!

</v-clicks>




---

### Two big wins:
1. Formulation just got tighter!
2. Huge reduction in number of constraints:
    - Number of old overlapping constraints scaled at $O(N\cdot K²)$.
    - New variant: $24$ per worker: $O(N)$.

<v-click>


```python
@m.Constraint(m.workers, m.hours)
def no_overlapping_tasks(m, i, h):
    active_tasks = overlapping_task_per_hour[h]
    if len(active_tasks) <= 1:
        return pyo.Constraint.Skip
    return pyo.quicksum(m.x[i, j] for j in active_tasks) <= 1

```

</v-click>


---
layout: image-right

image: /assets/meme_symmetry.png
---

## Improvement 3: Symmetry Breaking

**Problem:**

For instance (25,10), a single solution can have up to $10!$ duplicate solutions by permuting workers!


<v-click>


**One Solution:** 

Order workers by shift start time (or some other criterion).
New constraint:

$$s_{i-1}  \leq s_i \quad \forall i > 0$$


</v-click>

<v-click>


```python
    @m.Constraint(m.workers)
    def symmetry_breaker(m, i):
        if i == 0:
            return pyo.Constraint.Skip
        return m.s[i - 1] <= m.s[i]
```

</v-click>


---

## Improvement 4: Variable Bounds

Add explicit bounds on shift start and end times. These bounds are outside of the constraints and help the solver in the presolve phase.
- $s_i \in [0, 24 - D_{min}]$
- $t_i \in [D_{min}, 24]$

```python {2,4}
    m.s = pyo.Var(m.workers, domain=pyo.NonNegativeIntegers, 
                  bounds=(0, 24 - problem.D_min))
    m.t = pyo.Var(m.workers, domain=pyo.NonNegativeIntegers, 
                  bounds=(problem.D_min, 24))

```

---

## Let us solve, again!


---

## The Scaling Problem

Even with improvements, the model still struggles with larger instances. Why?

<v-clicks>

- **Variable count:** Scales with $O(N \cdot K)$
- **Constraint count:** Also scales with $O(N \cdot K)$
- **Integrality Gap:** Despite the tighter bounds & cutting planes, the solver is still searching many nodes


</v-clicks>

---

# Breakout Session #3: 
Your turn!

Can we formulate the model differently?
Think about:

- What is the information we really need from a solution?
- Can you think of any well known problem whose formulation we might use here?

---
layout: image-right
image: https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

# The Flow Formulation
Chapter 4


---
layout: image-right
image: https://optimization.cbe.cornell.edu/images/7/77/Picture2.png?20201125024008
backgroundSize: contain
---

## Introduction to Minimum Cost Flow


<v-click>

A **minimum cost flow** problem consists of:

</v-click>

<v-clicks>

- A directed graph $G=(V, A)$ with nodes $V$ and arcs $A$
- One **source** node with a certain supply
- One **sink** node with a demand equal to the supply
- Each arc has a **capacity** (max flow that can pass)
- Each arc has a **cost** (incurred per unit of flow)

</v-clicks>

<v-click>


**Goal:** Move all flow from source to sink with minimum total cost.

</v-click>

---
layout: image-right
---
## LP Formulation

$$
\begin{array}{rll}
\min & \displaystyle\sum_{a \in A} c_a \cdot f_a & \\[1em]
\text{s.t.} & \displaystyle\sum_{a: \text{tail}(a)=v} f_a - \sum_{a: \text{head}(a)=v} f_a = \text{supply}(v) & \forall v \in V \\[1em]
& f_a \leq \text{capacity}(a) & \forall a \in A \\[0.5em]
& f_a \geq 0 & \forall a \in A
\end{array}
$$

---
layout: image-right
image: /assets/tight_formulation.png
backgroundSize: 80%
---

### The big benefit
The constraint matrix is **totally unimodular**. 

The LP solution found by simplex is guaranteed to be integer!


---

## Let's try to formulate our problem as a flow

---

**Motivation**

- Think about the flow network being a time table.
- The flow units (our workers) work through their day and have to decide which task to do. 
- Looking at the solution flow, we should be able to see how workers should be assigned to tasks.


---
layout: image
image: /assets/graph1.png
backgroundSize: 40em
---

---
layout: image
image: /assets/graph2.png
backgroundSize: 40em
---


---
layout: image
image: /assets/graph3.png
backgroundSize: 40em
---


---
layout: image
image: /assets/graph4.png
backgroundSize: 40em
---


---
layout: image
image: /assets/graph5.png
backgroundSize: 40em
---


---
layout: image
image: /assets/graph6.png
backgroundSize: 52em
---


---
layout: image
image: /assets/graph7.png
backgroundSize: 40em
---


---
layout: image
image: /assets/graph8.png
backgroundSize: 40em
---


---
layout: image
image: /assets/graph9.png
backgroundSize: 40em
---


---
layout: image
image: /assets/graph10.png
backgroundSize: 40em
---


---
zoom: 0.7
---

## That is the new model formulation

```python

def create_flow_model(graph: Graph) -> pyo.ConcreteModel:
    """Create the flow model from the graph."""
    m = pyo.ConcreteModel("Worker Assignment - Flow Model")
    
    m.nodes = pyo.Set(initialize=graph.nodes)
    m.arcs = pyo.Set(initialize=graph.arcs)
    m.tasks = pyo.Set(initialize=graph.problem.tasks)

    m.f = pyo.Var(m.arcs, domain=pyo.NonNegativeIntegers)

    # Parameters
    m.cost = pyo.Param(m.arcs, initialize={e: flow_cost(e, graph.problem) for e in graph.arcs})
    m.supply = pyo.Param(m.nodes, initialize={v: flow_supply(v, graph.problem) for v in graph.nodes})

    # Flow conservation constraint
    @m.Constraint(m.nodes)
    def flow_conservation(m, v):
        outgoing = pyo.quicksum(m.f[e] for e in graph.outgoing_arcs[v])
        incoming = pyo.quicksum(m.f[e] for e in graph.incoming_arcs[v])
        return outgoing - incoming == m.supply[v]

    # Task assignment constraint: each task at most once
    @m.Constraint(m.tasks)
    def task_assignment(m, task):
        return pyo.quicksum(m.f[e] for e in graph.task_to_arcs[task]) <= 1

    # Objective: Minimize total cost
    @m.Objective(sense=pyo.minimize)
    def total_costs(m):
        return pyo.quicksum(m.cost[e] * m.f[e] for e in m.arcs)

    return m

```

---
layoutClass: gap-16
---

## Why is the Flow Formulation Better?

<v-click>

**1. Better Scaling**

| Model | Variables | Constraints |
|---------|-------------|---------------|
| Simple | $O(N \cdot K)$ | $O(N \cdot K^2)$ |
| Improved | $O(N \cdot K)$ | $O(N \cdot K)$ |
| Flow | $O(K)$ | $O(K)$ |

</v-click>

<v-click>

**2. Tighter Bounds** 

MIP formulation is extremely tight, thanks to 
- MCNF formulation being TU 
- additional clique inequalities yielding good branching properties

</v-click>


---

## Takeaways

<v-clicks depth="2">

1. **Start simple** to understand the problem.
2. If your formulation is hard to solve:
   - Can the number of variables/constraints be reduced? What information do we really need?
   - How tight is your formulation? Can the LR exploit some constraints? 
   - Symmetries?
3. **Know the catalog of well-studied MO problems**. Some are much easier to solve than others:
    - Graph problems: Paths, Trees, Flows, Matchings
    - Set Cover/Partitioning Problems
    - ...
4. There are great open source tools out there:
   - [Pyomo for Modeling](https://pyomo.readthedocs.io/)
   - [HiGHS as powerful Open Source Solver](https://highs.dev/)
   - [Pydantic for data validation](https://docs.pydantic.dev/latest/) (read: less headache)


</v-clicks>

<!-- Like partition problem. Max Cover Problem. Set Cover, Shortest path + Minimum Spanning tree have exact algorithms. Assignment problems are flow problems etc. There is a lot to know. I recommend following Optimization4All, they have a lot more to cover. -->

---

## Further Topics


<v-clicks depth="2">

For larger instances:
- Decomposition strategies (Column Generation)
- Metaheuristics (this is scheduling, after all!)
- Constraint Programming
- ...

Extensions to the problem:
- Finer time granularity (minutes instead of hours)
- More complex cost functions (overtime charges)
- Weekly scheduling with fairness constraints
- Handling infeasibility (maximize served tasks)


</v-clicks>


---
layout: cover
background: https://images.unsplash.com/photo-1466094899371-97b327dff551?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---


<br>
<br>

##  Thank you!


<br>
<br>
<br>
<br>

<div class="flex flex-col gap-4 mt-8">

  <a href="https://colab.research.google.com/github/jpjj/O4A-Hands-On-Modeling/blob/main/mathematical_modeling_complete.ipynb" target="_blank" class="flex items-center gap-2 text-xl opacity-85 hover:opacity-100">
    <carbon-logo-python class="text-2xl" /> All the code to run in google colab
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

jpjsolutions.com/presentations/hands-on-modeling