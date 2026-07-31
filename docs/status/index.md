---
title: Project status
description: A direct inventory of what this repository contains, what it proposes, and what must not be represented as implemented.
section: Research integrity
status: reference
source_path: docs/status/index.md
---

This repository is a **research and design publication**. It explains established standards and explores a possible `did:vld` method backed by Veilid. It is not currently a software implementation.

<div class="callout warning">
  <p><strong>Bottom line:</strong> the previous site overstated completion. Documentation and conceptual code existed; a working resolver, executable tests, measured simulations, registered method, and production validation did not.</p>
</div>

## Evidence labels used across the site

| Label | Meaning | What a reader may safely infer |
|---|---|---|
| **Standard** | A final specification from a named standards body | The linked document reached that body's stated final stage |
| **Draft** | Active standards work that may still change | Useful for evaluation; pin versions before implementation |
| **Explainer** | A synthesis of primary sources | Educational, not itself normative |
| **Analysis** | A reasoned security or design assessment | Claims depend on stated assumptions |
| **Proposal** | A design that has not met implementation gates | Suitable for review and prototyping only |
| **Design** | A data model, interface, or architecture sketch | Not a released API or interoperable format |
| **Test plan** | Acceptance criteria and proposed tests | Does not mean the tests exist or pass |

## Repository inventory

| Artifact | Current reality | Evidence required to advance |
|---|---|---|
| Standards guide | Present | Scheduled source review and correction history |
| `did:vld` method text | Present as a proposal | Independent review against every DID method requirement |
| Veilid architecture | Present as design analysis | A pinned Veilid version and running prototype |
| Resolver | **Not present** | Source package, build instructions, release, and conformance results |
| DHT publication flow | **Not implemented here** | End-to-end create, read, update, and deactivate proof |
| Cap’n Proto schema | Design notes only | A versioned `.capnp` file compiled in CI |
| Unit/integration tests | Test plan only | Executable tests in the repository and CI results |
| Correlation simulation | **No reproducible experiment** | Dataset/model, code, assumptions, results, and peer review |
| W3C method listing | `did:vld` not listed as of July 31, 2026 | Public method specification and accepted registry contribution |
| Veilid Foundation endorsement | None claimed or evidenced | Explicit upstream review or adoption |
| Production readiness | No | Security review, interoperability, operations, monitoring, and incident plan |

## Corrections made in this overhaul

### Removed or reframed

- Claims that resolver unit tests had been written and successfully demonstrated production readiness.
- Unsubstantiated percentages claiming pairwise DIDs reduced correlation success below one percent.
- Invented context and verification method identifiers such as `https://w3id.org/veilid/v1`, `VeilidVerificationKey2023`, and `VeilidSignature2023`.
- Language calling the repository a complete implementation or a production-ready Veilid layer.
- A task-completion page that treated documentation as proof that engineering requirements had been completed.
- The false access notice suggesting parts of a public GitHub repository required academic credentials or an invitation.

### Preserved with clearer boundaries

- The idea of evaluating a Veilid DHT as a verifiable data registry.
- The need for a method-specific identifier, authorization model, versioned state, and resolver.
- Pairwise identifier strategies as one possible privacy control.
- Rotation, recovery, schema, and test concepts as design work that still needs implementation.

## Definition of done for `did:vld`

The proposal should not be called an implementation until all of the following are true:

1. A method specification defines syntax, create, read, update, deactivate, authorization, security, and privacy behavior.
2. The design pins supported Veilid and cryptographic versions instead of assuming generic functions.
3. A resolver returns DID Resolution results and explicit errors for invalid, unsupported, not-found, and deactivated identifiers.
4. Updates reject unauthorized writers, stale versions, replayed states, rollback attempts, and malformed documents.
5. A deactivation mechanism cannot be silently reversed by republishing older state.
6. Tests run against a real local or isolated Veilid network, not only mocks.
7. At least one independent implementation can resolve the same fixtures.
8. Privacy claims come from a documented threat model and reproducible measurements.
9. CI builds, tests, lints, scans dependencies, and publishes artifacts.
10. A security review and operational runbook exist.

## How to report a problem

Open a [GitHub issue](https://github.com/BradleyMatera/dids/issues/new) with the page, exact claim, primary source, and proposed correction. A source update is more useful than a general disagreement.
