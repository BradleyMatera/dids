---
title: Veilid architecture for did:vld
description: A component and data-flow review for evaluating Veilid as a DID state layer, including the guarantees the method must add itself.
section: Veilid research track
status: design
source_path: docs/implementations/veilid-did-implementation.md
---

Veilid is an open-source peer-to-peer application framework with routed operations and distributed storage. That makes it an interesting substrate for a DID method, but Veilid is not itself a DID registry or resolver.

<div class="callout warning">
  <p><strong>Architecture review, not implementation guide:</strong> this repository does not contain the code described below. API details must be pinned to a specific Veilid release before a prototype is written.</p>
</div>

## System boundaries

The proposed system has five layers:

| Layer | Responsibility |
|---|---|
| Application | Authentication, messaging, credentials, user consent, business policy |
| DID API | Parse identifiers, expose create/resolve/update/deactivate, return typed results |
| Method engine | Validate `did:vld` syntax, state transitions, authorization, and metadata |
| Veilid adapter | Start/attach node, create/open records, get/set values, surface network errors |
| Veilid network | Route operations and provide distributed record behavior |

The method engine is the critical missing layer. It converts generic DHT behavior into deterministic DID lifecycle semantics.

## Components

### Parser and identifier codec

Responsibilities:

- strict DID syntax;
- canonical method-specific encoding;
- crypto-kind/version preservation;
- conversion to or validation against the DHT lookup key;
- length and character limits;
- safe rejection before network access.

The codec must publish test vectors. Equivalent identifiers cannot resolve differently because two libraries decoded them differently.

### State codec

Responsibilities:

- canonical serialization;
- schema version;
- document representation;
- sequence and previous-state link;
- operation type;
- authorization data;
- size and collection limits.

The encoding can be JSON, deterministic CBOR, Cap’n Proto, or another format, but hashing and signing require exactly one canonical byte representation.

### Transition validator

Given previous accepted state and candidate state, it decides whether the transition is valid.

It checks:

- DID and record binding;
- monotonic version/sequence;
- previous-state hash;
- controller authorization;
- allowed key and service changes;
- recovery thresholds;
- deactivation terminality;
- algorithm and schema support.

This logic should be pure and heavily unit-tested. Network code should not contain policy branches that only run in production.

### Veilid adapter

The adapter isolates version-specific APIs and returns method-level results:

```ts
interface VeilidRecordStore {
  create(schema: RecordSchema): Promise<RecordHandle>;
  open(key: TypedRecordKey): Promise<RecordHandle>;
  read(handle: RecordHandle, subkey: number): Promise<Uint8Array | null>;
  write(handle: RecordHandle, subkey: number, value: Uint8Array): Promise<void>;
  close(handle: RecordHandle): Promise<void>;
}
```

This is pseudocode. It must be replaced with interfaces derived from the pinned Veilid SDK and verified against real nodes.

### Resolver

The resolver coordinates parse, fetch, validation, caching, and output. It must not leak raw Veilid errors directly to callers or turn every failure into `notFound`.

Candidate categories:

- `invalidDid`;
- `methodNotSupported`;
- `notFound`;
- `temporarilyUnavailable`;
- `invalidState`;
- `deactivated`;
- `representationNotSupported`;
- internal failure with a non-sensitive correlation ID.

## Candidate data flow

### Create

1. The DID API validates requested controller and options.
2. The identifier codec creates or derives the stable identifier.
3. The Veilid adapter creates an appropriate record.
4. The state codec serializes version-zero state.
5. The method engine signs and validates the same bytes.
6. The adapter publishes state.
7. A separate read path resolves and revalidates it.
8. Only then does the API return success and recovery material.

### Resolve

1. Parse and canonicalize the DID.
2. Derive the record key with domain separation.
3. Check a bounded cache without extending state beyond policy.
4. Fetch candidate state.
5. Enforce size before decoding nested content.
6. Validate record binding, schema, authorization chain, and terminal state.
7. Return DID Resolution metadata, DID document, and document metadata.

### Update

1. Resolve fresh current state.
2. Construct a candidate transition against its exact version.
3. Sign with an authorization method permitted by current state.
4. Write using the network's available concurrency controls.
5. Read back and resolve.
6. If two valid updates race, apply the specification's deterministic conflict rule or reject and retry.

### Deactivate

Publish an authorized terminal state that contains only the method-required metadata. Resolvers must never accept an older active snapshot after seeing a valid deactivation.

## DHT design questions

Before implementation, verify from current Veilid documentation and experiments:

- Which DHT record schema best expresses authorized writers?
- What are value and subkey size limits?
- How are conflicting writes surfaced?
- What ordering or timestamp information is reliable?
- How durable are records without active maintainers?
- Can old values reappear after partitions?
- What confidentiality is provided by default record encryption, and from whom?
- Which metadata remains observable to nodes or network observers?
- How should clients recover after being offline across many updates?

Answers must be tied to a Veilid version and test results.

## Storage strategies

### Signed latest snapshot

Store one latest state envelope.

**Advantages:** simple and bounded reads.

**Risks:** rollback detection and history depend on external memory or network guarantees.

### Append-only event chain

Store signed operations linked by hashes.

**Advantages:** auditable transitions and rollback evidence.

**Risks:** unbounded history, discovery complexity, pruning, and fork handling.

### Checkpoints plus recent events

Store signed checkpoints and a bounded transition window.

**Advantages:** balances resolution cost and history.

**Risks:** more specification and migration complexity.

The method should choose one. Implementations cannot safely invent their own history behavior.

## Availability versus authenticity

Signature verification can prove that retrieved state is authentic under prior state. It does not prove that the resolver received the **latest** state.

Freshness requires some combination of:

- monotonic state known to the client;
- network consensus or conflict rules;
- checkpoint witnesses;
- cache age limits;
- multiple retrieval paths;
- explicit version queries;
- application policy during uncertainty.

This is one of the core research problems, not an implementation detail.

## Privacy budget

The architecture should record data exposure at every layer:

| Data | Potential observer | Reduction strategy |
|---|---|---|
| Stable DID | Counterparties, logs, credentials | Pairwise identifiers where appropriate |
| Record key | DHT participants and clients | Assess derivation and routed lookup behavior |
| Update time | Network and application observers | Avoid unnecessary writes; test timing leakage |
| Service endpoint | Anyone resolving public state | Omit or use relationship-specific endpoints |
| Controller key | Resolvers and verifiers | Avoid reuse across unrelated identifiers |
| IP/routing metadata | Depends on Veilid threat model | Validate private routing assumptions experimentally |

No architecture diagram can replace measurement.

## Failure policy

Applications need explicit behavior for:

- Veilid node not attached;
- record unavailable;
- invalid or conflicting state;
- unsupported method version;
- controller key compromise;
- deactivated DID;
- network partition;
- local cache newer than fetched state;
- migration to a newer Veilid or method version.

For high-risk actions, uncertainty should fail closed. For low-risk read-only displays, a clearly labeled cached state may be acceptable.

## Prototype milestone

A valid prototype should be boring:

- one CLI or library;
- one pinned Veilid environment;
- one cryptosystem;
- one state encoding;
- one writer;
- no credentials or AI integration;
- create, resolve, update, rotate, deactivate;
- adversarial tests;
- reproducible setup and CI.

Only after that should the research expand to multi-controller recovery, private relationships, DIDComm, or application demos.
