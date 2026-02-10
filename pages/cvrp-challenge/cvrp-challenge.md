---
# try also 'default' to start simple
theme: seriph
# Force dark mode for exports/printing
colorSchema: dark
# aspectRatio: 2/1
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
# https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Hands-On Modeling
info: |
  ## Jens-Peter Joost
  Presentation slides for Optimization for all Hands-On Session.
  Find notebook [here](https://github.com/jpjj/O4A-Hands-On-Modeling)
# apply UnoCSS classes to the current slide
# class: text-center
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

# The VRP solver comparison

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  next page <carbon:arrow-right />
</div>


---
zoom: 1.9
layout: center
---


Which 

<span class="i-carbon-favorite-filled inline-block" /> Open Source 

 <span class="i-carbon-logo-python inline-block" />  Python Library 

 is best at solving the CVRP?

---
zoom: 1.5
---

## The libraries

<br>

- <button class="i-carbon-delivery-truck  align-middle" />  pyhygese
- <img src="https://avatars.githubusercontent.com/u/19623112?" style="height: 1em; width: 1em; display: inline; vertical-align: middle;" /> vroom 
- <button class=" i-cib:rust  align-middle" /> rustvrp
- <img src="https://avatars.githubusercontent.com/u/129956415?s=200&v=4" style="height: 2em; width: 2em; display: inline; vertical-align: middle;" />pyvrp
- <img src="https://avatars.githubusercontent.com/u/116365883?s=280&v=4" style="height: 2em; width: 2em; display: inline; vertical-align: middle;" />timefold
- <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/OR-Tools_Logo.png" style="height: 1em; width: 1em; display: inline; vertical-align: middle;"/> or-tools

---

## The benchmarks

<br>

- 100 different vrp instances
- 100 - 1000 clients

![alt text](/assets/cvrp/image.png)
Instance X-n101-k25


<div class="abs-bl m-6 text-xl">
    Set X from CVRPLib
</div>

---
zoom: 1.2
---

## The results:

<br>

<div class="relative inline-block">
  <div class="blur-sm">

| Solver   | #solved | Solution Quality |
| -------- | ------- | ---------------- |
| ortools  | 100     | 1.071            |
| pyhygese | 100     | 1.008            |
| pyvrp    | 100     | 1.004            |
| rustvrp  | 100     | 1.045            |
| timefold | 100     | 1.487            |
| vroom    | 100     | 1.018            |

  </div>
  <div class="absolute inset-0 flex items-center justify-center">
    <span class="text-red-500 text-3xl font-bold -rotate-12">They do not matter</span>
  </div>
</div>




---
zoom: 1.3
---

## CVRP $\neq$ real world routing

<br>
<br>

What CVRP does not consider:

<br>


<button class="i-carbon-time align-middle" /> time windows

<button class="i-carbon-calendar-heat-map align-middle" /> working time regulations

<button class="i-carbon-delivery-add align-middle" /> heterogenous fleet

<button class="i-carbon-time-plot align-middle" />  time-dependent travel times

...


---
zoom: 1.2
---

<br>


### We need to ask:

<br>


<button class="i-carbon-task align-middle" />  Which constraints can these libraries model?

<br>

<button class="i-carbon-document align-middle" />  How well-documentated are they? 

<br>

<button class="i-carbon-tools align-middle" />  Are they actively maintained?

<br>
<button class="i-carbon-logo-python time align-middle" />  And: Why are we restricting ourselves to python?

---
zoom: 1.5
---

#### Stay tuned for deep dives into these Routing Tools

<br>

- <button class="i-carbon-delivery-truck  align-middle" />  pyhygese
- <img src="https://avatars.githubusercontent.com/u/19623112?" style="height: 1em; width: 1em; display: inline; vertical-align: middle;" /> vroom 
- <button class=" i-cib:rust  align-middle" /> rustvrp
- <img src="https://avatars.githubusercontent.com/u/129956415?s=200&v=4" style="height: 2em; width: 2em; display: inline; vertical-align: middle;" />pyvrp
- <img src="https://avatars.githubusercontent.com/u/116365883?s=280&v=4" style="height: 2em; width: 2em; display: inline; vertical-align: middle;" />timefold
- <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/OR-Tools_Logo.png" style="height: 1em; width: 1em; display: inline; vertical-align: middle;"/> or-tools
- <img src="https://media.licdn.com/dms/image/v2/D4D0BAQFdVpzit8RZrQ/company-logo_200_200/B4DZrz2Mv2JMAI-/0/1765027663281/solverforge_logo?e=1772064000&v=beta&t=iNYg8ioClh5y9qMDam47WIFaDNMqDNC7aiTLt3i_z1g" style="height: 1em; width: 1em; display: inline; vertical-align: middle;" /> solverforge