---
title: Key rotation and recovery
description: Model planned rotation, emergency replacement, recovery, and deactivation as authenticated state transitions with explicit authority and failure behavior.
section: Veilid research track
status: analysis
source_path: docs/security/key-rotation-recovery.md
---

Rotation replaces active key material during normal operation. Recovery restores control after keys or devices are lost or compromised. They should not be treated as the same operation.

## Lifecycle states

| State | Meaning | Allowed next actions |
|---|---|---|
| Active | Current controller keys are trusted | Update, planned rotation, recovery-policy update, deactivate |
| Rotating | Old and new keys overlap under policy | Complete rotation or abort safely |
| Recovery pending | Recovery authority is collecting valid approvals | Complete, expire, or cancel |
| Compromised | Normal controller path is no longer trusted | Emergency recovery or deactivate |
| Deactivated | Terminal identifier state | No reactivation |

The method must define who can authorize every transition and how resolvers choose the current state.

## Planned rotation

A safe overlap flow:

1. Generate the new key in approved storage.
2. Publish an update authorized by the current controller that adds the new method.
3. Confirm independent resolvers see the new state.
4. Begin signing new actions with the new key.
5. Keep the old key only for a bounded compatibility window.
6. Publish an authorized update removing the old key.
7. Destroy or archive the old private key according to audit policy.
8. Invalidate sessions or cached state that should not survive the transition.

The overlap window improves availability but temporarily increases the number of valid keys. Keep it short and monitored.

## Emergency rotation

If the active key may be compromised:

- stop using it;
- revoke application sessions;
- invoke a separately protected recovery path;
- remove the compromised method without a normal overlap if policy allows;
- notify dependent parties through authenticated channels;
- preserve evidence without logging private key material;
- investigate credential or assertion misuse;
- rotate related secrets that shared the same device boundary.

An attacker with the old key may race the recovery operation. The method needs deterministic precedence, not “last write wins.”

## Recovery models

### Offline recovery key

A separate key authorizes controller replacement.

**Strengths:** simple cryptographic model.

**Risks:** loss, theft, outdated storage, and poor user testing.

### Multi-party or threshold recovery

Several independent parties/devices approve a change.

**Strengths:** no single recovery secret.

**Risks:** collusion, availability, participant replacement, privacy, and social-engineering attacks.

### Institutional recovery

An organization or service performs identity proofing and authorizes recovery.

**Strengths:** familiar support flow.

**Risks:** reintroduces centralized power, insider risk, policy errors, and jurisdictional dependence.

### Device quorum

Existing enrolled devices approve a new device/key.

**Strengths:** good user experience for multi-device users.

**Risks:** all devices may be lost together or share one compromised cloud account.

Many real systems combine models. The specification must state their order, thresholds, delay, notification, and override rules.

## Recovery authorization object

A recovery approval should bind to:

```json
{
  "type": "DidVldRecoveryRequest",
  "version": 1,
  "did": "did:vld:zExampleOnly",
  "currentVersion": "uExampleStateHash",
  "newControllerCommitment": "uExampleKeyCommitment",
  "reason": "device-loss",
  "requestId": "019-example",
  "expiresAt": "2026-08-01T00:00:00Z"
}
```

This shape is conceptual. Binding approvals to current state, new controller, request ID, and expiry prevents broad signatures from being replayed for another recovery.

## Resolver rules

A resolver needs deterministic answers for:

- normal update and recovery published concurrently;
- two competing recoveries;
- expired recovery approvals;
- replaced recovery participants;
- older active state returned after recovery;
- deactivation racing recovery;
- algorithm migration during recovery;
- unavailable history.

If required history cannot be authenticated, high-risk operations should fail closed with a distinct error.

## did:vld design constraints

The proposal must decide whether authorization lives in:

- Veilid record writer rules;
- the signed state history;
- both, with a precise consistency rule.

It must also establish whether the DHT provides enough durable history or freshness evidence to prevent an old controller from presenting stale active state after recovery.

## Recovery privacy

A universal recovery key or committee reused across pairwise DIDs can link them. Consider:

- unique recovery material per relationship;
- blinded or commitment-based participant references;
- not publishing human contact details;
- separating active and recovery keys;
- minimizing approval timing leakage;
- secure local mapping rather than public parent links.

Privacy improvements add operational complexity. Test whether users can actually complete recovery before relying on it.

## Test checklist

- Planned rotation succeeds end to end.
- New key cannot authorize state before activation.
- Removed key cannot authorize later state.
- Stale state is rejected after rotation.
- Every recovery threshold boundary is tested.
- Duplicate, expired, wrong-DID, and wrong-version approvals fail.
- Competing update/recovery behavior is deterministic.
- Deactivation is terminal.
- Recovery material can be replaced safely.
- Lost and malicious recovery participants are modeled.
- Resolver cache freshness meets the incident-response target.

## Operational policy

Document:

- rotation interval and triggers;
- key storage class;
- overlap duration;
- recovery participants and replacement;
- approval thresholds and delay;
- emergency contacts;
- resolver cache maximum age;
- session and credential consequences;
- audit and notification requirements;
- rehearsal schedule.

Cryptographic recovery that has never been rehearsed is a hypothesis.
