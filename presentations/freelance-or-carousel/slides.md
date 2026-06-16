---
theme: default
colorSchema: light
routerMode: hash
favicon: 'https://raw.githubusercontent.com/jpjj/jpjj.github.io/main/assets/favicon_jpjsolutions.png'
title: 'One Year as an OR Freelancer — 5 Lessons'
info: |
  ## JPJ Solutions
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
  justify-content: center;
  text-align: center;
  padding: 70px;
  box-sizing: border-box;
}
.cover-top {
  position: absolute;
  top: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 800;
  letter-spacing: 0.14em;
  font-size: 1.5rem;
}
.cover .jpj-logo, .cta .jpj-logo { background: #6fb7d6; }
.cover .cover-title {
  font-size: 5.6rem;
  line-height: 1.0;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
}
.cover-title .accent { color: #6fd0f3; }
.cover .cover-sub {
  font-size: 2.6rem;
  opacity: 0.92;
  margin: 28px 0 0;
  font-weight: 600;
}
.cover-photo-wrap {
  margin-top: 64px;
  width: 400px;
  height: 400px;
  border-radius: 9999px;
  padding: 9px;
  background: linear-gradient(140deg, #6fd0f3, var(--blue));
  box-shadow: 0 30px 60px rgba(0,0,0,0.45);
}
.cover-photo {
  width: 100%; height: 100%;
  border-radius: 9999px;
  object-fit: cover;
  object-position: center 18%;
}
.swipe {
  position: absolute;
  bottom: 54px;
  right: 70px;
  font-size: 1.7rem;
  font-weight: 800;
  color: #7fd0f0;
  letter-spacing: 0.04em;
}

/* ---------- content slides ---------- */
.slide {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 64px 76px 70px;
  box-sizing: border-box;
}
.slide::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 16px; height: 100%;
  background: linear-gradient(var(--blue), var(--navy));
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--slate);
}
.topbar-left { display: flex; align-items: center; gap: 12px; }
.topbar-left .jpj-logo { background: var(--blue); width: 1.5em; height: 1.5em; }
.topbar-right { color: var(--gold); }

.slide .body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.lesson-num {
  font-family: Georgia, serif;
  font-style: italic;
  font-weight: 700;
  font-size: 7rem;
  line-height: 1;
  color: var(--teal);
}
.slide .lesson-title {
  font-size: 4.4rem;
  line-height: 1.05;
  font-weight: 900;
  color: var(--navy);
  margin: 8px 0 0;
  letter-spacing: -0.02em;
}

/* short keyword bullets */
.points { margin-top: 60px; display: flex; flex-direction: column; gap: 44px; }
.point {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 3rem;
  font-weight: 700;
  color: var(--navy);
  line-height: 1.1;
}
.point-ic { color: var(--blue); font-size: 3.4rem; flex-shrink: 0; display: flex; }

/* channels */
.channels { margin-top: 56px; display: flex; flex-direction: column; gap: 14px; }
.ch-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 30px;
  align-items: center;
  padding: 30px 4px;
  border-bottom: 2px solid rgba(0,0,0,0.1);
}
.ch-row.last { border-bottom: none; }
.ch-rank {
  font-family: Georgia, serif;
  font-style: italic;
  font-weight: 700;
  font-size: 4.4rem;
  color: var(--navy);
  line-height: 1;
}
.ch-title { font-weight: 800; font-size: 3rem; color: var(--navy); line-height: 1.05; }
.ch-tag {
  font-size: 1.4rem; text-transform: uppercase; letter-spacing: 0.16em;
  color: var(--gold); margin-top: 8px; font-weight: 800;
}

/* paradox slide */
.skills {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 26px;
}
.skill {
  display: flex; align-items: center; gap: 16px;
  background: var(--teal-soft);
  border-left: 6px solid var(--blue);
  border-radius: 10px;
  padding: 26px 24px;
  font-size: 2rem;
  font-weight: 800;
  color: var(--navy);
  line-height: 1.1;
}
.skill svg { color: var(--blue); font-size: 2.4rem; flex-shrink: 0; }

.footer {
  margin-top: auto;
  display: flex; align-items: center; gap: 12px;
  font-size: 1.5rem; font-weight: 800; color: var(--slate);
  letter-spacing: 0.04em;
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
  justify-content: center;
  text-align: center;
  padding: 70px;
  box-sizing: border-box;
}
.cta-photo-wrap {
  width: 300px; height: 300px;
  border-radius: 9999px; padding: 9px;
  background: linear-gradient(140deg, #6fd0f3, var(--blue));
  box-shadow: 0 24px 50px rgba(0,0,0,0.45);
}
.cta-photo {
  width: 100%; height: 100%;
  border-radius: 9999px; object-fit: cover; object-position: center 18%;
}
.cta .cta-title {
  margin-top: 56px;
  font-size: 5rem; font-weight: 900; letter-spacing: -0.02em; line-height: 1.05;
}
.cta-btn {
  margin-top: 56px;
  display: inline-flex; align-items: center; gap: 18px;
  background: #ff0033;
  color: #fff; font-weight: 800; font-size: 2.6rem;
  padding: 28px 52px; border-radius: 9999px;
  box-shadow: 0 18px 40px rgba(255,0,51,0.35);
}
.cta-btn svg { font-size: 3rem; }
.cta-link {
  margin-top: 28px; font-size: 2rem; letter-spacing: 0.02em; color: #7fd0f0; font-weight: 700;
}
.cta-foot {
  position: absolute;
  bottom: 56px;
  display: flex; align-items: center; gap: 14px;
  font-size: 1.9rem; font-weight: 700; opacity: 0.95;
}
.cta-foot svg { font-size: 2.2rem; color: #7fd0f0; }
</style>

<div class="cover">

<div class="cover-top">
  <span class="jpj-logo"></span>
  <span>JPJ&nbsp;SOLUTIONS</span>
</div>

<h1 class="cover-title">One year as an<br><span class="accent">OR freelancer</span></h1>

<p class="cover-sub">5 honest lessons</p>

<div class="cover-photo-wrap">
  <img src="/assets/peter.png" class="cover-photo" />
</div>

<div class="swipe">Swipe →</div>

</div>

---

<div class="slide">

<div class="topbar">
  <div class="topbar-left"><span class="jpj-logo"></span> YEAR ONE</div>
  <div class="topbar-right">01 / 03</div>
</div>

<div class="body">

<div class="lesson-num">01</div>
<h2 class="lesson-title">They don't buy tech<br>stacks. They buy <span class="accent">trust</span>.</h2>

<div class="points">
  <div class="point"><span class="point-ic"><carbon-checkmark-filled /></span> Industry experience</div>
  <div class="point"><span class="point-ic"><carbon-checkmark-filled /></span> Client testimonials</div>
  <div class="point"><span class="point-ic"><carbon-checkmark-filled /></span> Early recommendations</div>
</div>

</div>

<div class="footer"><span class="jpj-logo"></span> jpjsolutions.com</div>

</div>

---

<div class="slide">

<div class="topbar">
  <div class="topbar-left"><span class="jpj-logo"></span> YEAR ONE</div>
  <div class="topbar-right">02 / 03</div>
</div>

<div class="body">

<div class="lesson-num">02</div>
<h2 class="lesson-title"><span class="accent">Network</span> is your<br>#1 source of work.</h2>

<div class="channels">
  <div class="ch-row">
    <div class="ch-rank">01</div>
    <div>
      <div class="ch-title">Your network</div>
      <div class="ch-tag">Highest signal</div>
    </div>
  </div>
  <div class="ch-row">
    <div class="ch-rank">02</div>
    <div>
      <div class="ch-title">LinkedIn</div>
      <div class="ch-tag">Long-term play</div>
    </div>
  </div>
  <div class="ch-row last">
    <div class="ch-rank">03</div>
    <div>
      <div class="ch-title">Freelancer platforms</div>
      <div class="ch-tag">Low yield</div>
    </div>
  </div>
</div>

</div>

<div class="footer"><span class="jpj-logo"></span> jpjsolutions.com</div>

</div>

---

<div class="slide">

<div class="topbar">
  <div class="topbar-left"><span class="jpj-logo"></span> YEAR ONE</div>
  <div class="topbar-right">03 / 03</div>
</div>

<div class="body">

<div class="lesson-num">03</div>
<h2 class="lesson-title">Most work isn't OR.<br>But OR is the <span class="accent">USP</span>.</h2>

<div class="skills">
  <div class="skill"><carbon-document /> Requirements</div>
  <div class="skill"><carbon-user-multiple /> Change mgmt</div>
  <div class="skill"><carbon-data-check /> Data validation</div>
  <div class="skill"><carbon-scales /> Expectations</div>
  <div class="skill"><carbon-renew /> Feedback loops</div>
  <div class="skill"><carbon-code /> Software &amp; tests</div>
</div>

</div>

<div class="footer"><span class="jpj-logo"></span> jpjsolutions.com</div>

</div>

---

<div class="cta">

<div class="cover-top">
  <span class="jpj-logo"></span>
  <span>JPJ&nbsp;SOLUTIONS</span>
</div>

<div class="cta-photo-wrap">
  <img src="/assets/peter.png" class="cta-photo" />
</div>

<h2 class="cta-title">Want the<br>full story?</h2>

<div class="cta-btn"><carbon-logo-youtube /> Watch the recording</div>
<div class="cta-link">youtube.com/live/ZaFQ8Z3u54o</div>

<div class="cta-foot"><carbon-logo-linkedin /> Let's connect</div>

</div>
