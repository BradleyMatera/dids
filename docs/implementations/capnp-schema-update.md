---
title: State schema design notes
description: Requirements for a versioned did:vld state envelope and a Cap’n Proto candidate, explicitly separated from a compiled or interoperable schema.
section: Veilid research track
status: design
source_path: docs/implementations/capnp-schema-update.md
---

Cap’n Proto could provide a compact binary representation for `did:vld` state, but selecting a serializer does not solve authorization, canonical signing, upgrade, or compatibility.

<div class="callout warning">
  <p><strong>No <code>.capnp</code> schema is shipped in this repository.</strong> The earlier page described an “updated” release candidate that did not exist as a compiled artifact. This page now records design requirements only.</p>
</div>

## Decide semantics before fields

The state model needs:

- a stable DID and record binding;
- schema and method versions;
- create, update, and deactivate operations;
- monotonic ordering;
- previous-state commitment;
- canonical document bytes or a canonical document model;
- authorization method and signature;
- algorithm identifiers;
- bounded extension points;
- deterministic handling of unknown fields and versions.

## Candidate envelope

```capnp
@0xd1d5d1d5d1d5d1d5;

struct DidVldState {
  methodVersion @0 :UInt16;
  sequence @1 :UInt64;
  did @2 :Text;
  previousStateHash @3 :Data;
  operation @4 :Operation;
  document @5 :Data;
  authorization @6 :Authorization;
}

enum Operation {
  create @0;
  update @1;
  deactivate @2;
}

struct Authorization {
  verificationMethod @0 :Text;
  algorithm @1 :Text;
  signature @2 :Data;
}
```

This sketch is intentionally incomplete and has not been compiled. It does not choose:

- the Cap’n Proto file ID governance process;
- canonical packed versus unpacked encoding;
- hash and signature suites;
- document representation;
- timestamp semantics;
- recovery and multi-signature structures;
- extension compatibility rules;
- maximum field sizes.

## Signing model

The signed bytes must include every security-relevant field. A safe high-level construction is:

```text
signatureInput =
  domainSeparator
  || methodVersion
  || canonicalUnsignedStateBytes
```

The `authorization.signature` field itself must be excluded from the unsigned bytes in exactly one specified way. Test vectors should show the byte sequence, digest, public key, signature, and expected verification result.

Avoid a generic `proof` field whose meaning changes by convention. Name and version the authorization structure the transition validator actually enforces.

## Versioning rules

Define three distinct versions:

1. **Method version** changes identifier or state semantics.
2. **Schema version** changes binary layout.
3. **Cryptosystem identifier** selects key/signature behavior.

Do not overload one string such as `1.0-rc1`.

A resolver should fail with `representationNotSupported` or a method-defined invalid-state error when it cannot safely process a version. It should not guess.

## Evolution policy

Before adding fields, state:

- whether unknown fields are preserved or dropped;
- whether they are covered by signatures;
- whether old writers can overwrite state created by newer writers;
- how a mandatory semantic change is announced;
- how test fixtures cover mixed versions;
- when a new method version requires a new DID.

## Size and denial-of-service limits

Set explicit limits for:

- total envelope bytes;
- DID and verification method string lengths;
- document bytes;
- number of keys and services;
- extension count and depth;
- signature count;
- history or checkpoint data.

Enforce the outer size before allocating or decoding the full structure.

## Required artifacts before calling this a schema

- `did_vld.capnp` checked into source control;
- formatter/linter rules;
- generated bindings for at least one implementation language;
- compile step in CI;
- positive and negative fixtures;
- byte-for-byte canonical test vectors;
- compatibility tests across two schema versions;
- limits and threat analysis;
- independent decoder or implementation.

Until those artifacts exist, this remains a design note.
