---
title: Correlation threat model
description: A linkability analysis for public, pairwise, and Veilid-backed DIDs that replaces unsupported percentages with explicit observers, signals, and measurement requirements.
section: Veilid research track
status: analysis
source_path: docs/security/correlation-threat-model.md
---

Correlation is the ability to infer that two interactions involve the same subject or controller. Changing the DID string can reduce one direct signal while leaving many others intact.

<div class="callout danger">
  <p><strong>There are no validated “less than 1%” results.</strong> The previous document reported precise correlation rates without a reproducible simulation, dataset, observer model, or source code. Those numbers have been removed.</p>
</div>

## Privacy goal

A useful goal is:

> An observer of one relationship should not be able to link it to another relationship with meaningfully greater confidence than the stated baseline, except with information intentionally disclosed by the subject.

That goal needs a defined observer and baseline before it can be tested.

## Adversaries

### Counterparty

One service sees the DID, keys, credentials, timing, device/application metadata, and network information exposed during its own interactions.

### Colluding counterparties

Two or more services compare identifiers, keys, credential claims, endpoints, timing, device fingerprints, and behavioral patterns.

### Registry or DHT observer

An observer sees some combination of record identifiers, lookups, writes, timing, size, routing, and participating nodes, depending on the network threat model.

### Global passive observer

An unusually powerful observer can monitor broad network timing and traffic patterns. A design should state whether this adversary is in or out of scope rather than implying universal anonymity.

### Compromised wallet or application

The client itself can directly map every identifier, credential, key, and contact. Pairwise DIDs cannot protect against a fully compromised endpoint.

## Correlation signals

| Signal | Why it links | Possible reduction |
|---|---|---|
| Same DID | Exact stable identifier | Relationship-specific DIDs |
| Same verification key | Cryptographic fingerprint | Unique keys per relationship |
| Same service endpoint | Shared infrastructure marker | Omit, rotate, or use relationship-specific routing |
| Same credential subject ID | Stable claim inside presentations | Pairwise subject identifiers or omit when unnecessary |
| Same credential serial/status index | Issuance metadata | Privacy-preserving status and presentation design |
| Unique claim combination | Quasi-identifiers | Data minimization and selective disclosure |
| Update timing | Related identifiers change together | Avoid synchronized maintenance where feasible |
| Lookup timing | Same client resolves related records | Private routing, caching, batching, or proxy strategies |
| IP/device fingerprint | Endpoint metadata | Platform/network privacy controls |
| Behavior and language | Repeated human pattern | Mostly outside DID-layer control |

## Single versus pairwise DIDs

### One public DID

All uses are directly linkable. This may be correct for a public organization, product, or service where discoverability is intentional.

### Pairwise DIDs with unique keys

Direct string and key equality are removed. This is better for private relationships, but correlation can continue through endpoints, credentials, timing, network data, or wallet telemetry.

### Pairwise DIDs with reused keys

Different DID strings provide weak privacy because the same public key becomes the stable link.

### Pairwise DIDs with a public parent

If each pairwise DID publishes a relationship to one public controller, the parent restores linkability. Recovery and delegation designs need the same privacy review as active keys.

## did:vld-specific questions

The Veilid proposal must test:

- whether DHT record keys are visible to routing participants;
- whether repeated reads or writes are linkable to one node;
- how private routing changes the observer model;
- whether default record encryption hides content only or also access patterns;
- whether a key-derived DID links to other uses of a Veilid public key;
- whether update authorization reveals a common recovery controller;
- how long records and routing metadata persist;
- whether pairwise records have distinguishable size or timing.

These are questions for current Veilid documentation and experiments, not assumptions derived from the word “private.”

## Minimum-disclosure design

1. Use a distinct DID and key material for each relationship when linkability is not required.
2. Keep personal claims out of DID documents.
3. Avoid globally reusable service endpoints.
4. Do not place a universal subject ID inside every credential.
5. Ask only for claims required by the transaction.
6. Separate issuer trust from holder identity.
7. Minimize resolver, application, crash, and analytics logs.
8. Review push notifications, cloud backups, and device sync.
9. Give users a clear explanation when an action creates a stable public identifier.

## Reproducible experiment design

A valid experiment needs:

### Hypothesis

Example: “Under a local DHT observer that sees record operations but not endpoint IPs, relationship-specific records with randomized update schedules reduce classifier precision compared with a reused record.”

### Dataset

Document:

- number of simulated users and relationships;
- interaction and update schedule;
- network topology;
- background traffic;
- identifier/key/endpoint reuse;
- missing and noisy observations.

### Baselines

Compare:

- random guessing;
- majority-class guessing;
- same-DID matching;
- same-key matching;
- timing-only classifier;
- combined signals.

### Metrics

Report precision, recall, false-positive rate, ROC/PR curves where appropriate, confidence intervals, and results across repeated seeds. Do not publish one success percentage without class balance.

### Reproducibility

Publish code, configuration, seeds, dependency versions, raw or safely shareable derived data, and exact commands. State which real Veilid behaviors were measured and which were simulated.

## Privacy acceptance criteria

The proposal should not claim “strong privacy” until:

- the observer model is explicit;
- direct identifier and key reuse are eliminated in pairwise mode;
- endpoint and credential linkability are tested;
- network metadata is measured on a pinned Veilid version;
- logs and client telemetry are included;
- residual risks are explained in user-facing language;
- results are independently repeatable.

## Practical conclusion

Pairwise DIDs are a useful structural control against direct identifier reuse. They are not a quantitative privacy guarantee. The correct claim today is that `did:vld` **could be designed to support relationship-specific identifiers**, while its end-to-end correlation resistance remains unmeasured.
