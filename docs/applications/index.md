---
title: Application patterns
description: Evaluate where DIDs add portable control or cross-domain verification and where ordinary accounts, certificates, OAuth, or device registries are simpler.
section: Make decisions
status: comparison
source_path: docs/applications/index.md
---

A DID is an infrastructure choice, not a user benefit by itself. Start with the interaction that must cross trust domains and ask whether a portable, method-controlled identifier materially improves it.

## Use-case filter

| Question | If yes | If no |
|---|---|---|
| Must the identifier work across organizations? | A DID may reduce dependence on one account provider | Keep an internal identifier |
| Must control be proven cryptographically? | Evaluate a DID, certificate, workload identity, or signed-key system | Normal authenticated accounts may suffice |
| Must verification work without contacting the issuer each time? | Evaluate verifiable credentials and status design | OAuth/OIDC assertions may be simpler |
| Must relationships avoid a public correlation handle? | Evaluate pairwise identifiers and disclosure design | A public organizational DID may fit |
| Must keys rotate under the same identifier? | Choose a method with update/recovery | Static key-derived methods may fit |
| Can you operate resolution and recovery safely? | Continue to method evaluation | Do not shift unsolved operations to users |

## Patterns in this guide

<div class="card-grid">
  <a class="card" href="{{ '/applications/ai/' | relative_url }}">
    <span class="card-label">Software identity</span>
    <strong>AI agents</strong>
    <p>Bind agent instances and delegated authority without claiming that a DID proves model behavior.</p>
    <span class="card-link">Evaluate AI patterns →</span>
  </a>
  <a class="card" href="{{ '/applications/education/' | relative_url }}">
    <span class="card-label">Portable claims</span>
    <strong>Education</strong>
    <p>Issue and verify credentials while keeping institutional trust and student privacy visible.</p>
    <span class="card-link">Evaluate education →</span>
  </a>
  <a class="card" href="{{ '/applications/iot/' | relative_url }}">
    <span class="card-label">Device lifecycle</span>
    <strong>IoT</strong>
    <p>Identify devices across owners and services, from manufacturing through retirement.</p>
    <span class="card-link">Evaluate IoT →</span>
  </a>
  <a class="card" href="{{ '/applications/secure-messaging/' | relative_url }}">
    <span class="card-label">Private relationships</span>
    <strong>Secure messaging</strong>
    <p>Separate DIDComm message security, routing, identity, and metadata exposure.</p>
    <span class="card-link">Evaluate messaging →</span>
  </a>
</div>

## Common architecture

Most useful credential or communication systems have:

1. an issuer or controller with keys;
2. a subject, holder, device, or agent;
3. a verifier or counterparty;
4. a trust policy;
5. identifier and key lifecycle;
6. a protocol for exchange;
7. status, expiry, and recovery behavior;
8. privacy and audit controls.

The DID can address part of item 5. It does not replace the other seven.

## Anti-patterns

### Put personal data in the DID document

DID documents may be public, replicated, cached, and difficult to erase. Keep claims in credentials or application storage and disclose only what the transaction requires.

### Treat every verifier the same

Different services need different claims, assurance levels, issuers, and privacy policies. Build policy around the transaction, not the existence of a signature.

### Use one DID everywhere

A universal identifier simplifies account linking for both the user and observers. Use a public DID only when public correlation is intentional.

### Invent a method for the application

Use an implemented method unless method research is the goal. A custom method creates parser, resolution, lifecycle, governance, interoperability, and security obligations.

### Confuse a demo with deployment

A QR code, signed JSON object, or DID document lookup can demonstrate a concept. Deployment also needs key custody, recovery, status, privacy, accessibility, support, monitoring, and migration.

## Application decision record

Record:

- user or operator outcome;
- why portability or cross-domain verification matters;
- identifiers visible to each party;
- selected method and alternatives;
- credential or messaging protocol;
- trust-policy owner;
- key and recovery owner;
- outage behavior;
- data retention and correlation risk;
- accessibility and non-digital fallback;
- exit and migration plan.

Then evaluate the choice against the [method comparison]({{ '/methods/' | relative_url }}) and [security review]({{ '/security/' | relative_url }}).
