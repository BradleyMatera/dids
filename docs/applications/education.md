---
title: Education credentials
description: Model issuers, learners, verifiers, credentials, status, privacy, and trust without treating a DID as a diploma or a wallet as institutional authority.
section: Application patterns
status: explainer
source_path: docs/applications/education.md
---

Education is primarily a **verifiable credential** use case. DIDs can identify institutions or holders, but the valuable artifact is the institution's signed claim and the verifier's trust in that institution.

## Actors

| Actor | Responsibility |
|---|---|
| Institution / issuer | Identity proofing, academic records, credential issuance, correction, status |
| Learner / holder | Receives, stores, and presents credentials |
| Employer or school / verifier | Requests minimum claims, verifies, and applies acceptance policy |
| Trust registry or policy | Establishes which institutions and credential types are acceptable |
| Wallet provider | Protects keys and credentials, obtains consent, supports backup/recovery |

## Issuance flow

1. The institution authenticates the learner through its normal records process.
2. It creates a credential using a published type/schema and W3C VC Data Model 2.0 or another agreed format.
3. It signs or secures the credential with an accepted cryptosuite.
4. It delivers the credential through an authenticated issuance protocol.
5. The learner stores it in a wallet or approved repository.
6. The institution maintains status and correction processes.

The issuer's DID may help a verifier locate current verification material. It does not prove that the issuer is accredited; that comes from governance and policy.

## Verification flow

The verifier checks:

- credential format and required fields;
- proof or envelope integrity;
- issuer identifier and current verification material;
- required proof purpose or key relationship;
- issuance/validity time;
- status, revocation, or suspension;
- credential type and schema;
- holder binding where required;
- audience, nonce, and presentation replay protection;
- whether the issuer and claims satisfy local policy.

Then it displays separately:

- cryptographically valid;
- issuer recognized;
- credential active;
- claims accepted for this purpose.

## Data minimization

A job application may need “Bachelor's degree awarded by Institution X” without:

- student number;
- birth date;
- full transcript;
- home address;
- one universal learner DID;
- every prior presentation.

Request the smallest claim set and retain it only as long as necessary. Selective-disclosure formats may help, but they do not fix excessive requests or poor retention.

## Identifier choices

### Public institutional DID

`did:web` is often understandable for an institution because its domain is already a public trust signal. The institution must protect the domain, host, and signing keys.

### Learner DID

A globally public learner DID is often unnecessary. Use a pairwise identifier, credential-bound key, or no subject DID when the credential format and use case allow.

### Credential identifier

A credential ID helps lifecycle and audit but can become a correlation handle. Do not expose a stable serial across unrelated presentations without considering the privacy cost.

## Corrections and status

Model:

- administrative correction;
- legal name change without unnecessary identity linkage;
- credential suspension;
- revocation;
- superseding credential;
- issuer key rotation;
- institution merger or closure;
- verifier behavior when status is unavailable.

Never put the only authoritative academic record in a learner-controlled wallet. The institution needs durable records and a reissuance path.

## Accessibility and inclusion

Provide:

- non-smartphone or printable alternatives;
- accessible wallet and verification flows;
- human-readable claim and issuer explanations;
- recovery for lost devices;
- assistance that does not require sharing wallet secrets;
- multilingual and low-connectivity support;
- a dispute and correction process.

Digital credentials should not turn device ownership into an eligibility requirement.

## Threats

| Threat | Control |
|---|---|
| Fake university DID | Trust registry/policy and domain/institution verification |
| Stolen learner wallet | Device security, holder binding, recovery, revocation where applicable |
| Replayed presentation | Verifier nonce, audience, expiry |
| Overcollection | Purpose-limited requests and selective disclosure |
| Issuer key compromise | Rotation, incident response, status and reissuance |
| Correlation across applications | Pairwise identifiers and credential presentation design |
| “Valid” but irrelevant credential | Explicit credential type, issuer, and assurance policy |

## Pilot plan

Start with one credential type, one issuer, one wallet, one verifier, one status method, and a paper fallback. Test issuance, presentation, expiry, correction, key rotation, lost-wallet recovery, and verifier outage before expanding.

Use [W3C VC Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/) as a primary source and evaluate current [OpenID4VCI](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html) and [OpenID4VP](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) specifications for exchange.
