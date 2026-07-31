---
title: Compare DID methods
description: Choose a DID method by governance, resolution, lifecycle, privacy, availability, and cost instead of popularity or slogans.
section: Make decisions
status: comparison
source_path: docs/methods/index.md
---

A DID method is where the practical system lives. It defines how an identifier is created, how a resolver finds and validates its document, who may update it, and what deactivation means.

<div class="callout">
  <p><strong>There is no universally best DID method.</strong> A method that is excellent for a public organization can be wrong for a private relationship, an offline device, or a high-volume consumer application.</p>
</div>

## Start with requirements, not method names

Answer these questions before comparing technologies:

1. Must strangers resolve the DID globally, or will parties exchange it directly?
2. Does the identifier need updates, rotation, recovery, or deactivation?
3. Can the subject depend on DNS, a ledger, a DHT, a federation, or no registry?
4. What resolution latency, availability, and offline behavior are acceptable?
5. Must different relationships be unlinkable?
6. Who pays for writes, hosting, monitoring, backups, and incident response?
7. Which independent implementations must interoperate?
8. What happens if the underlying registry, domain, chain, or network changes?

## Practical comparison

| Method | State / trust anchor | Lifecycle | Privacy posture | Good fit | Main tradeoff |
|---|---|---|---|---|---|
| `did:web` | DNS, HTTPS, web host, certificate ecosystem | Mutable by replacing hosted document | Public and easy to correlate | Organizations with stable domains | Control inherits domain and hosting security |
| `did:key` | Identifier contains key material | Create only; no update or deactivation | Public if shared; no registry lookup | Bootstrap, fixtures, short-lived use | Key loss or compromise requires a new DID |
| `did:jwk` | Identifier contains a JWK | Create only; no update or deactivation | Public if shared; verbose identifiers | JOSE-oriented systems and testing | Static key lifecycle |
| `did:peer` | Exchanged peer state; no public registry required | Depends on peer algorithm/version | Designed for private relationships | Pairwise connections and DIDComm | Discovery and backup are application concerns |
| `did:webvh` | Web location plus verifiable history | Mutable, with version history | Usually public; history can increase correlation | Web-based organizations needing stronger history | Emerging method and more operational complexity |
| `did:ion` | Sidetree operations anchored to Bitcoin with distributed content | Supports update, recovery, deactivate | Public operations; batching changes cost profile | Public, scalable identifiers | Infrastructure and anchoring complexity |
| `did:ethr` | Ethereum account/registry state | Mutable under contract rules | Public ledger metadata | EVM ecosystems | Fees, public correlation, contract/chain dependencies |
| `did:vld` | **Proposed** Veilid-backed state | **Unimplemented design** | Potentially privacy-oriented, not demonstrated | Research only | No resolver, registry entry, interoperability, or measurements |

The W3C DID Methods list is a discovery registry, not an endorsement or certification. A listing does not prove security, adoption, maintenance, or fitness for a particular system.

## Method profiles

### `did:web`: operationally simple, institutionally familiar

`did:web:example.com` resolves from:

```text
https://example.com/.well-known/did.json
```

`did:web:example.com:teams:identity` resolves from:

```text
https://example.com/teams/identity/did.json
```

Use it when a domain is already the public root of trust. Monitor domain registration, DNS, TLS certificates, hosting access, CDN behavior, cache controls, backups, and key rotation. “No blockchain” does not mean “no trust dependencies.”

### `did:key` and `did:jwk`: deterministic but intentionally static

These methods are easy to create and resolve locally because the identifier carries the key material. That removes network resolution but also removes a method-level update channel. If the key changes, the DID changes.

Use them for test fixtures, controlled bootstrap, local references, or cases where immutability is a feature. Do not promise recovery under the same DID.

### `did:peer`: relationship privacy over public discovery

Peer DIDs are intended for direct relationships and can avoid publishing a globally resolvable correlation handle. They pair naturally with DIDComm-style interactions.

The application must still handle contact exchange, device sync, backups, multi-device state, message routing, and recovery. Pairwise identifiers reduce one correlation channel; they do not erase timing, network, endpoint, credential, or behavioral metadata.

### Ledger-backed methods: shared history with public metadata

Methods such as `did:ion` and `did:ethr` can provide public, durable state transitions without relying on one domain. They also introduce ledger selection, confirmation, availability, cost, indexer, and governance questions.

Do not reduce the decision to “blockchain versus no blockchain.” Evaluate the complete resolution path and every operator needed to keep it working.

### `did:vld`: a research question, not a deployed option

The proposal asks whether Veilid's peer-to-peer framework and DHT could support DID state without a conventional blockchain or domain. That is worth investigating, but the current repository has not shown:

- a final identifier encoding;
- a versioned and authorized state model;
- deterministic conflict and rollback handling;
- a working resolver;
- create, update, deactivate, and recovery behavior on a real network;
- independent interoperability;
- measured privacy properties.

Read the [`did:vld` proposal]({{ '/methods/did-vld/' | relative_url }}) for the actual open decisions.

## Decision shortcuts

<div class="decision">
  <span class="decision-label">Public org</span>
  <p>Start by evaluating <code>did:web</code>. Your domain already expresses the trust relationship most verifiers will use.</p>
</div>
<div class="decision">
  <span class="decision-label">Private pair</span>
  <p>Evaluate <code>did:peer</code> and the full messaging/contact protocol, not only the identifier format.</p>
</div>
<div class="decision">
  <span class="decision-label">Static key</span>
  <p>Evaluate <code>did:key</code> or <code>did:jwk</code> when replacing the DID after a key change is acceptable.</p>
</div>
<div class="decision">
  <span class="decision-label">Public history</span>
  <p>Evaluate a maintained ledger or verifiable-history method and budget for all resolution infrastructure.</p>
</div>
<div class="decision">
  <span class="decision-label">Research</span>
  <p>Prototype <code>did:vld</code> only if exploring Veilid is itself the goal. Do not select it for production requirements.</p>
</div>

## A defensible selection record

Document the choice in an architecture decision record containing:

- intended subjects and controllers;
- required verification relationships;
- registry and resolver trust dependencies;
- create, update, rotation, recovery, and deactivate behavior;
- privacy and correlation analysis;
- expected write/read volume and costs;
- supported libraries and independent implementations;
- version pins and migration plan;
- reasons simpler identifiers were rejected.

Then validate the method against the [security checklist]({{ '/security/' | relative_url }}) and the [implementation gates]({{ '/implementations/' | relative_url }}).
