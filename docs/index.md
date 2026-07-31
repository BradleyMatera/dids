---
title: Decentralized identifiers, without the fog
description: Learn what DIDs actually standardize, compare method tradeoffs, and inspect an experimental Veilid design without confusing research with shipped software.
hide_header: true
status: explainer
source_path: docs/index.md
---

<section class="hero">
  <p class="hero-kicker">Rebuilt and fact-checked · July 2026</p>
  <h1>Understand DIDs.<br><em>Then decide.</em></h1>
  <p class="hero-copy">A practical field guide to the standards, trust models, security failures, implementation choices, and the open questions behind a possible Veilid-backed DID method.</p>
  <div class="hero-actions">
    <a class="button primary" href="{{ '/overview/' | relative_url }}">Start with the 10-minute overview</a>
    <a class="button" href="{{ '/methods/' | relative_url }}">Compare methods</a>
    <a class="button" href="{{ '/status/' | relative_url }}">See what is real</a>
  </div>
</section>

<section class="home-section">
  <div class="home-section-head">
    <h2>Choose your path</h2>
    <p>You do not need to read the repository front to back. Start with the decision you are trying to make.</p>
  </div>

  <div class="card-grid">
    <a class="card" href="{{ '/overview/' | relative_url }}">
      <span class="card-label">I am new to DIDs</span>
      <strong>Build the right mental model</strong>
      <p>Separate identifiers, DID documents, credentials, wallets, and trust.</p>
      <span class="card-link">Read the overview →</span>
    </a>
    <a class="card" href="{{ '/methods/' | relative_url }}">
      <span class="card-label">I need to choose a method</span>
      <strong>Compare the actual tradeoffs</strong>
      <p>Evaluate governance, lifecycle, privacy, availability, and operational cost.</p>
      <span class="card-link">Open the comparison →</span>
    </a>
    <a class="card" href="{{ '/security/' | relative_url }}">
      <span class="card-label">I am reviewing a design</span>
      <strong>Threat-model before you build</strong>
      <p>Check key compromise, correlation, resolver behavior, recovery, and metadata.</p>
      <span class="card-link">Review security →</span>
    </a>
    <a class="card" href="{{ '/methods/did-vld/' | relative_url }}">
      <span class="card-label">I came for Veilid</span>
      <strong>Inspect the proposal honestly</strong>
      <p>See what the design proposes, what remains unresolved, and what has not been built.</p>
      <span class="card-link">Open did:vld →</span>
    </a>
  </div>
</section>

<section class="home-section">
  <div class="home-section-head">
    <h2>The central distinction</h2>
    <p>Most bad explanations blur the standard, the method, and the application into one magical “decentralized identity” product.</p>
  </div>

  <div class="truth-panel">
    <div>
      <h3>What DID Core gives you</h3>
      <ul class="truth-list">
        <li>A URI syntax such as <code>did:web:example.com</code></li>
        <li>A common data model for DID documents</li>
        <li>Verification relationships and service references</li>
        <li>Requirements that each DID method must define</li>
      </ul>
    </div>
    <div>
      <h3>What it does not give you automatically</h3>
      <ul class="truth-list">
        <li>A verified human identity or a government-backed name</li>
        <li>A trustworthy issuer, wallet, resolver, or application</li>
        <li>Privacy, anonymity, recovery, or resistance to correlation</li>
        <li>A blockchain, universal resolver, or one required trust model</li>
      </ul>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="home-section-head">
    <h2>Research status at a glance</h2>
    <p>The site now labels evidence and maturity instead of making every page sound equally complete.</p>
  </div>

  <div class="metric-row">
    <div class="metric">
      <strong>W3C Rec</strong>
      <span>DID Core 1.0 is the stable normative baseline</span>
    </div>
    <div class="metric">
      <strong>CR 1.1</strong>
      <span>DID Core 1.1 is newer, but still a Candidate Recommendation</span>
    </div>
    <div class="metric">
      <strong>Proposal</strong>
      <span>did:vld is documented research, not an implemented method</span>
    </div>
  </div>

  <div class="callout warning">
    <p><strong>Important:</strong> this repository does not contain a Veilid resolver, publishable package, Cap’n Proto schema file, executable test suite, deployment, or measured privacy experiment. Pages describing those areas are now design notes and acceptance plans.</p>
  </div>
</section>

<section class="home-section">
  <div class="home-section-head">
    <h2>A clean route through the guide</h2>
    <p>For a full technical read, use this sequence. Each step answers a different kind of question.</p>
  </div>

  <ol class="steps">
    <li><strong>Learn the model.</strong> Understand DID subjects, controllers, documents, methods, resolution, credentials, and wallets.</li>
    <li><strong>Choose the trust model.</strong> Compare methods based on who can change state, how resolution works, and which systems you must trust.</li>
    <li><strong>Define the threat model.</strong> Decide how keys are protected, rotated, recovered, revoked, and kept from becoming correlation handles.</li>
    <li><strong>Build a thin vertical slice.</strong> Create, resolve, update, deactivate, and verify one end-to-end flow before adding application features.</li>
    <li><strong>Prove interoperability.</strong> Test normative behaviors and failure cases against independent implementations and published test suites.</li>
  </ol>
</section>
