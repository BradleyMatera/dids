---
title: Sources and glossary
description: Primary standards, current platform references, Veilid documentation, terminology, and the editorial policy used to keep claims reviewable.
section: Reference
status: reference
source_path: docs/reference/index.md
---

This site prefers primary specifications, official product documentation, source repositories, and reproducible artifacts. Secondary explanations can provide context but should not establish a technical status claim.

## Core standards

### Decentralized identifiers

- [DID Core 1.0](https://www.w3.org/TR/did-core/) — W3C Recommendation, July 19, 2022.
- [DID Core 1.1](https://www.w3.org/TR/did-1.1/) — W3C Candidate Recommendation Snapshot, March 5, 2026.
- [DID Resolution v1](https://www.w3.org/TR/did-resolution/) — W3C Working Draft, July 24, 2026 at this review.
- [DID Methods](https://www.w3.org/TR/did-extensions-methods/) — discovery registry; explicitly not an endorsement.
- [DID Extensions](https://www.w3.org/TR/did-extensions/) — extension registry process and documents.
- [Web DID Method](https://w3c-ccg.github.io/did-method-web/) — Credentials Community Group method specification.
- [DID Method Rubric](https://www.w3.org/TR/did-rubric/) — evaluation categories for method rulemaking, design, operation, and security.

### Verifiable credentials

- [Verifiable Credentials Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/) — W3C Recommendation, May 15, 2025.
- [Verifiable Credential Data Integrity 1.0](https://www.w3.org/TR/vc-data-integrity/) — W3C Recommendation.
- [Securing Verifiable Credentials using JOSE and COSE](https://www.w3.org/TR/vc-jose-cose/) — W3C Recommendation.
- [Verifiable Credentials Overview](https://www.w3.org/TR/vc-overview/) — W3C Working Group Note.

### Exchange and messaging

- [OpenID for Verifiable Credential Issuance 1.0](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
- [OpenID for Verifiable Presentations 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [DIDComm Messaging v2](https://identity.foundation/didcomm-messaging/spec/) — editor's draft.

## Veilid sources

- [Veilid official site](https://veilid.com/)
- [How Veilid works](https://veilid.com/how-it-works/)
- [Veilid source repository](https://gitlab.com/veilid/veilid)
- [veilid-core Rust documentation](https://docs.rs/veilid-core/)
- [Veilid changelog](https://gitlab.com/veilid/veilid/-/blob/main/CHANGELOG.md)

The `did:vld` proposal is this repository's independent research. No upstream Veilid endorsement is implied.

## Adoption references

- [Microsoft Entra Verified ID overview](https://learn.microsoft.com/en-us/entra/verified-id/decentralized-identifier-overview)
- [Microsoft Entra Verified ID supported standards](https://learn.microsoft.com/en-us/entra/verified-id/verifiable-credentials-standards)
- [European Digital Identity regulation](https://digital-strategy.ec.europa.eu/en/policies/eudi-regulation)
- [EUDI Wallet pilot implementation](https://digital-strategy.ec.europa.eu/en/policies/eudi-wallet-implementation)

## Glossary

### Controller

An entity authorized by a DID method to make specified changes or perform actions associated with a DID. It is not necessarily the DID subject.

### Credential

A set of claims made by an issuer. A verifiable credential includes a securing mechanism that makes tampering detectable and supports verification.

### DID

A URI conforming to DID syntax whose method defines creation, resolution, update, and deactivation behavior.

### DID document

The common data model associated with a DID, potentially containing verification methods, verification relationships, services, and other permitted properties.

### DID method

The specification that defines how a particular DID namespace performs lifecycle and resolution operations.

### DID URL

A DID plus optional path, query, and fragment components that can identify a resource associated with the DID subject.

### Holder

An entity that possesses one or more credentials and can present them. A holder is not always the credential subject.

### Issuer

An entity that makes claims by issuing a credential.

### Method-specific identifier

The part after `did:<method>:`. Its format and meaning are defined by the DID method.

### Pairwise DID

A relationship-specific identifier intended to avoid reuse across unrelated counterparties. It reduces direct identifier correlation but does not guarantee anonymity.

### Resolver

Software or hardware that performs DID resolution. It retrieves and validates method state and returns a DID Resolution result.

### Service

An entry in a DID document describing a way to communicate with or use a capability associated with the DID subject. A service endpoint is untrusted input until application policy accepts it.

### Subject

The entity identified by a DID or described by credential claims.

### Verifiable data registry

The system a DID method uses to create, read, update, or deactivate method state. It can be a ledger, filesystem, database, peer network, web, or another system.

### Verification method

A structure describing cryptographic material and its controller. Applications must also check the relevant verification relationship.

### Verification relationship

A DID document relationship such as `authentication`, `assertionMethod`, or `keyAgreement` that authorizes a verification method for a purpose.

### Verifier

An entity that receives credentials, presentations, or proofs and applies cryptographic checks plus trust and business policy.

## Editorial rules

Every substantive page should:

- include a reviewed date;
- distinguish final standards from drafts;
- distinguish documented design from executable implementation;
- link current primary sources;
- avoid unsupported metrics and forecasts;
- label pseudocode and example-only keys;
- state important non-goals and residual risks;
- invite factual corrections through GitHub issues.

## Review cadence

Review quarterly and whenever:

- DID Core or DID Resolution changes stage;
- a cited credential or exchange specification is replaced;
- a method changes governance or maintenance status;
- Veilid ships a breaking API/cryptosystem change;
- this repository adds an actual resolver, schema, tests, or measurement artifacts.
