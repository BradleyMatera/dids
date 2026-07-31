---
title: DIDs for IoT devices
description: Evaluate portable device identity across manufacturing, ownership, operation, transfer, maintenance, and retirement without replacing secure hardware or fleet management.
section: Application patterns
status: analysis
source_path: docs/applications/iot.md
---

DIDs can help identify devices across organizations, but an IoT security design still depends on secure manufacturing, hardware roots, firmware integrity, network admission, authorization, update systems, and retirement.

## Lifecycle first

| Phase | Identity question | Required control |
|---|---|---|
| Manufacture | Is this the expected device and hardware batch? | Secure provisioning and manufacturer evidence |
| Enrollment | Who now controls the device? | Authorized ownership/controller transition |
| Operation | May this device perform this action? | Short-lived authorization and policy |
| Maintenance | Is approved firmware/configuration running? | Signed updates and attestation where available |
| Transfer | Can ownership change without old access? | Key rotation, reset, audit, credential reissuance |
| Recovery | What if device keys or management plane fail? | Hardware/service recovery policy |
| Retirement | Can the identifier and credentials stop authorizing? | Deactivation, revocation, key destruction |

## Identity layers

Separate:

- product model and manufacturer;
- physical hardware instance;
- current owner/controller;
- deployed software/firmware;
- network interface;
- application role;
- current authorization.

One DID document should not attempt to encode the entire device inventory.

## When a DID helps

Evaluate DIDs when:

- a device changes owners or operators;
- several organizations must verify it without one shared database;
- public verification material must remain stable while keys rotate;
- credentials from manufacturers, regulators, or maintainers travel with the device;
- the device operates in a peer-to-peer environment.

Use normal PKI, cloud IoT identity, or fleet registry when one operator controls the full lifecycle and mature tooling already solves certificate issuance, rotation, and revocation.

## Provisioning pattern

1. Generate device key material in secure hardware where available.
2. Bind public material to manufacturing records.
3. Create the selected DID or enroll the device under an organizational method.
4. Issue separate credentials for model, batch, compliance, or ownership claims.
5. Register the device with the operating environment.
6. Use a short-lived session credential or capability for day-to-day commands.

The long-lived DID should not sign every sensor message directly if a safer, scalable session mechanism exists.

## Command authorization

A valid device signature does not authorize every command. Check:

- command issuer;
- device and fleet audience;
- command type and parameters;
- nonce/sequence and expiry;
- current device role;
- safety interlocks;
- rate and physical constraints;
- human approval where required.

For high-impact equipment, local safety controls must survive loss of DID resolution or cloud connectivity.

## Constrained devices

Consider:

- memory and code size;
- cryptographic acceleration;
- clock reliability;
- intermittent connectivity;
- battery and bandwidth;
- maximum DID document size;
- resolver latency;
- secure update capability;
- expected service lifetime.

A gateway may resolve DIDs and validate credentials for constrained devices, but then becomes a trust and availability boundary.

## Rotation and transfer

Ownership transfer should:

1. authenticate the authorized transfer parties;
2. remove old controller and network credentials;
3. rotate keys and recovery material;
4. reset sensitive local data;
5. update or reissue ownership/operation credentials;
6. verify old commands and sessions no longer work;
7. preserve only the audit history required by policy.

A global device DID can make the device trackable across owners. Decide whether continuity or unlinkability is more important.

## Threats

| Threat | Control |
|---|---|
| Extracted device key | Secure element/TPM, rotation, fleet detection |
| Cloned identifier | Hardware-backed proof and enrollment records |
| Malicious firmware | Secure boot, signed updates, attestation |
| Replay | Nonces, counters, bounded time windows |
| Resolver outage | Local cached policy with risk-based expiry |
| Ownership-transfer residue | Factory reset plus controller/session rotation |
| Public tracking | Pairwise operational identifiers or minimized public state |
| Unsafe command despite valid identity | Independent authorization and physical safety controls |

## did:vld fit

Veilid may be worth researching for peer-to-peer devices that lack stable domains, but the current proposal is too immature for device fleets. DHT retention, offline behavior, value limits, conflict resolution, key recovery, and long service life must be demonstrated on the target hardware and network.

## Pilot gate

Do not pilot until one target device can:

- provision securely;
- resolve through the chosen architecture;
- authenticate a bounded session;
- rotate and recover keys;
- operate safely while resolution is unavailable;
- transfer ownership;
- deactivate and reject old credentials;
- update firmware securely;
- produce a privacy-reviewed audit record.
