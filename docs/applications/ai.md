---
title: DIDs for AI agents
description: Use DIDs to identify agent controllers and verification material while keeping authority, code provenance, runtime integrity, and behavior as separate evidence.
section: Application patterns
status: analysis
source_path: docs/applications/ai.md
---

An AI agent can use a DID as a portable identifier, but the DID does not prove which model is running, whether the agent followed instructions, or whether its output is true.

<div class="callout">
  <p><strong>Best use:</strong> identify the controller of an agent, locate authorized verification material, and validate signed actions or delegated capabilities across systems.</p>
</div>

## Identity layers for an agent

| Layer | Question | Possible evidence |
|---|---|---|
| Controller | Who is responsible for this agent? | Organization DID, certificate, account, legal records |
| Agent instance | Which logical agent is acting? | Agent DID or workload identity |
| Runtime | What process and environment are running? | Platform attestation, workload identity, deployment record |
| Software | Which code/configuration was deployed? | Signed build provenance and artifact digest |
| Model | Which model/version is configured? | Provider statement, model digest where available, deployment metadata |
| Authority | What may the agent do right now? | Short-lived capability, OAuth token, policy decision |
| Action | What did it request or produce? | Signed, nonce-bound action record and audit event |
| Outcome | Was the result correct and allowed? | Independent validation and business controls |

Do not collapse the table into one “verified agent” badge.

## Stable identity versus ephemeral authority

A DID can be long-lived. Authorization should usually be short-lived and narrow.

Example:

```text
Agent DID
  └─ identifies the agent/controller relationship

Delegated capability
  ├─ audience: invoice service
  ├─ action: draft invoice
  ├─ limit: $0 financial authority
  ├─ expires: 10 minutes
  └─ approval required: human
```

The agent proves control of an authorized method, then presents a separate capability or token. The verifier checks both.

## Signed action envelope

```json
{
  "type": "AgentActionRequest",
  "version": 1,
  "agent": "did:web:agents.example.com:research",
  "audience": "https://records.example.net",
  "action": "records.search",
  "resource": "case-019",
  "requestId": "019-example",
  "issuedAt": "2026-07-31T12:00:00Z",
  "expiresAt": "2026-07-31T12:05:00Z",
  "inputDigest": "sha256-example"
}
```

Sign a canonical, domain-separated form and bind it to a nonce or one-use request where replay matters. The verifier must still apply its own policy.

## Multi-agent coordination

For agent-to-agent interaction:

1. Each agent presents its identifier and current authority.
2. Each side resolves or otherwise validates the other's key material.
3. Messages include audience, purpose, nonce, expiry, and conversation ID.
4. Delegation chains are bounded and validated.
5. Tool results include provenance or source references.
6. High-impact actions require an independent control, not agent consensus alone.

A collection of agents signing each other's claims can create a closed loop of false confidence. Anchor trust in accountable controllers and verifiable external evidence.

## Content provenance

DIDs may identify a signer, but content provenance also needs:

- a digest of the exact artifact;
- signed assertions about edits and tools;
- a chain of custody;
- trusted capture or build components;
- tamper-evident packaging;
- a verifier that communicates what was and was not established.

Evaluate purpose-built provenance standards such as [C2PA](https://c2pa.org/) rather than inventing a DID-only content certificate.

## When simpler identity is better

Use established workload identity, mutual TLS, OAuth, cloud IAM, or a service mesh when:

- all agents run inside one administrative domain;
- the infrastructure already manages workload lifecycle;
- cross-organization portability is not required;
- platform-native authorization and rotation are mature.

A DID becomes more interesting when the agent crosses organizations, providers, or networks and the controller needs portable verification material.

## Security controls

- Separate agent identity keys from software signing and financial authority.
- Keep long-lived keys out of model context and tool arguments.
- Require explicit audiences and short expiry.
- Prevent the model from choosing its own policy or verification method.
- Bind approvals to exact actions and input/output digests.
- Rate-limit and detect delegation loops.
- Make human approval meaningful, with clear changes and consequences.
- Record tool calls and policy decisions without logging secrets or unnecessary personal data.
- Revoke capabilities immediately when an agent, model, or runtime is compromised.

## did:vld fit

A Veilid-backed method could be researched for agents that operate in peer-to-peer environments without stable domains. The proposal must first prove lifecycle and resolver correctness.

It should not be selected because “AI agents need real-time decentralized identity.” Current application protocols can use implemented methods or conventional workload identities while the Veilid method remains experimental.

## Acceptance questions

- Does the verifier know the accountable controller?
- Is current authority narrower and shorter-lived than identity?
- Can the agent rotate keys without losing audit continuity?
- Can authority be revoked during an incident?
- Are action records replay-resistant?
- Are code/model/runtime claims supported by evidence beyond the DID?
- Does the design still work when the resolver is unavailable?
- Can a human understand what was verified?
