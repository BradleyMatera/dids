---
title: DIDs, clearly
description: A ten-minute mental model for decentralized identifiers, DID documents, methods, resolution, credentials, wallets, and trust.
section: Start here
status: explainer
source_path: docs/overview/index.md
---

A decentralized identifier, or DID, is a URI controlled according to the rules of a **DID method**. It can identify a person, organization, device, software agent, data model, or almost anything else. The identifier alone does not tell you what the subject is or whether you should trust it.

```text
did:example:123456789abcdefghi
│   │       └─ method-specific identifier
│   └───────── DID method
└───────────── URI scheme
```

<div class="callout">
  <p><strong>The useful one-sentence definition:</strong> a DID is an identifier whose method defines how its controller creates it, resolves its current document, changes that document, and deactivates it.</p>
</div>

## The six pieces people confuse

### 1. DID subject

The subject is whatever the DID identifies. It might be Alice, a university, a temperature sensor, an AI agent, or a software release.

### 2. DID controller

The controller is the entity authorized to make the changes allowed by the DID method. The controller and subject can be the same, but they do not have to be. An organization may control a DID for a device; a recovery committee may help control an account DID.

### 3. DID document

A DID document is the common data model associated with a DID. It can express verification methods, relationships describing how those methods may be used, and service endpoints. A DID document is not meant to become a public profile full of personal information.

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:example:123",
  "verificationMethod": [{
    "id": "did:example:123#key-1",
    "type": "Multikey",
    "controller": "did:example:123",
    "publicKeyMultibase": "zExampleOnly"
  }],
  "authentication": ["did:example:123#key-1"],
  "assertionMethod": ["did:example:123#key-1"]
}
```

This is an **illustrative** document. `did:example` is reserved for examples and `zExampleOnly` is not valid key material.

### 4. DID method

The method supplies the actual trust and operations model. `did:web` relies on DNS, HTTPS, certificate authorities, and web hosting. `did:key` derives the DID directly from key material and does not provide updates. Ledger-backed methods inherit costs and failure modes from their ledger. A proposed `did:vld` would inherit important behavior from Veilid and from whatever state and authorization design it defines.

### 5. DID resolution

Resolution takes a DID plus options and returns a DID document, resolution metadata, and document metadata, or a defined error. DID Core describes the common model; the method specifies how to retrieve and validate the state.

```text
resolve(did, options)
  → didResolutionMetadata
  → didDocument
  → didDocumentMetadata
```

The W3C DID Resolution specification is active work. As of July 31, 2026, DID Resolution v1 is a Working Draft, not a W3C Recommendation.

### 6. Verifiable credential

A verifiable credential is a tamper-evident set of claims made by an issuer. DIDs can identify issuers, holders, or subjects, but the W3C Verifiable Credentials Data Model does not require every identifier to be a DID.

<div class="decision">
  <span class="decision-label">Identifier</span>
  <p><code>did:web:university.example</code> can identify a university and help locate verification material.</p>
</div>
<div class="decision">
  <span class="decision-label">Credential</span>
  <p>A signed diploma credential says the university made particular claims about a graduate.</p>
</div>
<div class="decision">
  <span class="decision-label">Trust</span>
  <p>The verifier still decides whether that university, credential type, status mechanism, and evidence are acceptable.</p>
</div>

## What a DID proves

At most, a successful interaction can show that a party controls key material authorized by the current DID state under the chosen method's rules.

It does **not** automatically prove:

- the controller's legal name, age, employer, or humanity;
- that an issuer performed adequate identity proofing;
- that the wallet or resolver is uncompromised;
- that a service endpoint is safe;
- that the identifier is private or untraceable;
- that the method is decentralized in a meaningful operational sense.

Those claims require credentials, governance, policy, audits, identity proofing, or other evidence.

## Verification relationships matter

A verification method is not automatically authorized for every purpose. DID documents can place methods into relationships such as:

| Relationship | Typical question |
|---|---|
| `authentication` | May this party authenticate as the DID controller? |
| `assertionMethod` | May this method express claims, such as signing credentials? |
| `keyAgreement` | May this method help derive encryption keys? |
| `capabilityInvocation` | May this method invoke an authorized capability? |
| `capabilityDelegation` | May this method delegate a capability? |

Implementations should check the intended relationship, not merely find a public key somewhere in the document.

## DIDs and wallets

A wallet may:

- generate or hold private keys;
- manage one or many identifiers;
- receive and store credentials;
- create presentations;
- ask for consent before disclosure;
- track status, expiry, and recovery data.

The wallet is an application and security boundary, not a required storage location defined by DID Core. A server, hardware device, cloud KMS, or agent can perform some of the same roles.

## The real architecture

1. A controller follows a method to create a DID and initial state.
2. A verifier receives the DID through an application protocol.
3. A resolver follows the method to retrieve and validate the DID document.
4. The verifier selects the verification method authorized for the intended relationship.
5. The verifier checks the cryptographic proof and all application policy.
6. If credentials are involved, the verifier separately validates issuer trust, credential security, status, time, schema, holder binding, and requested claims.

## The fastest way to decide whether you need a DID

Use a DID when you need a portable identifier and method-defined control independent of one application's internal user table.

Do not add a DID merely because you need:

- a normal account ID inside one service;
- TLS between servers;
- an OAuth client ID;
- a signed JWT from one known issuer;
- a database primary key;
- encryption without portable identity.

Simpler identifiers are easier to operate. DIDs become useful when portability, cross-domain verification, key-controlled identifiers, or multiple trust domains justify the extra lifecycle and interoperability work.

## Continue

Next, [compare DID methods]({{ '/methods/' | relative_url }}) by their actual trust and lifecycle models, or read the [security review]({{ '/security/' | relative_url }}) before selecting one.
