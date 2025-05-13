# Overview of Decentralized Identifiers (DIDs)

Decentralized Identifiers (DIDs) represent a paradigm shift in digital identity management. Unlike traditional identifiers that rely on centralized authorities, DIDs are designed to be created, owned, and controlled by the identity subject without depending on central registration authorities, identity providers, or certificate authorities.

---

## Table of Contents

- [Core Concepts](#core-concepts)
- [DID Architecture](#did-architecture)
- [Key Benefits](#key-benefits)
- [DID Syntax and Format](#did-syntax-and-format)
- [DID Documents](#did-documents)
- [Relationship to Verifiable Credentials](#relationship-to-verifiable-credentials)
- [Getting Started](#getting-started)

---

## Core Concepts

### Self-Sovereign Identity

DIDs are a foundational component of self-sovereign identity (SSI), a model where individuals or organizations have sole ownership of their digital and analog identities, and control over how their personal data is shared and used.

### Decentralization

By removing the need for centralized authorities, DIDs eliminate single points of failure and control, enhancing security, privacy, and resilience of identity systems.

### Cryptographic Verification

DIDs leverage public key cryptography to enable secure, verifiable interactions without relying on trusted third parties for every transaction.

---

## DID Architecture

The DID architecture consists of several key components:

1. **DID Subjects**: The entity identified by a DID (person, organization, device, data model, etc.)
2. **DID Controllers**: Entities with the ability to make changes to a DID Document
3. **Verifiable Data Registries**: Systems that record DIDs and their associated DID Documents
4. **DID Methods**: Mechanisms that define how a specific type of DID is created, resolved, and managed
5. **DID Resolvers**: Software and hardware systems that implement DID resolution

This architecture enables a decentralized web of trust where identity can be verified across different contexts and platforms.

---

## Key Benefits

DIDs offer numerous advantages over traditional identity systems:

- **Persistence**: DIDs are designed to be permanent and resolvable indefinitely
- **Cryptographic Verifiability**: Identity claims can be cryptographically verified
- **Decentralization**: No central authority controls the identifier
- **Autonomy**: Users control their identifiers and associated data
- **Privacy**: Selective disclosure and minimal data sharing
- **Interoperability**: Works across different systems and platforms
- **Portability**: Not bound to a specific service provider

---

## DID Syntax and Format

A DID is a URI (Uniform Resource Identifier) with the following format:

```
did:method-name:method-specific-id
```

For example:
- `did:web:example.com`
- `did:ethr:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb`
- `did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK`

Each DID method defines its own rules for how DIDs are created, resolved, updated, and deactivated.

---

## DID Documents

Every DID resolves to a DID Document, which contains:

- **Verification Methods**: Public keys used for authentication and digital signatures
- **Authentication Methods**: Specific verification methods designated for authentication
- **Service Endpoints**: Network addresses for interacting with the DID subject
- **Other Properties**: Additional metadata about the DID

Example DID Document:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdefghi",
  "verificationMethod": [{
    "id": "did:example:123456789abcdefghi#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
  }],
  "authentication": [
    "did:example:123456789abcdefghi#keys-1"
  ],
  "service": [{
    "id":"did:example:123456789abcdefghi#vcs",
    "type": "VerifiableCredentialService",
    "serviceEndpoint": "https://example.com/vc/"
  }]
}
```

---

## Relationship to Verifiable Credentials

DIDs are often used in conjunction with Verifiable Credentials (VCs), which are tamper-evident credentials that have authorship that can be cryptographically verified. DIDs serve as identifiers for:

- **Issuers**: Entities that create and sign credentials
- **Holders**: Entities that receive and store credentials
- **Verifiers**: Entities that verify credentials
- **Subjects**: Entities that credentials make claims about

This combination of DIDs and VCs forms the foundation of many decentralized identity ecosystems.

---

## Getting Started

To start working with DIDs:

1. **Choose a DID Method**: Select a method appropriate for your use case (see [DID Methods](../methods/))
2. **Implement DID Creation**: Generate keys and create a DID
3. **Publish DID Document**: Make the DID Document available via the appropriate registry
4. **Integrate with Applications**: Use DIDs for authentication, messaging, or credential exchange

For specific implementation details, refer to the [Implementation Guides](../implementations/) section.

---

This overview provides a foundation for understanding DIDs. For more detailed information on specific aspects, explore the other sections of this documentation.
