---
theme: default
colorSchema: light
routerMode: hash
favicon: 'https://raw.githubusercontent.com/jpjj/jpjj.github.io/main/assets/favicon_jpjsolutions.png'
title: 'One Year as an OR Freelancer — 5 Lessons'
info: |
  ## Jens-Peter Joost — JPJ Solutions
  A 5-slide LinkedIn carousel with the most important findings from my talk
  "My First Year as an OR Freelancer".
class: text-center
aspectRatio: 4/5
canvasWidth: 1080
drawings:
  persist: false
transition: none
mdc: true
hide: false
---

<style>
/* ---------- shared (global, loaded on the first slide) ---------- */
:root {
  --navy: #0c384a;
  --blue: #005597;
  --slate: #353f52;
  --teal: #d6e5e9;
  --teal-soft: #eef5f7;
  --gold: #b8860b;
  --ink: #16242c;
}

.slidev-layout {
  padding: 0 !important;
  font-family: 'Avenir Next', 'Segoe UI', system-ui, sans-serif;
  color: var(--ink);
}

.jpj-logo {
  display: inline-block;
  width: 1.4em;
  height: 1.4em;
  background: var(--blue);
  -webkit-mask: url(/assets/jpjsolutions_logo.svg) center / contain no-repeat;
          mask: url(/assets/jpjsolutions_logo.svg) center / contain no-repeat;
  flex-shrink: 0;
}
.jpj-logo.small { width: 1.15em; height: 1.15em; }
.jpj-logo.tiny  { width: 1em; height: 1em; }

.accent { color: var(--blue); }

/* ---------- cover ---------- */
.cover {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(120% 80% at 50% -10%, #14506a 0%, var(--navy) 55%, #07222e 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 70px;
  box-sizing: border-box;
}
.cover-top {
  display: flex;
  align-items: center;
  gap: 14px;
  font-weight: 800;
  letter-spacing: 0.12em;
  font-size: 1.05rem;
}
.cover .jpj-logo, .cta .jpj-logo { background: #6fb7d6; }
.cover-brand { opacity: 0.95; }
.cover-kicker {
  margin-top: 50px;
  font-size: 0.92rem;
  letter-spacing: 0.32em;
  color: #7fd0f0;
  font-weight: 700;
}
.cover-title {
  font-size: 4.4rem;
  line-height: 1.02;
  font-weight: 900;
  margin: 22px 0 0;
  letter-spacing: -0.01em;
}
.cover-title .accent { color: #6fd0f3; }
.cover-sub {
  font-size: 1.7rem;
  opacity: 0.9;
  margin: 22px 0 0;
  font-weight: 500;
}
.cover-photo-wrap {
  margin-top: 50px;
  width: 330px;
  height: 330px;
  border-radius: 9999px;
  padding: 8px;
  background: linear-gradient(140deg, #6fd0f3, var(--blue));
  box-shadow: 0 30px 60px rgba(0,0,0,0.45);
}
.cover-photo {
  width: 100%; height: 100%;
  border-radius: 9999px;
  object-fit: cover;
  object-position: center 18%;
}
.cover-name {
  margin-top: 32px;
  font-size: 2rem;
  font-weight: 800;
}
.cover-role {
  font-size: 1.05rem;
  opacity: 0.75;
  margin-top: 6px;
  letter-spacing: 0.02em;
}
.swipe {
  position: absolute;
  bottom: 46px;
  right: 70px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #7fd0f0;
  letter-spacing: 0.05em;
}

/* ---------- content slides ---------- */
.slide {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 60px 72px 72px;
  box-sizing: border-box;
}
.slide::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 14px; height: 100%;
  background: linear-gradient(var(--blue), var(--navy));
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--slate);
}
.topbar-left { display: flex; align-items: center; gap: 10px; }
.topbar-left .jpj-logo { background: var(--blue); }
.topbar-right { color: var(--gold); }

.slide .body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 0;
}

.lesson-num {
  margin-top: 0;
  font-family: Georgia, serif;
  font-style: italic;
  font-weight: 700;
  font-size: 5rem;
  line-height: 1;
  color: var(--teal);
}
.lesson-title {
  font-size: 2.9rem;
  line-height: 1.1;
  font-weight: 900;
  color: var(--navy);
  margin: 6px 0 0;
  letter-spacing: -0.01em;
}

.points { margin-top: 42px; display: flex; flex-direction: column; gap: 30px; }
.point {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 20px;
  align-items: start;
  font-size: 1.32rem;
  line-height: 1.5;
}
.point-ic { color: var(--blue); font-size: 1.7rem; margin-top: 2px; }
.point b { color: var(--navy); }

/* channels */
.channels { margin-top: 38px; display: flex; flex-direction: column; gap: 8px; }
.ch-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  align-items: center;
  padding: 22px 4px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
.ch-row.last { border-bottom: none; }
.ch-rank {
  font-family: Georgia, serif;
  font-style: italic;
  font-weight: 700;
  font-size: 3rem;
  color: var(--navy);
  line-height: 1;
}
.ch-title { font-weight: 800; font-size: 1.5rem; color: var(--navy); }
.ch-tag {
  font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.2em;
  color: var(--gold); margin: 4px 0 6px; font-weight: 700;
}
.ch-desc { font-size: 1.12rem; line-height: 1.45; opacity: 0.82; }

/* paradox slide */
.lead { margin-top: 34px; font-size: 1.34rem; line-height: 1.5; }
.lead b { color: var(--navy); }
.skills {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
}
.skill {
  display: flex; align-items: center; gap: 12px;
  background: var(--teal-soft);
  border-left: 4px solid var(--blue);
  border-radius: 8px;
  padding: 16px 18px;
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--navy);
}
.skill svg { color: var(--blue); font-size: 1.4rem; flex-shrink: 0; }
.paradox {
  margin-top: 32px;
  font-size: 1.32rem;
  line-height: 1.5;
  background: var(--navy);
  color: #eaf4f8;
  padding: 24px 28px;
  border-radius: 14px;
}
.paradox b { color: #7fd0f0; }
.paradox i { color: #bcd6e0; }

.footer {
  margin-top: auto;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.95rem; font-weight: 700; color: var(--slate);
  letter-spacing: 0.05em;
}
.footer .jpj-logo { background: var(--blue); }

/* ---------- CTA ---------- */
.cta {
  position: relative;
  width: 100%; height: 100%;
  background: radial-gradient(120% 80% at 50% -10%, #14506a 0%, var(--navy) 55%, #07222e 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 72px;
  box-sizing: border-box;
}
.cta .cover-top { color: #fff; }
.cta-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.cta-photo-wrap {
  margin-top: 0;
  width: 220px; height: 220px;
  border-radius: 9999px; padding: 7px;
  background: linear-gradient(140deg, #6fd0f3, var(--blue));
  box-shadow: 0 24px 50px rgba(0,0,0,0.45);
}
.cta-photo {
  width: 100%; height: 100%;
  border-radius: 9999px; object-fit: cover; object-position: center 18%;
}
.cta-title {
  margin-top: 42px;
  font-size: 3.4rem; font-weight: 900; letter-spacing: -0.01em;
}
.cta-sub {
  margin-top: 18px; font-size: 1.45rem; line-height: 1.45; opacity: 0.88;
}
.cta-btn {
  margin-top: 42px;
  display: inline-flex; align-items: center; gap: 14px;
  background: #ff0033;
  color: #fff; font-weight: 800; font-size: 1.5rem;
  padding: 20px 40px; border-radius: 9999px;
  box-shadow: 0 18px 40px rgba(255,0,51,0.35);
}
.cta-btn svg { font-size: 1.9rem; }
.cta-link {
  margin-top: 18px; font-size: 1.15rem; letter-spacing: 0.04em; color: #7fd0f0; font-weight: 600;
}
.cta-foot {
  margin-top: auto;
  display: flex; flex-direction: column; gap: 12px;
  font-size: 1.15rem; font-weight: 600; opacity: 0.92;
}
.cta-foot > div { display: flex; align-items: center; justify-content: center; gap: 10px; }
.cta-foot svg { font-size: 1.4rem; color: #7fd0f0; }
.cta-foot .jpj-logo { background: #6fb7d6; }
</style>

<div class="cover">

<div class="cover-top">
  <span class="jpj-logo"></span>
  <span class="cover-brand">JPJ&nbsp;SOLUTIONS</span>
</div>

<div class="cover-kicker">OPERATIONS RESEARCH · FREELANCING</div>

<h1 class="cover-title">One year as an<br><span class="accent">OR freelancer</span></h1>

<p class="cover-sub">5 honest lessons from year one</p>

<div class="cover-photo-wrap">
  <img src="/assets/peter.png" class="cover-photo" />
</div>

<div class="cover-name">Jens-Peter Joost</div>
<div class="cover-role">Operations Research Freelancer · jpjsolutions.com</div>

<div class="swipe">Swipe →</div>

</div>

---

<div class="slide">

<div class="topbar">
  <div class="topbar-left"><span class="jpj-logo small"></span> OR FREELANCING · YEAR ONE</div>
  <div class="topbar-right">01 / 03</div>
</div>

<div class="body">

<div class="lesson-num">01</div>
<h2 class="lesson-title">Clients don't buy tech<br>stacks. They buy <span class="accent">trust</span>.</h2>

<div class="points">
  <div class="point">
    <div class="point-ic"><carbon-checkmark-filled /></div>
    <div><b>Concrete industry experience</b> beats any tool list — 6 years in the field opens doors a CV of frameworks never will.</div>
  </div>
  <div class="point">
    <div class="point-ic"><carbon-checkmark-filled /></div>
    <div><b>Testimonials transfer trust.</b> A recommendation from a happy client in a management role does the selling for you.</div>
  </div>
  <div class="point">
    <div class="point-ic"><carbon-checkmark-filled /></div>
    <div><b>Ask the moment a project ends well.</b> A LinkedIn recommendation is public, hard to fake, and lowers the barrier for the next prospect.</div>
  </div>
</div>

</div>

<div class="footer"><span class="jpj-logo tiny"></span> jpjsolutions.com</div>

</div>

---

<div class="slide">

<div class="topbar">
  <div class="topbar-left"><span class="jpj-logo small"></span> OR FREELANCING · YEAR ONE</div>
  <div class="topbar-right">02 / 03</div>
</div>

<div class="body">

<div class="lesson-num">02</div>
<h2 class="lesson-title">Your <span class="accent">network</span> is your<br>#1 source of work.</h2>

<div class="channels">
  <div class="ch-row">
    <div class="ch-rank">01</div>
    <div class="ch-body">
      <div class="ch-title">Personal &amp; professional network</div>
      <div class="ch-tag">Highest signal</div>
      <div class="ch-desc">Former colleagues and clients. Personal contact creates trust money can't buy — almost every project traced back here.</div>
    </div>
  </div>
  <div class="ch-row">
    <div class="ch-rank">02</div>
    <div class="ch-body">
      <div class="ch-title">LinkedIn</div>
      <div class="ch-tag">Long-term play</div>
      <div class="ch-desc">A love/hate relationship — but presence compounds. Showing up consistently keeps you top of mind.</div>
    </div>
  </div>
  <div class="ch-row last">
    <div class="ch-rank">03</div>
    <div class="ch-body">
      <div class="ch-title">Freelancer platforms</div>
      <div class="ch-tag">Low effort, low yield</div>
      <div class="ch-desc">A clearly labeled OR project shows up roughly once every two months. Worth being on — don't rely on it.</div>
    </div>
  </div>
</div>

</div>

<div class="footer"><span class="jpj-logo tiny"></span> jpjsolutions.com</div>

</div>

---

<div class="slide">

<div class="topbar">
  <div class="topbar-left"><span class="jpj-logo small"></span> OR FREELANCING · YEAR ONE</div>
  <div class="topbar-right">03 / 03</div>
</div>

<div class="body">

<div class="lesson-num">03</div>
<h2 class="lesson-title">Most of the work isn't OR —<br>but OR is the <span class="accent">USP</span>.</h2>

<p class="lead">The math is rarely the bottleneck. Getting the solution <b>applied in real life</b> is. That means being proficient at everything around the solver:</p>

<div class="skills">
  <div class="skill"><carbon-document /> Requirements Engineering</div>
  <div class="skill"><carbon-user-multiple /> Change Management</div>
  <div class="skill"><carbon-data-check /> Data Validation</div>
  <div class="skill"><carbon-scales /> Expectation Management</div>
  <div class="skill"><carbon-renew /> Iterative Feedback Loops</div>
  <div class="skill"><carbon-code /> Software Engineering &amp; Testing</div>
</div>

<p class="paradox">OR is a <b>small part</b> of the job — yet it's exactly what clients hire you for. Master the toolbox <i>(MIP, heuristics, CP, exact algorithms)</i>, then everything around it.</p>

</div>

<div class="footer"><span class="jpj-logo tiny"></span> jpjsolutions.com</div>

</div>

---

<div class="cta">

<div class="cover-top">
  <span class="jpj-logo"></span>
  <span class="cover-brand">JPJ&nbsp;SOLUTIONS</span>
</div>

<div class="cta-body">

<div class="cta-photo-wrap">
  <img src="/assets/peter.png" class="cta-photo" />
</div>

<h2 class="cta-title">Want the full story?</h2>
<p class="cta-sub">I gave a 50-minute talk on my first year as an<br>OR freelancer. The full livestream is on YouTube.</p>

<div class="cta-btn"><carbon-logo-youtube /> Watch the recording</div>
<div class="cta-link">youtube.com/live/ZaFQ8Z3u54o</div>

</div>

<div class="cta-foot">
  <div><carbon-logo-linkedin /> Jens-Peter Joost — let's connect</div>
  <div><span class="jpj-logo tiny"></span> jpjsolutions.com</div>
</div>

</div>
