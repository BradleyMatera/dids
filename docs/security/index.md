---
title: Security and privacy
description: Threat-model DID systems across keys, method state, resolution, credentials, wallets, applications, and correlation before treating cryptographic validity as trust.
section: Make decisions
status: analysis
source_path: docs/security/index.md
---

DIDs move some control away from conventional identity providers, but they also move lifecycle, recovery, resolver, and policy responsibilities into the method and application. Security depends on the complete system.

<div class="callout">
  <p><strong>Start with the protected action.</strong> “The DID resolved” and “the signature verified” are intermediate facts. The security question is whether the system should permit this payment, login, credential issuance, device command, or message.</p>
</div>

## Assets

Identify what failure would harm:

- controller private keys and recovery material;
- DID method state and history;
- credential contents and holder-binding keys;
- wallet data and user consent;
- application sessions and authorization;
- service endpoints and routing metadata;
- audit records;
- availability of resolution and status checks;
- unlinkability between relationships.

## Trust boundaries

For each DID method, draw the real boundaries:

1. **Controller device or KMS** generates and uses keys.
2. **Wallet or agent** chooses identifiers, credentials, and disclosures.
3. **Registry/network/domain** makes method state available.
4. **Resolver** retrieves, validates, and caches state.
5. **Verifier** checks cryptography and credential status.
6. **Application policy** accepts issuers, roles, and assurance.
7. **Operators and dependencies** update software and respond to incidents.

A “decentralized” registry does not remove the other six.

## High-priority threats

### Controller key compromise

An attacker may authenticate, issue assertions, or update state within the relationships authorized to that key.

Controls:

- hardware-backed or managed key storage;
- purpose-separated keys;
- least-privilege verification relationships;
- rotation and emergency recovery;
- short-lived application sessions;
- device and transaction confirmation;
- anomaly detection that does not become mass surveillance.

### Malicious state replacement

A candidate DID document can contain the attacker's key and a valid self-signature. Method state must be authorized by the previous trusted state or the method's root authorization rule.

Controls:

- signed transition chains;
- registry-enforced writer rules;
- sequence/previous-state commitments;
- rollback and replay protection;
- independent resolver tests.

### Resolver compromise

A resolver can omit, modify, or return stale state; leak lookup metadata; follow dangerous endpoints; or map failures incorrectly.

Controls:

- validate method state locally where practical;
- compare independent resolvers for high-risk flows;
- pin method drivers and versions;
- bound caching;
- avoid automatically fetching service endpoints;
- log typed errors without full identifiers.

### Registry or network outage

Resolution failure can block authentication, message setup, or credential checks.

Controls:

- defined offline and cached behavior;
- multiple retrieval paths;
- bounded cache validity;
- failure modes matched to action risk;
- monitoring and dependency status;
- migration and continuity plans.

### Correlation

A stable DID, key, endpoint, credential subject, or resolution pattern can link activity across services.

Controls:

- relationship-specific identifiers and keys;
- selective disclosure and data minimization;
- avoid public personal data in DID documents;
- endpoint and wallet telemetry review;
- timing and network analysis;
- credential designs that do not reintroduce a universal subject ID.

See the [correlation threat model]({{ '/security/correlation-threat-model/' | relative_url }}).

### Credential confusion

A valid credential can still be unacceptable because the issuer is untrusted, the credential type is wrong, status is unknown, the proof purpose is wrong, or the claims are insufficient.

Controls:

- explicit issuer and credential-type policy;
- proof, status, time, schema, audience, nonce, and holder-binding validation;
- display verified claims and issuer separately;
- avoid translating “valid signature” into “verified person.”

### Service endpoint abuse

DID documents can contain URLs or structured endpoints. Blind fetching creates SSRF, tracking, malware, and data-exfiltration risks.

Controls:

- fetch only for a defined service type;
- allowlist schemes and destinations;
- block local/private network ranges where appropriate;
- apply redirect, size, content-type, and timeout limits;
- obtain user consent before contact reveals metadata.

## Method-specific risk snapshot

| Method family | Important dependencies | Typical security concern |
|---|---|---|
| Web-based | Registrar, DNS, CA, TLS, host, CDN | Account takeover or stale cached document |
| Key-derived | Key generation and custody | No rotation or deactivation under the same DID |
| Peer/local | Device sync, backups, relationship protocol | State loss and cross-device consistency |
| Public ledger | Chain, contract, indexer, wallet, fees | Public metadata, contract bugs, governance/forks |
| DHT-backed proposal | Network, record semantics, routing, retention | Latest-state ambiguity, availability, metadata leakage |

## Privacy is not a feature flag

Evaluate:

- identifiers exposed to each party;
- whether the same key appears in multiple DIDs;
- information stored in public or replicated state;
- lookup observers;
- timing and update patterns;
- IP and route metadata;
- service endpoint reuse;
- credentials shown together;
- analytics and crash reporting;
- backups, push notifications, and cloud sync.

Data minimization often does more than adding another cryptographic layer.

## Key and algorithm policy

Maintain an explicit allowlist containing:

- key and signature type;
- purpose/relationship;
- minimum parameters;
- library and provider;
- supported method and document versions;
- activation and retirement date;
- migration path.

Reject unknown algorithms. “Cryptographic agility” means a governed migration mechanism, not accepting whatever string appears in a document.

## Security review checklist

### Before implementation

- [ ] Protected actions and threat actors are named.
- [ ] Method and trust dependencies are documented.
- [ ] Private data and public state are separated.
- [ ] Rotation, recovery, and deactivation are specified.
- [ ] Simpler identifiers were considered.

### Before pilot

- [ ] Negative parser and resolver tests pass.
- [ ] Key storage matches the action risk.
- [ ] Replay, rollback, stale state, and endpoint abuse are tested.
- [ ] Logs avoid identifiers, claims, keys, and network metadata where possible.
- [ ] Dependency and incident owners are assigned.

### Before production

- [ ] Independent security review is complete.
- [ ] Interoperability is tested outside the primary implementation.
- [ ] Outage and recovery exercises have been run.
- [ ] User recovery cannot silently bypass security policy.
- [ ] Privacy claims are supported by a reproducible analysis.
- [ ] Method, resolver, and cryptosuite upgrades have a migration plan.

## What “fail closed” should mean

Fail closed for high-impact authorization when:

- state is invalid or ambiguous;
- a required current status cannot be obtained;
- an algorithm or method version is unsupported;
- a nonce or audience is wrong;
- a DID is deactivated;
- the application cannot establish the required verification relationship.

Do not disguise an outage as an invalid identity. Preserve typed failure information so support and incident responders can distinguish security rejection from unavailable infrastructure.

## Continue

Review [rotation and recovery]({{ '/security/key-rotation-recovery/' | relative_url }}) as state-machine behavior, then use the [implementation acceptance gates]({{ '/implementations/' | relative_url }}).
