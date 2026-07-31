---
title: Standards tracker and outlook
description: Publication status for the specifications this guide relies on, plus a grounded watchlist without unsupported adoption forecasts.
section: Reference
status: reference
source_path: docs/future/index.md
---

Standards status matters. A Recommendation, Candidate Recommendation, Working Draft, Community Group draft, and Editor's Draft are not interchangeable.

<div class="callout warning">
  <p><strong>Version policy:</strong> production profiles should pin exact specifications. “Use the latest DID standard” is not an interoperable dependency strategy.</p>
</div>

## Status on July 31, 2026

| Work | Publisher | Stage | Date / significance |
|---|---|---|---|
| DID Core 1.0 | W3C | Recommendation | July 19, 2022; stable baseline |
| DID Core 1.1 | W3C | Candidate Recommendation Snapshot | March 5, 2026; newer, not yet a Recommendation |
| DID Resolution v1 | W3C | Working Draft | July 24, 2026; interface and algorithm work remains draft |
| DID Extensions | W3C DID WG | Group Note | December 11, 2025; registry work, not a W3C Recommendation |
| DID Methods | W3C DID WG | Group Note / registry | Discovery list, not endorsement |
| Web DID Method | W3C Credentials Community Group | Community specification draft | Practical method; not a W3C Recommendation |
| VC Data Model 2.0 | W3C | Recommendation | May 15, 2025 |
| VC Data Integrity 1.0 | W3C | Recommendation | May 15, 2025 |
| Securing VCs with JOSE and COSE | W3C | Recommendation | May 15, 2025 |
| OpenID4VCI 1.0 | OpenID Foundation | Final specification | September 2025 |
| OpenID4VP 1.0 | OpenID Foundation | Final specification | July 2025 |
| DIDComm Messaging v2 | Decentralized Identity Foundation | Editor's Draft | Implement against a pinned version and library |
| `did:vld` | This repository | Proposal | Not registered or implemented |

Always confirm the current status on the primary publication before making a procurement or architecture decision.

## What changed from the old research

### DID Core is evolving

DID Core 1.0 remains the Recommendation. DID Core 1.1 is active Candidate Recommendation work. Newer does not automatically mean final.

### Credential standards matured

VC Data Model 2.0 and related securing specifications reached Recommendation status in 2025. Implementers need a complete profile: data model, securing mechanism, status, exchange protocol, schemas/types, and trust policy.

### Exchange protocols are a major center of gravity

Final OpenID4VCI and OpenID4VP specifications make OAuth-based credential exchange a concrete interoperability layer. They can carry multiple credential formats, so credential adoption does not imply universal DID adoption.

### Resolution is becoming more explicit

The W3C DID Resolution work defines common resolution and dereferencing behavior, metadata, errors, and security considerations. It remains a Working Draft as of this review.

## Watchlist

### DID Core 1.1 progression

Track implementation feedback and whether the Candidate Recommendation advances, changes, or returns for more work.

### DID Resolution implementation coverage

Watch test suites, driver behavior, error consistency, caching, version queries, and privacy of lookups.

### Method maintenance

A long registry entry does not mean a healthy ecosystem. Track:

- specification updates;
- active maintainers;
- multiple resolvers;
- security reports;
- test fixtures;
- dependency health;
- migration and deprecation notices.

### Wallet assurance and portability

Hardware-backed keys, platform APIs, backup, multi-device recovery, certification, accessibility, and export remain more important to end users than DID syntax.

### Selective disclosure and status privacy

Credential systems continue to balance minimal disclosure, revocation/status, unlinkability, verifier policy, and operational scale.

### Agent identity

AI-agent use cases will need clearer separation among controller identity, workload/runtime attestation, delegated authority, software provenance, and action audit. A new DID method is not automatically required.

### Post-quantum migration

Method and credential profiles need algorithm migration plans. Do not claim post-quantum safety because a schema has an algorithm enum. Key sizes, signatures, identifier commitments, history, and verifier support all matter.

## Grounded research questions

- Which methods have two independent interoperable implementations?
- Can resolver behavior be consistent across method drivers?
- How can a verifier learn current state without creating a new tracking channel?
- Which recovery designs work for ordinary users under real device loss?
- How can public organizational identifiers coexist with private pairwise relationships?
- What migration evidence is required when an underlying network or cryptosystem changes?
- Which credential profiles remain verifiable over decades?

## Forecasting policy

This guide does not publish unsupported market percentages or dates when DIDs will become a “global standard.” Future claims should be:

- tied to a primary source;
- explicit about publication versus deployment;
- dated;
- measurable;
- revised when the evidence changes.

For the source list, see [Sources and glossary]({{ '/reference/' | relative_url }}).
