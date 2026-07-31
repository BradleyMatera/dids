---
title: Secure messaging and DIDComm
description: Separate DIDComm message protection, key agreement, routing, relationship identity, transport, and metadata privacy before promising secure decentralized chat.
section: Application patterns
status: explainer
source_path: docs/applications/secure-messaging.md
---

[DIDComm Messaging v2](https://identity.foundation/didcomm-messaging/spec/) defines secure, private application messages associated with decentralized identity. As of this review, the published page identifies itself as an Editor's Draft, not a W3C Recommendation.

<div class="callout">
  <p><strong>DIDComm is more than “sign JSON with a DID.”</strong> Implement the specified message formats, authenticated encryption modes, key agreement, routing, and protocol behavior with maintained libraries.</p>
</div>

## Security layers

| Layer | Purpose |
|---|---|
| Relationship identifier | Names parties within the relationship |
| DID document / peer state | Supplies current key agreement and service data |
| DIDComm packing | Protects message content and authenticates as configured |
| Transport | Moves packed messages by HTTP, WebSocket, queue, Bluetooth, or another channel |
| Routing / mediator | Helps intermittently connected parties receive messages |
| Application protocol | Defines message types, state, authorization, and user experience |

Encrypted transport such as TLS does not replace message protection when intermediaries store or forward messages. Message encryption does not hide all metadata from transports and mediators.

## Identifier choices

### Pairwise or peer DIDs

Use relationship-specific identifiers to avoid a universal public handle. Keep separate keys and routing data where practical.

### Public organizational DIDs

Useful for discoverable services or issuers. Public correlation is intentional, so domain-backed methods may be appropriate.

### `did:vld`

A Veilid-backed method could eventually combine relationship state and peer-to-peer transport research. It must first prove deterministic resolution and lifecycle. Do not add DIDComm to the first method prototype.

## Connection setup

A secure setup generally needs:

1. an authenticated invitation or out-of-band exchange;
2. fresh relationship identifiers and keys;
3. supported DIDComm version and algorithms;
4. endpoint or mediator information;
5. replay-resistant connection messages;
6. explicit user or application policy;
7. a safe way to update keys and routing.

The invitation channel determines important trust. A QR code copied from an attacker is still an attacker-controlled invitation.

## Message properties

A protocol message should use:

- globally unique message ID;
- explicit type/version;
- sender/recipient relationship;
- creation and expiry where relevant;
- parent/thread identifiers;
- replay handling;
- application-specific authorization;
- minimal attachments and claims.

Use the DIDComm specification's structures. Do not invent lookalike fields and call them DIDComm-compatible.

## Encryption modes

At a high level:

- **Anonymous encryption** can protect content for a recipient without authenticating a sender in the cryptographic envelope.
- **Authenticated encryption** protects content and authenticates sender key agreement.
- A separate signature may be needed when non-repudiation or forwarding verification is an explicit requirement, but signatures can also increase correlation and long-term exposure.

Choose based on protocol threat model, not a blanket rule that more proofs are always safer.

## Metadata exposure

Even properly packed messages can expose:

- send/receive time;
- size and frequency;
- transport endpoints;
- mediator relationships;
- network addresses;
- push-notification metadata;
- device identifiers;
- contact graph;
- whether two parties are online.

Use padding, batching, private routing, mediator separation, reduced logs, and notification design only after identifying which observer each control addresses.

## Key rotation

Messaging rotation must coordinate:

- DID or peer-state update;
- active conversation state;
- queued messages encrypted to old keys;
- mediator/routing updates;
- multiple devices;
- lost device removal;
- recovery and contact verification.

Keep a bounded decryption grace period only when the threat model allows it. A compromised old key may make that grace period dangerous.

## Protocol state

DIDComm secures messages; the application still needs a state machine.

Reject:

- messages of the wrong type for the current state;
- duplicated or replayed IDs;
- wrong thread or parent;
- expired messages;
- actions exceeding sender authority;
- attachments that violate size or media policy;
- transitions that skip required consent.

## Operational checklist

- [ ] Use a maintained DIDComm library and pin its version.
- [ ] Test against another implementation.
- [ ] Protect wallet/device keys.
- [ ] Validate every resolved key relationship.
- [ ] Bound message and attachment sizes.
- [ ] Store packed messages when intermediaries do not need plaintext.
- [ ] Define mediator trust, retention, and abuse handling.
- [ ] Support rotation, lost-device removal, and backup recovery.
- [ ] Provide contact verification users can understand.
- [ ] Measure metadata; do not promise anonymity from encryption alone.

## WebRTC is a separate pattern

For direct browser sessions, see [did:web and WebRTC]({{ '/implementations/web/' | relative_url }}). WebRTC transport and DIDComm messages can coexist, but they solve different layers and should not be described as one protocol.
