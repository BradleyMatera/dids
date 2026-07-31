---
title: did:vld resolver test plan
description: The unit, integration, adversarial, privacy, and interoperability evidence required before claiming that a Veilid-backed DID resolver works.
section: Veilid research track
status: test-plan
source_path: docs/implementations/resolver-unit-tests.md
---

This page defines tests that a future resolver **must pass**. There is no executable resolver test suite in this repository today.

<div class="callout danger">
  <p><strong>Correction:</strong> the earlier page presented imagined JavaScript tests as completed evidence and concluded the method was production-ready. Pseudocode cannot establish that a real Veilid DHT publication, resolution, or signature round trip occurred.</p>
</div>

## Test layers

| Layer | Dependency | Proves |
|---|---|---|
| Parser unit tests | None | Strict syntax and canonical identifier behavior |
| State unit tests | None | Deterministic transition and authorization logic |
| Codec tests | None | Stable bytes, bounds, and version handling |
| Adapter contract tests | Fake + real Veilid adapter | Network error mapping and resource lifecycle |
| Integration tests | Isolated real Veilid nodes | Actual create/read/update/deactivate behavior |
| Interoperability tests | Independent implementation | Specification is not tied to one codebase |
| Adversarial tests | Fault injection | Rejection of malicious, stale, and conflicting state |
| Privacy experiments | Defined observer model | Measured metadata exposure under stated conditions |

## Parser matrix

Accept only canonical identifiers defined by the future grammar.

Reject:

- wrong scheme or method case;
- empty suffix;
- whitespace and control characters;
- forbidden percent-encoding;
- non-canonical base encodings;
- incorrect decoded length;
- unsupported crypto-kind/version;
- trailing path/query/fragment where the API accepts only a DID;
- oversized input;
- visually confusable but byte-distinct forms.

Property-based tests should generate valid and invalid strings and prove parse/serialize round trips.

## Create tests

### Success

- Generates valid controller material.
- Creates the intended DHT record schema.
- Publishes canonical version-zero state.
- Reads the state through a second client.
- Resolves an identical DID document.
- Returns recovery material only to the creator.

### Failure

- Network unavailable before record creation.
- Write rejected or times out.
- Read-back differs from published bytes.
- Identifier does not bind to record.
- Initial document contains unsupported key types.
- Partial create is cleaned up or reported for recovery.
- Duplicate create cannot replace existing authorized state.

## Resolution tests

### Success

- Resolves current state.
- Returns DID Resolution and document metadata.
- Uses cache within the specified freshness window.
- Fetches fresh state after invalidation.
- Supports the required representation.

### Failure

- Invalid DID returns `invalidDid` without network access.
- Missing record returns `notFound`.
- Network outage is distinguishable from not found.
- Oversized state is rejected before full decode.
- Document `id` mismatch is rejected.
- Invalid signature is rejected.
- Unknown mandatory version is rejected.
- Stale/rollback state is rejected when newer state is known.
- Deactivated state returns no active DID document.

## Update tests

- Current controller may perform an allowed update.
- A key listed only in the candidate new state cannot self-authorize.
- A key not in the current authorization relationship fails.
- Modified signed bytes fail.
- Wrong previous-state hash fails.
- Replayed sequence fails.
- Skipped or duplicate sequence follows the specified rule.
- Two concurrent updates produce a deterministic result or explicit conflict.
- Update read-back matches resolved state.
- Removed keys no longer authorize later changes.

## Rotation tests

- Add-new, overlap, and remove-old sequence succeeds.
- New key is not trusted before the authorized transition.
- Old key stops working at the specified state.
- Compromise rotation follows a distinct emergency policy if defined.
- Cached pre-rotation state expires within the documented maximum.
- Rotation does not change the DID if stability is promised.
- Unsupported algorithm migration fails safely.

## Recovery tests

For every recovery mode:

- threshold and participant set are explicit;
- insufficient approvals fail;
- duplicated approval does not count twice;
- approvals bind to DID, version, new controller, and expiry;
- replay after recovery fails;
- old controller behavior after recovery is specified;
- lost recovery devices have a replacement path;
- malicious recovery and controller races are deterministic.

## Deactivation tests

- Authorized deactivation succeeds.
- Unauthorized deactivation fails.
- Older active state never reactivates the DID.
- Updates after deactivation fail.
- Resolvers agree on deactivated metadata.
- Deactivation remains discoverable after restart and cache loss.
- Retention behavior is tested for the period the method promises.

## Malicious state corpus

Maintain fixtures for:

- duplicate JSON keys or ambiguous binary fields;
- deeply nested or decompression-bomb inputs;
- invalid UTF-8;
- unknown context/verification type;
- repeated verification method IDs;
- relationship reference to a missing method;
- controller mismatch;
- signature malleability cases relevant to the suite;
- cross-protocol signature reuse;
- invalid service endpoint types;
- state with valid signature but invalid transition;
- forked histories and rollback attempts.

## Real Veilid integration environment

Mocks are useful for deterministic errors but cannot prove network behavior. CI needs an isolated environment that:

1. starts the pinned Veilid version;
2. waits for explicit healthy attachment;
3. launches at least two independent clients;
4. creates and publishes from one;
5. resolves from another;
6. injects disconnects, restarts, delays, and competing writes;
7. saves non-sensitive logs and version metadata;
8. tears down deterministically.

Tests must say whether they use public Veilid infrastructure, a local network, or a mocked adapter.

## Privacy experiment requirements

Do not publish a percentage without:

- the adversary's observation capabilities;
- network topology and sample size;
- identifier and endpoint reuse assumptions;
- timing distributions;
- background traffic;
- algorithm and parameters;
- random seeds or repeated trials;
- confidence intervals;
- code and raw/derived data;
- limitations.

A result from synthetic identifiers in one process does not measure network deanonymization.

## CI release gates

A release candidate should require:

- compile and formatting;
- unit and property tests;
- integration tests against a pinned Veilid version;
- dependency and secret scanning;
- fixture compatibility;
- test coverage with meaningful branch review;
- generated API documentation;
- artifact checksums and provenance;
- manual security approval for method-semantic changes.

## Evidence format

For every published claim, link to:

- exact commit;
- workflow run;
- environment and dependency versions;
- test name;
- artifact or log;
- expected and actual result;
- known exclusions.

That is how this page can eventually become a test report rather than a test plan.
