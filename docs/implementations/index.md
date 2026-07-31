---
title: Implementation path
description: A standards-first sequence for turning a DID use case into a small, testable, operable system without skipping lifecycle or failure behavior.
section: Build
status: explainer
source_path: docs/implementations/index.md
---

Most DID projects fail by starting with a wallet UI or credential demo before defining the identifier lifecycle and trust model. Build the smallest end-to-end path that can be disproved.

## The build sequence

<ol class="steps">
  <li><strong>Write the use case and non-goals.</strong> Name the subject, controller, verifier, threat, portability need, and why an ordinary account identifier is insufficient.</li>
  <li><strong>Select the method.</strong> Record registry dependencies, supported operations, privacy limits, libraries, version, and migration path.</li>
  <li><strong>Define verification policy.</strong> State which verification relationship is required for each action and which credentials or issuers are trusted.</li>
  <li><strong>Implement lifecycle before features.</strong> Create, resolve, update, rotate, recover, deactivate, and reject old or unauthorized state.</li>
  <li><strong>Integrate one protocol.</strong> Add authentication, credential exchange, or messaging only after identifier state is reliable.</li>
  <li><strong>Test failures and interoperability.</strong> Use independent fixtures and resolvers; include malformed, stale, compromised, unavailable, and deactivated states.</li>
  <li><strong>Operate it.</strong> Add metrics, cache rules, key custody, backups, alerts, dependency updates, incident response, and migration.</li>
</ol>

## Architecture boundaries

Keep these layers separate in code and documentation:

| Layer | Owns | Must not silently decide |
|---|---|---|
| DID parser | Syntax and canonical input | Whether the DID or controller is trustworthy |
| Method driver | Method-specific create/read/update/deactivate | Application authorization policy |
| Resolver | Retrieval, method validation, result metadata | Whether a credential claim is acceptable |
| Crypto adapter | Key parsing, hashing, signing, verification | Which verification relationship applies |
| Wallet / key manager | Private-key custody and consent | Global issuer trust |
| Credential verifier | Proof, status, time, schema, holder binding | Business acceptance by itself |
| Application policy | Roles, issuers, assurance, user flow | Cryptographic validity |

Clear boundaries let you replace a method, resolver, or cryptosuite without rewriting application logic.

## Minimal interfaces

The following TypeScript is an interface sketch, not a library supplied by this repository:

```ts
type ResolutionResult = {
  didResolutionMetadata: {
    contentType?: string;
    error?: "invalidDid" | "notFound" | "representationNotSupported";
    message?: string;
  };
  didDocument: DidDocument | null;
  didDocumentMetadata: {
    created?: string;
    updated?: string;
    deactivated?: boolean;
    versionId?: string;
  };
};

interface DidMethodDriver {
  resolve(did: string, options?: ResolveOptions): Promise<ResolutionResult>;
  create?(input: CreateInput): Promise<CreateResult>;
  update?(did: string, change: UpdateInput): Promise<UpdateResult>;
  deactivate?(did: string, authorization: Authorization): Promise<void>;
}
```

Do not turn network timeouts, invalid state, and deactivation into the same `null` result. Typed errors are part of interoperable behavior.

## Acceptance gates

### Gate 1: correct inputs

- Strict DID and DID URL parsing.
- Method allowlist, not arbitrary dynamic loading.
- Bounded document size, key count, endpoint count, and nesting.
- Reject duplicate or ambiguous verification method IDs.
- Validate verification relationships separately.

### Gate 2: correct state

- Authenticate state according to the method, not merely a signature embedded in the state.
- Reject replay, rollback, stale versions, and unauthorized updates.
- Define cache freshness and invalidation.
- Preserve deactivation semantics during outages and recovery.

### Gate 3: correct cryptography

- Use maintained libraries and explicit algorithm allowlists.
- Pin serialization/canonicalization rules.
- Reject unsupported key and signature types.
- Keep signing keys in appropriate platform storage or a KMS/HSM.
- Include domain separation and purpose in signed inputs.

### Gate 4: correct application policy

- Cryptographic control is not human identity.
- Credential validity is not issuer acceptance.
- A DID document service endpoint is not automatically safe to fetch.
- Successful resolution is not authorization to perform a business action.

### Gate 5: observable operations

Track:

- resolution success/error counts by method and error class;
- latency and cache hit rate without logging full personal identifiers;
- update/deactivation failures;
- key-age and rotation health;
- dependency and resolver version;
- privacy-preserving audit events;
- upstream method or network status.

## Repository-specific paths

<div class="card-grid">
  <a class="card" href="{{ '/implementations/web/' | relative_url }}">
    <span class="card-label">Runnable direction</span>
    <strong>did:web + WebRTC</strong>
    <p>Use a maintained public method to authenticate an application-layer WebRTC handshake.</p>
    <span class="card-link">Open the guide →</span>
  </a>
  <a class="card" href="{{ '/implementations/veilid-did-implementation/' | relative_url }}">
    <span class="card-label">Research direction</span>
    <strong>Veilid architecture</strong>
    <p>Review the components and unanswered questions for a DHT-backed method.</p>
    <span class="card-link">Review the design →</span>
  </a>
  <a class="card" href="{{ '/implementations/capnp-schema-update/' | relative_url }}">
    <span class="card-label">Design artifact</span>
    <strong>State schema notes</strong>
    <p>Define versioning and authorization before choosing a binary encoding.</p>
    <span class="card-link">Inspect the schema →</span>
  </a>
  <a class="card" href="{{ '/implementations/resolver-unit-tests/' | relative_url }}">
    <span class="card-label">Acceptance artifact</span>
    <strong>Resolver test plan</strong>
    <p>See the tests needed to convert architecture claims into evidence.</p>
    <span class="card-link">Open the test plan →</span>
  </a>
</div>

## Definition of a credible demo

A useful demo includes one command to start its dependencies, deterministic fixtures, visible method and resolver versions, a successful flow, at least three intentional failure flows, and a README that distinguishes mocks from real network operations.

Screenshots and pseudocode are documentation. They are not implementation evidence.
