---
title: did:vld method proposal
description: An experimental design for evaluating Veilid as the state and resolution layer for a DID method, with unresolved choices and implementation gates stated plainly.
section: Veilid research track
status: proposal
source_path: docs/methods/did-vld.md
---

`did:vld` is a **research proposal** for a DID method whose state could be published and resolved through Veilid. It is not registered in the W3C DID Methods list, is not an official Veilid specification, and has no working resolver in this repository.

<div class="callout danger">
  <p><strong>Do not use this proposal in production.</strong> The identifier encoding, state authorization, update ordering, deactivation, privacy behavior, resolver interface, and interoperability profile are not final or implemented.</p>
</div>

## Research question

Can a DID method use Veilid's distributed application framework and DHT to provide:

- globally unique identifiers;
- cryptographically authorized state;
- deterministic resolution;
- safe updates and deactivation;
- acceptable availability;
- less dependence on domains or public blockchains;
- privacy properties that are measured instead of assumed?

The answer is currently **unknown**. Veilid provides useful networking, routing, cryptography, and DHT primitives, but those primitives do not automatically create a correct DID method.

## Current status

| Area | Status | Main gap |
|---|---|---|
| Method name | Working label | `vld` is not registered or reserved |
| Syntax | Sketch | Encoding and crypto-version agility unresolved |
| DID document model | Example only | No method-specific validation profile |
| Create | Design outline | No implemented publication flow |
| Read / resolve | Design outline | No resolver or DID Resolution result handling |
| Update | Incomplete | Authorization, ordering, concurrency, and rollback rules |
| Deactivate | Incomplete | Durable tombstone and retention behavior |
| Recovery | Options analyzed | No selected or tested policy |
| Privacy | Threat analysis | No reproducible measurements |
| Interoperability | None | No second implementation or fixtures |

## Normative baseline

Any credible method specification has to satisfy the method requirements in [DID Core 1.0](https://www.w3.org/TR/did-core/#methods). Among other things, it must define:

1. method syntax and globally unique method-specific identifiers;
2. how a controller creates a DID and initial DID document;
3. how a resolver retrieves and authenticates current state;
4. what constitutes an update and who can authorize it;
5. how deactivation works, or an explicit statement that it is impossible;
6. method-specific security and privacy considerations.

The proposal should use DID Core 1.0 as the stable baseline while tracking [DID Core 1.1](https://www.w3.org/TR/did-1.1/) as Candidate Recommendation work.

## Proposed identifier shape

The working shape is:

```text
did:vld:<method-specific-id>
```

Earlier versions of this repository fixed the identifier to a base58btc-encoded 32-byte BLAKE3 hash of a Veilid public key. That is now treated as **one design option**, not a settled specification.

Before choosing an encoding, the design must answer:

- Does the identifier encode a Veilid typed key, a hash of one, or a random stable record identifier?
- How is the Veilid cryptosystem kind/version preserved?
- Can controller keys rotate without changing the DID?
- Does the identifier itself enable correlation to other Veilid activity?
- How are malformed, non-canonical, or unsupported encodings rejected?
- Is the resulting DHT lookup key identical to the DID suffix or derived with domain separation?

<div class="callout warning">
  <p><strong>Key-derived identifiers and key rotation pull in opposite directions.</strong> If the DID suffix commits directly to the active controller key, changing the key may also change the DID. A stable record identifier with separately authorized controller keys may better support lifecycle operations, but requires a strong initial binding.</p>
</div>

## Proposed state envelope

Publishing a bare DID document to a mutable DHT record is insufficient. Resolution needs an authenticated, versioned envelope.

```json
{
  "method": "vld",
  "specVersion": "0.1-draft",
  "did": "did:vld:zExampleOnly",
  "sequence": 7,
  "previousStateHash": "uExamplePreviousHash",
  "updated": "2026-07-31T00:00:00Z",
  "operation": "update",
  "document": {
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": "did:vld:zExampleOnly",
    "verificationMethod": []
  },
  "authorization": {
    "method": "did:vld:zExampleOnly#controller",
    "signature": "uExampleSignature"
  }
}
```

Every value above is illustrative. The serialization, canonicalization, hash suite, signature suite, timestamps, and key representation are undecided.

### Required invariants

A resolver should reject state when:

- the embedded DID differs from the requested DID;
- the record key is not correctly derived or bound;
- the serialization or schema version is unsupported;
- the authorization proof is invalid for the previous accepted state;
- the sequence is stale, skips forbidden transitions, or conflicts without a deterministic rule;
- `previousStateHash` does not match;
- the DID document violates the selected DID representation;
- an update attempts to reactivate a deactivated DID;
- size, nesting, key count, or endpoint limits are exceeded.

## Operations

### Create

A candidate create flow:

1. Generate a random stable record identifier or a method-defined initial key commitment.
2. Create controller key material using a supported, pinned Veilid cryptosystem.
3. Build a minimal DID document and version-zero state envelope.
4. Bind the envelope to the record identifier and sign the complete canonical state.
5. Publish through a Veilid routing context to the chosen DHT schema.
6. Read the state back through a separate client and verify it before returning success.

The DHT schema and writer model must be documented. “Store it in the DHT” is not a complete create operation.

### Read / resolve

A resolver must:

1. parse the DID using strict method syntax;
2. derive or extract the record lookup key;
3. fetch the candidate state with bounded time, size, and retry behavior;
4. validate the record binding and authorization chain;
5. select the current state deterministically;
6. return a DID Resolution result with document and metadata;
7. distinguish invalid DID, unsupported version, not found, invalid state, and deactivated errors.

It must not return an unverified DHT value as a DID document.

### Update

An update needs authorization from the **previous accepted state**, not merely a signature by a key listed inside the new state. Otherwise an attacker can publish a self-authorized replacement.

The method must define:

- allowed state transitions;
- multi-controller thresholds, if any;
- optimistic concurrency or conflict handling;
- maximum history and checkpoint behavior;
- stale-write and replay rejection;
- how resolver caches learn about newer state;
- behavior during network partitions.

### Deactivate

Deactivation should produce a cryptographically authorized terminal state. A resolver must continue to recognize the DID as deactivated even if older active state remains available.

Open questions include how long the tombstone remains retrievable, whether Veilid DHT retention can support the promise, and what an application should do if no record is available.

## DID document profile

The method should use existing, specified verification method types instead of inventing names that have no vocabulary or implementation.

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:vld:zExampleOnly",
  "verificationMethod": [{
    "id": "did:vld:zExampleOnly#controller",
    "type": "Multikey",
    "controller": "did:vld:zExampleOnly",
    "publicKeyMultibase": "zExampleOnly"
  }],
  "authentication": ["did:vld:zExampleOnly#controller"],
  "assertionMethod": ["did:vld:zExampleOnly#controller"]
}
```

This example is not resolvable and contains placeholder key material. A future profile must pin the applicable Controlled Identifiers and cryptosuite specifications and include test vectors.

## Trust model

`did:vld` would not eliminate trust. It would redistribute it across:

- the method specification and its governance;
- Veilid protocol and implementation behavior;
- DHT availability, routing, retention, and conflict behavior;
- the selected cryptographic suites and serialization;
- resolver implementations;
- controller devices and recovery parties;
- applications that decide which verification relationships and credentials to trust.

The method needs an explicit dependency and upgrade policy. A Veilid API or cryptosystem change cannot silently change identifier meaning.

## Privacy model

Veilid is designed as a privacy-oriented peer-to-peer framework, but the method must evaluate its own metadata:

- repeated resolution of one stable record;
- DHT record ownership and write patterns;
- update timing and frequency;
- service endpoints reused across DIDs;
- verification keys reused elsewhere;
- credentials containing stable subject identifiers;
- network observers outside the assumptions of Veilid's routing model;
- application telemetry and wallet backups.

Pairwise DIDs may reduce identifier reuse across relationships. They do not, by themselves, prove anonymity or a numeric reduction in correlation risk.

## Minimum prototype

The first credible milestone is intentionally narrow:

1. Pin one Veilid release and one supported cryptosystem.
2. Specify a canonical binary or JSON encoding and publish test vectors.
3. Create one DID and read it from a second process.
4. Perform an authorized update and reject an unauthorized one.
5. Rotate the controller key without changing the DID, if the design promises that.
6. Deactivate the DID and reject replay of prior active state.
7. Return structured DID Resolution results and errors.
8. Run the same suite in CI against an isolated real network.

Application demos, AI-agent features, credentials, and DIDComm should wait until these lifecycle properties work.

## Open design decisions

- Stable random ID, key-derived ID, or DHT-record-derived ID?
- JSON, deterministic CBOR, Cap’n Proto, or another canonical state format?
- Single writer, controller thresholds, or delegated update capabilities?
- Full event log, signed snapshots, or checkpoints plus retained history?
- How are forks and concurrent valid writes resolved?
- Can the network support durable deactivation semantics?
- Which DID document representation and cryptosuites are mandatory?
- What is the migration path across Veilid cryptosystem versions?
- What privacy goal is testable under a stated adversary model?
- Who governs the method name and specification?

## Next documents

- [Veilid architecture review]({{ '/implementations/veilid-did-implementation/' | relative_url }})
- [Schema design notes]({{ '/implementations/capnp-schema-update/' | relative_url }})
- [Resolver test plan]({{ '/implementations/resolver-unit-tests/' | relative_url }})
- [Correlation threat model]({{ '/security/correlation-threat-model/' | relative_url }})
- [Rotation and recovery]({{ '/security/key-rotation-recovery/' | relative_url }})
