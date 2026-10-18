<script setup lang="ts">
import data from './mznc2026.json'

// Head-to-head Borda points of CP-SAT vs. Gurobi 12 (free category, 1 core) per problem.
// Each problem has 5 instances, so both sides add up to 5 points.
const highlight = ['nonogram', 'workforce-alloc', 'orthorio']
const rows = [...data.cpsat_vs_gurobi_free].reverse() // CP-SAT's strongest problems first
const MAX = 5
</script>

<template>
  <div class="viz-root">
    <div class="header">
      <span class="left"><i class="swatch mip" />Gurobi 12 wins</span>
      <span class="right">CP-SAT wins<i class="swatch cpsat" /></span>
    </div>
    <div
      v-for="row in rows"
      :key="row.problem"
      class="row"
      :title="`${row.problem}: CP-SAT ${row.a} : ${row.b} Gurobi (points out of 5)`"
    >
      <div class="label" :class="{ strong: highlight.includes(row.problem) }">{{ row.problem }}</div>
      <div class="half left">
        <div class="bar mip" :style="{ width: `${(row.b / MAX) * 100}%` }" />
      </div>
      <div class="half right">
        <div class="bar cpsat" :style="{ width: `${(row.a / MAX) * 100}%` }" />
      </div>
    </div>
    <div class="axis">
      <span />
      <span class="ticks"><span>5</span><span>0</span></span>
      <span class="ticks"><span /><span>5</span></span>
    </div>
  </div>
</template>

<style scoped>
.viz-root {
  --series-cpsat: #2a78d6;
  --series-mip: #eb6834;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --text-muted: #898781;
  --baseline: #c3c2b7;
  font-size: 0.68rem;
  color: var(--text-primary);
}
.header,
.row,
.axis {
  display: grid;
  grid-template-columns: 11rem 1fr 1fr;
  align-items: center;
}
.header {
  margin-bottom: 0.3rem;
  color: var(--text-secondary);
  font-size: 0.75rem;
}
.header .left {
  grid-column: 2;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.header .right {
  grid-column: 3;
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.row {
  height: 1.02rem;
}
.label {
  color: var(--text-secondary);
  white-space: nowrap;
  padding-right: 0.5rem;
  text-align: right;
}
.label.strong {
  color: var(--text-primary);
  font-weight: 700;
}
.half {
  display: flex;
  height: 100%;
  align-items: center;
}
.half.left {
  justify-content: flex-end;
  border-right: 1px solid var(--baseline);
  padding-right: 1px;
}
.half.right {
  padding-left: 1px;
}
.bar {
  height: 10px;
}
.half.left .bar {
  border-radius: 4px 0 0 4px;
}
.half.right .bar {
  border-radius: 0 4px 4px 0;
}
.axis {
  color: var(--text-muted);
  margin-top: 0.15rem;
}
.ticks {
  display: flex;
  justify-content: space-between;
  font-variant-numeric: tabular-nums;
}
.swatch {
  display: inline-block;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 2px;
}
.cpsat { background: var(--series-cpsat); }
.mip { background: var(--series-mip); }
</style>
