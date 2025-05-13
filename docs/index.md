# Decentralized Identifiers (DIDs) with Veilid

Welcome to the comprehensive documentation on implementing Decentralized Identifiers (DIDs) using the Veilid network. This documentation covers the `did:vld` method specification, implementation details, security considerations, and practical applications.

## Navigation

### Method Specification

- [did:vld Method Specification](./methods/did-vld.md) - Complete specification of the did:vld method
- [did:vld Method Summary](./methods/did-vld-summary.md) - Concise summary of the did:vld method
- [did:vld Complete Reference](./methods/did-vld-complete-reference.md) - Comprehensive reference for the did:vld method
- [Task Completion Summary](./methods/task-completion-summary.md) - Overview of how requirements were addressed

### Implementation Details

- [Veilid DID Implementation](./implementations/veilid-did-implementation.md) - Practical guide to implementing DIDs with Veilid
- [Cap'n Proto Schema Update](./implementations/capnp-schema-update.md) - Updates to the Cap'n Proto schema
- [Resolver Unit Tests](./implementations/resolver-unit-tests.md) - Unit tests for the did:vld resolver

### Security and Privacy

- [Correlation Threat Model](./security/correlation-threat-model.md) - Analysis of correlation risks and pairwise DID strategy
- [Key Rotation and Recovery](./security/key-rotation-recovery.md) - Documentation of key rotation and recovery mechanisms

## Overview

The `did:vld` method leverages the Veilid network to create a secure, private, and resilient foundation for decentralized identifiers. Key features include:

- **Method-Specific ID**: 32-byte Blake3 hash of the Veilid public key
- **DHT-Based Resolution**: Uses Veilid's distributed hash table for lookup
- **Cryptographic Verification**: All operations are cryptographically verifiable
- **Privacy-Preserving**: Supports pairwise DIDs to prevent correlation
- **Key Management**: Comprehensive rotation and recovery mechanisms

## Quick Start

To get started with the `did:vld` method:

1. Review the [did:vld Method Specification](./methods/did-vld.md) to understand the fundamentals
2. Explore the [Veilid DID Implementation](./implementations/veilid-did-implementation.md) for practical implementation details
3. Learn about security considerations in the [Correlation Threat Model](./security/correlation-threat-model.md) and [Key Rotation and Recovery](./security/key-rotation-recovery.md) documents

## Security Considerations

The `did:vld` method includes several security and privacy features:

- **Pairwise DIDs**: Different DIDs for different relationships to prevent correlation
- **Cryptographic Proofs**: All operations require cryptographic verification
- **Key Rotation**: Process for updating keys while maintaining identity continuity
- **Recovery Mechanisms**: Multiple options for regaining control of a DID

## Implementation Status

The `did:vld` method is currently at version 1.0-rc1 (release candidate 1), indicating that it's feature-complete and undergoing final testing before the official 1.0 release.

With the implementation of the Cap'n Proto schema, resolver unit tests, and key rotation/recovery mechanisms, the `did:vld` method satisfies the cryptographic verifiability, privacy, and trust-model requirements while remaining lightweight enough for real-time agent needs.
