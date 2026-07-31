---
title: did:web and WebRTC
description: A practical pattern for authenticating WebRTC signaling with did:web while keeping transport encryption, identifier control, and application authorization separate.
section: Build
status: design
source_path: docs/implementations/web.md
---

WebRTC already encrypts media and data-channel transport. A DID can help an application authenticate **who authorized a session**, but it does not replace WebRTC's ICE, signaling, DTLS, or secure-context requirements.

<div class="callout">
  <p><strong>Design goal:</strong> bind a fresh application challenge and the WebRTC negotiation to a key authorized for <code>authentication</code> in a resolved <code>did:web</code> document.</p>
</div>

## When this pattern fits

Use it when:

- an organization or service has a stable HTTPS domain;
- peers already exchange signaling through an application;
- one or both peers need portable, public verification material;
- the organization can operate DNS, TLS, hosting, and key rotation safely.

Do not use it to claim that an unknown human has been identity-proofed. `did:web` proves control rooted in a domain and the current DID document.

## Resolve `did:web` correctly

For a domain DID:

```text
did:web:example.com
→ https://example.com/.well-known/did.json
```

For a path DID:

```text
did:web:example.com:users:alice
→ https://example.com/users/alice/did.json
```

Ports are percent-encoded in the DID. Follow the [Web DID Method specification](https://w3c-ccg.github.io/did-method-web/) rather than constructing URLs with a casual `split(":")`.

The resolver should:

- require HTTPS except for explicitly controlled local development;
- apply method URL transformation rules exactly;
- set connection, response, and total timeouts;
- limit redirects, response size, and content types;
- validate that document `id` equals the requested DID;
- validate unique verification method IDs and supported key types;
- treat remote contexts and endpoints as untrusted inputs;
- return typed resolution errors.

## Handshake design

### Step 1: publish the DID document

The organization publishes a DID document with a verification method authorized for `authentication`.

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:call.example.com",
  "verificationMethod": [{
    "id": "did:web:call.example.com#session-auth",
    "type": "JsonWebKey",
    "controller": "did:web:call.example.com",
    "publicKeyJwk": {
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "EXAMPLE_NOT_KEY_MATERIAL"
    }
  }],
  "authentication": [
    "did:web:call.example.com#session-auth"
  ]
}
```

This is a shape example only. Use valid keys and a verification method representation supported by the selected DID and controlled-identifier specifications.

### Step 2: issue a fresh challenge

The verifier creates:

- at least 128 bits of cryptographically random nonce;
- verifier origin or audience;
- issue and expiration times;
- one-use session identifier;
- supported protocol version.

Store the nonce as unused and expire it quickly.

### Step 3: build a stable transcript

Do not sign arbitrary JSON or a raw SDP string without a defined encoding. Build a versioned transcript from byte-exact hashes.

```json
{
  "type": "DidWebRtcHandshake",
  "version": 1,
  "prover": "did:web:call.example.com",
  "verifierOrigin": "https://meeting.example.net",
  "sessionId": "019-example",
  "nonce": "base64url-example",
  "offerSha256": "base64url-example",
  "expiresAt": "2026-07-31T12:01:00Z"
}
```

Choose and document a canonical serialization. Prefix signed bytes with a protocol-specific domain separator so the signature cannot be reused as another message type.

### Step 4: sign with an authorized method

The prover signs the transcript and returns:

- the DID;
- verification method ID;
- transcript;
- signature;
- any method/resolver version information required by policy.

The private key never enters the DID document or signaling server.

### Step 5: verify before accepting the session

The verifier:

1. checks protocol version, audience, expiry, nonce, and one-use state;
2. independently hashes the received offer and compares it to the transcript;
3. resolves the DID;
4. finds the exact verification method ID;
5. confirms that method is authorized by `authentication`;
6. verifies the signature with an allowed algorithm;
7. consumes the nonce;
8. applies application policy;
9. continues the WebRTC negotiation.

If the answer must also be bound, use a second signed transcript containing both offer and answer hashes or a defined mutual-authentication exchange.

## Threats and controls

| Threat | Control |
|---|---|
| Replayed signed offer | Fresh nonce, short expiry, one-use session ID |
| Signature used for another protocol | Domain-separated, versioned transcript |
| DID document swapped | HTTPS validation plus exact document `id` check |
| Key present but not authorized | Require membership in `authentication` |
| SDP changed after signing | Hash byte-exact offer/answer values |
| Signaling server reads messages | Add application-layer encryption if required; DID auth alone does not hide them |
| Compromised domain or host | DNS/TLS/hosting hardening, key custody, monitoring, rotation |
| Stale resolver cache | Explicit cache policy and bounded freshness for authentication |
| SSRF through service endpoints | Never fetch arbitrary endpoints without a separate allowlist and policy |
| Peer IP disclosure | Understand ICE candidate behavior; consider TURN and privacy policy |

## Browser implementation boundaries

Use:

- `RTCPeerConnection` for transport negotiation;
- Web Crypto or a platform key service for application signatures;
- a maintained DID resolver or tightly scoped `did:web` resolver;
- `crypto.getRandomValues` for nonces;
- HTTPS and secure browser contexts;
- a signaling channel with authentication, rate limits, and replay tracking.

Do not:

- invent cryptographic algorithms;
- store long-lived private keys in `localStorage`;
- treat a successful signature as user consent;
- log full SDP, DIDs, IP candidates, or credential contents by default;
- promise anonymity from WebRTC plus a DID.

## Key rotation

During planned rotation:

1. add the new authentication method;
2. deploy verifiers that accept it;
3. switch signing to the new key;
4. observe a bounded overlap period;
5. remove the old method;
6. invalidate outstanding sessions when risk requires it.

For compromise, remove the old key immediately if domain control remains trustworthy and activate the incident plan. Verifiers with stale caches need a maximum acceptance age.

## Acceptance tests

- A current authorized key succeeds.
- A valid signature from a key not in `authentication` fails.
- A changed offer, nonce, audience, session ID, or expiry fails.
- A replayed transcript fails.
- A DID document with the wrong `id` fails.
- Duplicate verification method IDs fail.
- Unsupported algorithms fail closed.
- Resolution timeout and oversized document produce typed errors.
- Rotation overlap and old-key removal behave as documented.

## What this design does not solve

It does not establish a credential issuer, verify a legal identity, provide authorization roles, protect endpoints from malware, guarantee WebRTC anonymity, or make `did:web` independent from DNS and HTTPS governance.

Those are separate layers and should remain visible in the product design.
