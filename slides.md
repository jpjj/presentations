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

## Improvement 2: Cutting Planes (Clique Inequality)


**Original overlap constraint:** One constraint per overlapping task *pair*:
$$x_{i,j_1} + x_{i,j_2} \leq 1 \quad \forall i, \forall \text{ overlapping } (j_1, j_2)$$

**Better:** For each hour, at most one task active at that hour can be assigned to a worker.

$$\sum_{j \text{ active at hour } h} x_{i,j} \leq 1 \quad \forall i, \forall h \in [0, 23]$$


---

## Improvement 2: Cutting Planes (Clique Inequality)
Two big wins:
1. Formulation just got tighter!
2. Huge reduction in number of constraints:
    - Number of old overlapping constraints scaled at $O(K²)$.
    - New variant: constant $24$.

```python
@m.Constraint(m.workers, m.hours)
def no_overlapping_tasks(m, i, h):
    active_tasks = overlapping_task_per_hour[h]
    if len(active_tasks) <= 1:
        return pyo.Constraint.Skip
    return pyo.quicksum(m.x[i, j] for j in active_tasks) <= 1

```

---
layout: image-right

image: /assets/meme_symmetry.png
---

## Improvement 3: Symmetry Breaking


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

Back to the bat mobile...

---

## The Scaling Problem

Even with improvements, the model still struggles with larger instances. Why?

**Variable count:** Scales with $O(N \cdot K)$

**Constraint count:** Also scales with $O(N \cdot K)$

Can we do better?

---

# Part 6: A Different Perspective

## Breakout Session 3: Can we formulate this differently?

---

## Introduction to Minimum Cost Flow

A **minimum cost flow** problem consists of:
- A directed graph with nodes and arcs
- One **source** node with a certain supply
- One **sink** node with a demand equal to the supply
- Each arc has a **capacity** (max flow that can pass)
- Each arc has a **cost** (incurred per unit of flow)

**Goal:** Move all flow from source to sink with minimum total cost.

---
layout: two-cols
layoutClass: gap-16
---

### LP Formulation

**Variables:** $f_e \geq 0$ for each arc $e$

**Flow Conservation:**
$$\sum_{e \text{ outgoing from } v} f_e - \sum_{e \text{ incoming to } v} f_e = \text{supply}(v)$$

**Capacity:**
$$f_e \leq \text{capacity}(e)$$

**Objective:**
$$\min \sum_e c_e \cdot f_e$$

::right::

### The big benefit
The constraint matrix is **totally unimodular**. This means the LP solution found by simplex is guaranteed to be integer!

These problems are **very easy to solve**.


---

28 Why should I care?

You guessed it. We can formulate our problem as a flow model

---

**Motivation**

- Think about the flow being our workers. 
- We have as much flow units as we have workers.
- Depending on how the flow travels the network shows us which worker should be assigned to which task.


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
layout: quote
---

We have waited long enough, let us go to google collab and start this rocket!

---
layout: two-cols
layoutClass: gap-16
---

## Why is the Flow Model Better?

**Scaling Analysis:**

| Model | Variables | Constraints |
|---------|-------------|---------------|
| Basic | $O(N \cdot K)$ | $O(N \cdot K^2)$ |
| Improved | $O(N \cdot K)$ | $O(N \cdot K)$ |
| Flow | $O(D_{max} \cdot K)$ | $O(D_{max} \cdot K)$ |

::right::

**Key insight:** The flow model doesn't scale with the number of workers!

- Increasing workers: No effect on graph size
- Increasing tasks: Each task appears in at most $D_{max}$ workflow layers

**Additional benefits:**
1. Near total unimodularity means quick branching
2. Easy to add complex cost functions
3. Instead of returning "INFEASIBLE", it still gives a useful plan with the maximum number of fulfilled tasks.




---

## Part 7: Key Takeaways

1. **Start simple**: Begin with a straightforward formulation to understand the problem
2. **Analyze and improve**:
   - Tighten Big-M constants
   - Add symmetry breaking constraints
   - Use cutting planes / clique constraints
   - Set variable bounds
3. **Think differently**: Sometimes a completely different formulation is the answer
   - The flow model turned an 8-hour solve into 10 seconds!
   - Understanding problem structure enables better models
4. **Know your tools**: 
   - Pyomo for modeling
   - HiGHS for solving
   - Pydantic for creating classes
   - All these tools are free, powerful, and production-ready

---

## Further Topics

For even larger instances:
- Decomposition strategies (Benders, Dantzig-Wolfe)
- Metaheuristics (this is scheduling, after all!)
- Hybrid approaches

Extensions to the problem:
- Finer time granularity (minutes instead of hours)
- More complex cost functions (overtime charges)
- Weekly scheduling with fairness constraints
- Handling infeasibility (maximize served tasks)

---
layout: end
---

Thank you!

**Let's connect on linkedin:** [Jens-Peter Joost](https://www.linkedin.com/in/jens-peter-joost/)

**Resources:**
- [Pyomo Documentation](https://pyomo.readthedocs.io/)
- [HiGHS Solver](https://highs.dev/)
- [Network Flow Problems](https://en.wikipedia.org/wiki/Network_flow_problem)