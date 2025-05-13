# Cap'n Proto Schema Update

This document outlines the updates made to the Cap'n Proto schema file for the `did:vld` method implementation. The updates include adding a proof field, finalizing enumerations, and updating the schema version to 1.0-rc1.

## Overview

Cap'n Proto is a data serialization format used in our system for efficient, binary representation of DID-related data structures. The schema defines the format of messages exchanged between components and stored in the Veilid DHT.

## Schema Updates

### 1. Schema Version Update

The schema version has been updated to indicate that we're approaching a stable release:

```capnp
const schemaVersion :Text = "1.0-rc1";  # Updated from previous development version
```

This version number (1.0-rc1) signifies that the schema is now in "release candidate" status, meaning it's feature-complete and undergoing final testing before the official 1.0 release.

### 2. Addition of Proof Field

A critical addition to the schema is the `proof` field in the `VeilidDIDDocument` struct, which enables cryptographic verification of DID Documents:

```capnp
struct VeilidDIDDocument {
  # Existing fields...
  
  proof @6 :Proof;  # New field for cryptographic proof
  
  # Other fields...
}

struct Proof {
  type @0 :ProofType;  # Type of proof
  created @1 :Text;  # ISO timestamp
  verificationMethod @2 :Text;  # Method used for verification
  proofPurpose @3 :ProofPurpose;  # Purpose of the proof
  proofValue @4 :Text;  # The actual proof value
}
```

The `Proof` struct contains all necessary information to verify the authenticity and integrity of a DID Document:
- The type of proof (e.g., signature algorithm)
- When it was created
- Which verification method was used
- The purpose of the proof
- The actual proof value (typically a signature)

### 3. Finalized Enumerations

All enumerations in the schema have been finalized to ensure stability and interoperability:

#### ProofType Enum

```capnp
enum ProofType {
  veilidSignature2023 @0;  # Standard Veilid signature
  veilidMultiSignature2023 @1;  # Multi-signature proof
}
```

#### ProofPurpose Enum

```capnp
enum ProofPurpose {
  assertionMethod @0;  # For assertions
  authentication @1;  # For authentication
  keyAgreement @2;  # For key agreement
  contractAgreement @3;  # For contract agreement
}
```

#### VerificationMethodType Enum

```capnp
enum VerificationMethodType {
  veilidVerificationKey2023 @0;  # Standard Veilid key
  veilidRecoveryKey2023 @1;  # Recovery key
  veilidDelegationKey2023 @2;  # Delegation key
}
```

#### ServiceType Enum

```capnp
enum ServiceType {
  veilidMessaging @0;  # Messaging service
  veilidStorage @1;  # Storage service
  veilidCredentialService @2;  # Credential service
}
```

#### MessageType Enum

```capnp
enum MessageType {
  plaintext @0;  # Unencrypted message
  encrypted @1;  # Encrypted message
  credentialOffer @2;  # Credential offer
  credentialRequest @3;  # Credential request
  credentialResponse @4;  # Credential response
}
```

### 4. Complete Updated Schema

Here is the complete updated Cap'n Proto schema:

```capnp
@0x8e2fc3e1a9c7d5b2;  # Unique identifier for the schema

const schemaVersion :Text = "1.0-rc1";  # Current schema version

struct VeilidDID {
  id @0 :Text;  # The full DID string (did:vld:...)
  methodSpecificId @1 :Text;  # The method-specific identifier
  document @2 :VeilidDIDDocument;  # The associated DID Document
}

struct VeilidDIDDocument {
  context @0 :List(Text);  # JSON-LD context
  id @1 :Text;  # The DID this document describes
  verificationMethod @2 :List(VerificationMethod);  # Verification methods
  authentication @3 :List(Text);  # Authentication references
  assertionMethod @4 :List(Text);  # Assertion method references
  service @5 :List(Service);  # Service endpoints
  proof @6 :Proof;  # Cryptographic proof
  created @7 :Text;  # ISO timestamp of creation
  updated @8 :Text;  # ISO timestamp of last update
  deactivated @9 :Bool = false;  # Whether this DID is deactivated
}

struct VerificationMethod {
  id @0 :Text;  # ID of the verification method
  type @1 :VerificationMethodType;  # Type of verification method
  controller @2 :Text;  # DID of the controller
  publicKeyMultibase @3 :Text;  # Multibase-encoded public key
}

enum VerificationMethodType {
  veilidVerificationKey2023 @0;  # Standard Veilid key
  veilidRecoveryKey2023 @1;  # Recovery key
  veilidDelegationKey2023 @2;  # Delegation key
}

struct Service {
  id @0 :Text;  # ID of the service
  type @1 :ServiceType;  # Type of service
  serviceEndpoint @2 :Text;  # Endpoint URI
}

enum ServiceType {
  veilidMessaging @0;  # Messaging service
  veilidStorage @1;  # Storage service
  veilidCredentialService @2;  # Credential service
}

struct Proof {
  type @0 :ProofType;  # Type of proof
  created @1 :Text;  # ISO timestamp
  verificationMethod @2 :Text;  # Method used for verification
  proofPurpose @3 :ProofPurpose;  # Purpose of the proof
  proofValue @4 :Text;  # The actual proof value
}

enum ProofType {
  veilidSignature2023 @0;  # Standard Veilid signature
  veilidMultiSignature2023 @1;  # Multi-signature proof
}

enum ProofPurpose {
  assertionMethod @0;  # For assertions
  authentication @1;  # For authentication
  keyAgreement @2;  # For key agreement
  contractAgreement @3;  # For contract agreement
}

struct CirisMessage {
  id @0 :Text;  # Unique message ID
  from @1 :Text;  # Sender DID
  to @2 :Text;  # Recipient DID
  created @3 :Text;  # ISO timestamp
  type @4 :MessageType;  # Type of message
  content @5 :Text;  # Message content
  proof @6 :Proof;  # Cryptographic proof
}

enum MessageType {
  plaintext @0;  # Unencrypted message
  encrypted @1;  # Encrypted message
  credentialOffer @2;  # Credential offer
  credentialRequest @3;  # Credential request
  credentialResponse @4;  # Credential response
}
```

## Implementation Impact

These schema updates have several important implications for the system:

### Security Improvements

The addition of the `proof` field significantly enhances security by:
- Enabling cryptographic verification of DID Documents
- Providing non-repudiation for document creation and updates
- Supporting different proof types for various security requirements

### Interoperability

Finalizing the enumerations ensures:
- Consistent interpretation of data across different implementations
- Forward compatibility with future versions
- Clear documentation of supported types and values

### Development Workflow

The schema version update to 1.0-rc1 signals:
- Feature completeness for the initial release
- A shift from active development to stabilization and testing
- Readiness for integration with other components

## Migration Considerations

For systems using previous versions of the schema:

1. **Data Migration**: Existing data structures need to be updated to include the new `proof` field.
2. **Validation Logic**: Systems must be updated to validate proofs when processing DID Documents.
3. **Enum Handling**: Code that processes enumerations should be reviewed to ensure it handles all finalized values.

## Conclusion

The updated Cap'n Proto schema represents a significant milestone in the development of the `did:vld` method. With the addition of the proof field, finalization of enumerations, and version update to 1.0-rc1, the schema now provides a solid foundation for secure, interoperable DID operations using the Veilid network.

These changes ensure that the Veilid layer fully satisfies the cryptographic verifiability, privacy, and trust-model requirements while remaining lightweight enough for real-time agent needs.
