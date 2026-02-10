---
# try also 'default' to start simple
theme: default
aspectRatio: 2/1
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://images.unsplash.com/photo-1520022911530-fea50671df2e?q=80&w=2499&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
# https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Hans on
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
transition: fade
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
# duration of the presentation
duration: 35min

hide: false
---
## 1 Expectation Management:

This session is about hands-on practices on how to convert a business problem (scheduling/assignment problem) into a mathematical optimization model.
We will start with a base model which we will improve by considering some often times applied tips and tricks to make the model run faster and solve bigger instances.

In the end, I show you that often times, problems can be modeled in more than one way. Going a step back and viewing the problem from a completely different point of view can be very beneficial. **We are talking about solving the same problem in 8 hours solving time (model 1) vs 10 seconds (model 2)**

Tech stack: We will use **pyomo** for modelling and **highs** for solving. Both tools I can strongly recommend. 


---

## 2 Let us take a look at the problem:

Maybe two or three slides, always focusing what is important.

There are $N$ **workers** and $M$ **tasks**.

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

## 3 Show some baby Example

Let us say we have 3 **workers** and 3 **tasks**
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

# Let us visualize the solution

![Visualization](/assets/baby_example_solution.png)


---

6 Questions? Is everybody ready to model this problem? Breakout!

- How to model:
	- Assignment of tasks to workers?
	- Overlap of tasks not allowed?
	- shift length of a worker:
		- No task: 0
		- At least one task:
			- You have to work at least $D_{min}$ hours.
			- You cannot work more than $D_{max}$.
- Your tools: **Create variables, constraints, objective function**!

---

7 One way of modelling the problem: Assignment Problem

Remember: We have our input:
- number of workers N, 
- M tasks with start and end time each, 
- D_min, 
- D_max
We need:
- Variables
- Constraints
- Objective Function

---

8 Variables

They decide what to do:
- $y_i\in \{0,1\}$, $y_i = 1$ iff worker i will have a shift.
- $x_{i,j}\in \{0,1\}$, $x_{i,j} = 1$ iff worker $i$ will do task $j$.
- $s_i \in \mathbb{N}$ shift start of worker i.
- $t_i \in \mathbb{N}$ shift end of worker i.

---

9 Going back to the example

- $x_{1,0} = 1$, because worker 1 does task 0.
- $y_0 = 0$, because worker 0 does not work.
- $s_2 = 11$, $t_2=21$. Worker 2 starts at 11:00 and ends their shift at 21:00.

---

10 Constraints

Best would be to showcase every constraint side by side with the pyomo code!!
Maybe here really every single reveal one at a time.
- Every task needs to be served:
	- $\sum_{i=0}^{N-1}x_{i,j} = 1$ for all tasks $j$.
	- We call this constraint: `fulfill_all_tasks`
- No Overlapping tasks:
	- $x_{i,j_1} + x_{i, j_2} \leq 1$ for all workers $i$ and all **task pairs** $j_1, j_2$ that **overlap**.
	- We call this constraint `no_overlapping_tasks`.
- Shift of a single worker:
	- $s_i + y_i D_{min} \leq t_i$ for all workers $i$.
	- `minimum_shift_length`
	- $t_i \leq s_i + y_iD_{max}$ for all workers $i$
	- `maximum_shift_length`
- Let us check the last two constraints:
	- If $y_i = 0$, we get:
		- $s_i \leq t_i$ and $t_i \leq s_i$. So: $s_i = t_i$.
	- If $y_i = 1$, we get:
		- $s_i + D_{min} \leq t_i \leq s_i + D_{max}$. The shift end is between $D_{min}$ and $D_{max}$ hours after shift start $s_i$.
- Assigned task must be within worker's shift:
	- $x_{i,j}\omega_j \leq t_i$ for all workers $i$ and tasks $j$.
	- `task_end_before_shift_end`
	- $s_i \leq x_{i,j}\alpha_j + (1 - x_{i,j})M$ all workers $i$ and tasks $j$.  
	- PROBLEM: This constraint should have no effect if  $x_{i,j} = 0$. This is why we use **big-M** here.
	- `task_start_after_shift_start`

---

11 Objective function

Minimize the sum of all shift lengths:
- $minimize \sum_{i=1}^N t_i - s_i$

---

12 Problem defined, let us solve it!

---

13 Go to the google collab, show the complete code

---

14 Show a first, easy problem instance, that is not trivial: (25,10)

---

15 Let the model run, show the final result


<!-- ![[Pasted image 20260127164944.png]] -->

---

16 Show next, bigger instance, let it run again

It takes time! Problem. Look at the solver logs. Do not go too deep, would be for another hands on session. But what we see: It detects symmetries that we try to solve.
Maybe we can also see that it reduced number of columns/constraints? Hint for cutting plain!

---

16.5 Breakout sessions! How can we improve?

Discuss on what can be made better regarding the model!

---

17 Problem Analysis

1. How many variables, how many constraints do we have? Print model!
2. Shit, a lot of overlap constraints.
3. Also symmetry is a problem.
4. Also, big-M is bad.
5. What we do: We will shrink the solution space while keeping an optimal solution.

---

18 Big M bad

Go back to that constraint:
- $s_i \leq x_{i,j}\alpha_j + (1 - x_{i,j})M$ all workers $i$ and tasks $j$.  
- Why is it bad? In the linear relaxation of the Problem, the optimal solution can take advantage of it. The bigger the M, the more slack the variable $s_i$ gets even $x_{i,j}$ that is almost $x$. Maybe get a better explanation here.
- Rule: If possible, avoid these "Xor" kind of constrains (maybe see again in blue book).
- Make $M$ as tight as possible. In this case: Set it to $24-D_{min}$, because this is the highest value $s_i$ can become.

---

19 Symmetry bad

Show different variations of the baby example (or two), and show them that they are all the same.
We see: Even for (25,10) instances, one single solution can have up to 10! dublicate solution by just permutating the worker to tasks assignment
Solution: Introduce symmetry breaking. Can by done in multiple ways.
Here, we decide to order the workers by start time (can also be ordered by total work time or whatever). This reduces the searchspace immensly.

---

20 cutting planes

What if we introduce constraints that reduce the solution space of the linear relaxation without reducing the solution space of the MILP? This is cutting planes.
- Let us take a look at the overlapping example. Let us take 3 tasks that overlap.
- Shoe example where one worker would fulfill all three by 0.5 and it is feasible. But if we put all together, it is not longer without changing MILP. We still get the overlapping idea.
- Zeige, dass man sich einfach pro Stunde alle overlapping tasks schnappen kann. So hat man am Ende gerade mal 24 neue Constraints, easy!

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
