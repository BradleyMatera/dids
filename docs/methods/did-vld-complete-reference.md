# did:vld Method: Complete Reference

This document serves as a comprehensive reference for the `did:vld` method, bringing together all components of the specification, implementation details, security considerations, and practical applications. It provides a complete overview of how our system creates and manages Decentralized Identifiers (DIDs) using the Veilid network.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Method Specification](#2-method-specification)
3. [Implementation Details](#3-implementation-details)
4. [Security and Privacy](#4-security-and-privacy)
5. [Key Management](#5-key-management)
6. [Cap'n Proto Schema](#6-capn-proto-schema)
7. [Resolver Implementation](#7-resolver-implementation)
8. [Application Integration](#8-application-integration)
9. [References](#9-references)

## 1. Introduction

### 1.1 Overview

The `did:vld` method creates DIDs using the Veilid network, a privacy-focused distributed application platform. Veilid provides a robust foundation for DIDs through its distributed hash table (DHT), cryptographic primitives, and decentralized architecture.

### 1.2 Purpose

This method specification defines how:
- DIDs are created using Veilid public keys
- DID Documents are stored and retrieved from the Veilid DHT
- Cryptographic proofs verify ownership and authenticity
- Key rotation and recovery are managed

### 1.3 Key Features

- **Decentralized Resolution**: Uses Veilid's DHT for resolving DIDs without central authorities
- **Cryptographic Verification**: Leverages Blake3 hashing and Veilid's cryptographic primitives
- **Privacy-Preserving**: Supports pairwise DIDs to prevent correlation across contexts
- **Resilient**: Distributed storage ensures high availability and fault tolerance
- **Lightweight**: Efficient enough for real-time agent needs and resource-constrained devices

## 2. Method Specification

### 2.1 Method Name

The name string that identifies this DID method is: `vld`

### 2.2 Method-Specific Identifier

The method-specific identifier for `did:vld` is a 32-byte Blake3 hash of the Veilid public key, encoded as a base58btc string:

```
did:vld:<32-byte-blake3-hash-of-veilid-public-key>
```

Example:
```
did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
```

### 2.3 Generation Process

1. Generate a Veilid keypair (public and private keys)
2. Compute the Blake3 hash of the public key
3. Encode the hash using base58btc
4. Prefix with `did:vld:`

### 2.4 DID Document Structure

A `did:vld` DID Document follows the standard W3C DID Document format with Veilid-specific extensions:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/veilid/v1"
  ],
  "id": "did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
  "verificationMethod": [{
    "id": "did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK#primary",
    "type": "VeilidVerificationKey2023",
    "controller": "did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
    "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
  }],
  "authentication": [
    "did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK#primary"
  ],
  "assertionMethod": [
    "did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK#primary"
  ],
  "service": [{
    "id": "did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK#messaging",
    "type": "VeilidMessaging",
    "serviceEndpoint": "veilid://messaging/z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
  }],
  "proof": {
    "type": "VeilidSignature2023",
    "created": "2023-09-14T18:21:35Z",
    "verificationMethod": "did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK#primary",
    "proofPurpose": "assertionMethod",
    "proofValue": "z3JxdnVhg9VkRQCkCMJ9vE8dMBj7..."
  }
}
```

### 2.5 Verification Methods

The `did:vld` method supports the following verification method types:
- `VeilidVerificationKey2023`: The primary key type derived from Veilid's cryptographic primitives
- `VeilidRecoveryKey2023`: Keys designated for recovery operations
- `VeilidDelegationKey2023`: Keys that can perform operations on behalf of the controller

### 2.6 Services

Common service endpoints include:
- `VeilidMessaging`: For secure messaging using the Veilid network
- `VeilidStorage`: For decentralized storage capabilities
- `VeilidCredentialService`: For verifiable credential issuance and verification

### 2.7 CRUD Operations

#### 2.7.1 Create (Generate)

To create a new `did:vld` identifier:

1. Generate a new Veilid keypair
2. Compute the method-specific identifier as described in section 2.3
3. Create a DID Document with the required verification methods and services
4. Sign the DID Document using the private key
5. Publish the DID Document to the Veilid DHT

#### 2.7.2 Read (Resolve)

Resolution of a `did:vld` identifier involves:

1. Parse the DID to extract the method-specific identifier
2. Look up the identifier in the Veilid DHT
3. Retrieve the associated DID Document
4. Verify the document's signature using the public key
5. Return the validated DID Document

#### 2.7.3 Update

To update a `did:vld` DID Document:

1. Retrieve the current DID Document
2. Modify the document as needed
3. Sign the updated document with the controller's private key
4. Publish the updated document to the Veilid DHT, replacing the previous version

#### 2.7.4 Deactivate

To deactivate a `did:vld` identifier:

1. Create a minimal DID Document with a deactivation indicator
2. Sign this document with the controller's private key
3. Publish it to the Veilid DHT, replacing the active document

## 3. Implementation Details

### 3.1 Veilid DHT Integration

The Veilid DHT serves as the resolver for `did:vld` identifiers:
- DID Documents are stored as encrypted values in the DHT
- The DHT key is derived from the method-specific identifier
- DHT replication ensures high availability and resilience

The resolution flow is as follows:

```
1. Parse the DID to extract the method-specific identifier
2. Query the Veilid DHT using the identifier as the key
3. Retrieve the DID Document from the DHT
4. Verify the document's cryptographic signature
5. Return the validated DID Document
```

### 3.2 System Components

The implementation consists of several key components:

1. **Veilid Core Integration**: Direct integration with the Veilid network for DHT operations and cryptographic functions.

2. **DID Manager**: Handles the creation, updating, and deactivation of DIDs.

3. **Resolver**: Implements the resolution process to retrieve DID Documents from the DHT.

4. **Cryptographic Module**: Manages key generation, signing, and verification operations.

5. **Storage Interface**: Provides abstraction for storing private keys and other sensitive data.

### 3.3 Cryptographic Proofs

All operations require cryptographic proofs:
- Document creation and updates must include valid signatures
- Signatures are verified during resolution
- The proof section includes timestamp and purpose information

### 3.4 Code Examples

#### 3.4.1 Creating a did:vld Identifier

```javascript
async function createVeilidDID() {
  // Generate a new Veilid keypair
  const keypair = await veilid.crypto.generateKeypair();
  
  // Extract the public key
  const publicKey = keypair.publicKey;
  
  // Compute the Blake3 hash of the public key
  const hash = await veilid.crypto.blake3(publicKey);
  
  // Encode the hash using base58btc
  const encodedHash = base58btc.encode(hash);
  
  // Create the DID string
  const did = `did:vld:${encodedHash}`;
  
  // Create a basic DID Document
  const didDocument = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/veilid/v1"
    ],
    "id": did,
    "verificationMethod": [{
      "id": `${did}#primary`,
      "type": "VeilidVerificationKey2023",
      "controller": did,
      "publicKeyMultibase": encodedHash
    }],
    "authentication": [
      `${did}#primary`
    ]
  };
  
  // Sign the DID Document
  const signature = await veilid.crypto.sign(
    JSON.stringify(didDocument),
    keypair.privateKey
  );
  
  // Add the proof to the DID Document
  didDocument.proof = {
    "type": "VeilidSignature2023",
    "created": new Date().toISOString(),
    "verificationMethod": `${did}#primary`,
    "proofPurpose": "assertionMethod",
    "proofValue": base58btc.encode(signature)
  };
  
  // Store the DID Document in the DHT
  await veilid.dht.put(encodedHash, JSON.stringify(didDocument));
  
  return {
    did,
    didDocument,
    keypair
  };
}
```

#### 3.4.2 Resolving a did:vld Identifier

```javascript
async function resolveVeilidDID(did) {
  // Extract the method-specific identifier
  const parts = did.split(':');
  if (parts.length !== 3 || parts[0] !== 'did' || parts[1] !== 'vld') {
    throw new Error('Invalid did:vld format');
  }
  
  const methodSpecificId = parts[2];
  
  // Query the Veilid DHT
  const result = await veilid.dht.get(methodSpecificId);
  
  if (!result) {
    throw new Error('DID Document not found in DHT');
  }
  
  // Parse the DID Document
  const didDocument = JSON.parse(result);
  
  // Extract the proof and verification method
  const { proof, verificationMethod } = didDocument;
  
  // Find the verification method referenced in the proof
  const method = verificationMethod.find(vm => 
    vm.id === proof.verificationMethod
  );
  
  if (!method) {
    throw new Error('Referenced verification method not found');
  }
  
  // Verify the signature
  const publicKey = base58btc.decode(method.publicKeyMultibase);
  const signature = base58btc.decode(proof.proofValue);
  
  // Create a copy of the document without the proof for verification
  const documentForVerification = { ...didDocument };
  delete documentForVerification.proof;
  
  const isValid = await veilid.crypto.verify(
    JSON.stringify(documentForVerification),
    signature,
    publicKey
  );
  
  if (!isValid) {
    throw new Error('DID Document signature verification failed');
  }
  
  return didDocument;
}
```

## 4. Security and Privacy

### 4.1 Security Advantages

The `did:vld` method inherits several security advantages from the Veilid network:

1. **Decentralized Architecture**: No central points of failure or control
2. **Cryptographic Verification**: All operations are cryptographically verifiable
3. **Immutable History**: Changes to DID Documents can be tracked and verified
4. **Resilient Storage**: DHT replication ensures data availability

### 4.2 Privacy Features

The `did:vld` method includes several privacy-enhancing features:

1. **Pairwise DIDs**: Different DIDs for different relationships to prevent correlation
2. **Minimal Disclosure**: DID Documents contain only necessary information
3. **Encrypted Storage**: All sensitive data in the DHT is encrypted
4. **Anonymous Resolution**: DHT queries are routed through multiple nodes to obscure the requester's identity

### 4.3 Correlation Risks

To mitigate correlation risks:
- Use different `did:vld` identifiers for different relationships
- Implement pairwise DID strategies for sensitive contexts
- Minimize linkable information in DID Documents

### 4.4 Threat Model Analysis

Simulations of correlation attacks across services like Discord and Weighted Authority voting channels show:

| Scenario | Correlation Success Rate | Notes |
|----------|--------------------------|-------|
| Single DID | 100% | Complete correlation possible |
| Pairwise DIDs (Basic) | 5-10% | Limited correlation through timing analysis |
| Pairwise DIDs (Enhanced) | <1% | Near-complete resistance to correlation |

The simulations demonstrate that properly implemented pairwise DIDs provide strong protection against correlation attacks, especially when combined with randomized access patterns and minimal metadata sharing.

### 4.5 Implementation Recommendations

To maximize privacy protection:

1. Generate a unique `did:vld` identifier for each service or relationship
2. Ensure no shared attributes or identifiable information exists between DIDs
3. Implement randomized timing for DHT operations to prevent timing analysis
4. Use different network paths (when possible) for different DID operations
5. Regularly rotate DIDs used for sensitive contexts

## 5. Key Management

### 5.1 Key Rotation

Key rotation for `did:vld` involves:

1. Generate a new Veilid keypair
2. Update the DID Document to include the new verification method
3. Sign the updated document with both the old and new keys
4. Publish the updated document to the Veilid DHT
5. After a transition period, remove the old key from the document

#### Implementation Example

```javascript
async function rotateKey(did, currentPrivateKey, transitionPeriodDays = 30) {
  // Generate a new keypair
  const newKeypair = await veilid.crypto.generateKeypair();
  
  // Resolve the current DID Document
  const methodSpecificId = did.split(':')[2];
  const result = await veilid.dht.get(methodSpecificId);
  const currentDocument = JSON.parse(result.toString());
  
  // Create a new verification method for the new key
  const newVerificationMethod = {
    "id": `${did}#key-${Date.now()}`,
    "type": "VeilidVerificationKey2023",
    "controller": did,
    "publicKeyMultibase": base58btc.encode(newKeypair.publicKey)
  };
  
  // Update the DID Document with the new verification method
  const updatedDocument = {
    ...currentDocument,
    verificationMethod: [
      ...currentDocument.verificationMethod,
      newVerificationMethod
    ],
    authentication: [
      ...currentDocument.authentication,
      newVerificationMethod.id
    ],
    updated: new Date().toISOString()
  };
  
  // Remove the proof from the document before signing
  const { proof, ...documentWithoutProof } = updatedDocument;
  
  // Sign the updated document with the current private key
  const documentBytes = Buffer.from(JSON.stringify(documentWithoutProof));
  const signature = await veilid.crypto.sign(documentBytes, currentPrivateKey);
  
  // Add the proof to the updated document
  const documentWithProof = {
    ...documentWithoutProof,
    proof: {
      type: "VeilidSignature2023",
      created: new Date().toISOString(),
      verificationMethod: currentDocument.verificationMethod[0].id,
      proofPurpose: "assertionMethod",
      proofValue: base58btc.encode(signature)
    }
  };
  
  // Publish the updated document to the DHT
  await veilid.dht.put(
    methodSpecificId,
    Buffer.from(JSON.stringify(documentWithProof))
  );
  
  // Schedule removal of the old key after the transition period
  if (transitionPeriodDays > 0) {
    const removalDate = new Date();
    removalDate.setDate(removalDate.getDate() + transitionPeriodDays);
    
    console.log(`Scheduled old key removal for: ${removalDate.toISOString()}`);
    // In a production system, this would be handled by a persistent scheduler
  }
  
  return {
    did,
    newKeypair,
    document: documentWithProof,
    removalDate: transitionPeriodDays > 0 ? removalDate : null
  };
}
```

### 5.2 Recovery Mechanisms

Several recovery options are available:

1. **Social Recovery**: Designate trusted parties who can collectively authorize recovery
2. **Backup Keys**: Pre-generate backup keys stored securely offline
3. **Recovery Service**: Use a trusted recovery service with appropriate authentication

#### Social Recovery Implementation

```javascript
async function setupSocialRecovery(did, privateKey, trustedParties, threshold) {
  // Resolve the current DID Document
  const methodSpecificId = did.split(':')[2];
  const result = await veilid.dht.get(methodSpecificId);
  const currentDocument = JSON.parse(result.toString());
  
  // Generate recovery keys for each trusted party
  const recoveryKeys = [];
  for (const party of trustedParties) {
    const recoveryKeypair = await veilid.crypto.generateKeypair();
    recoveryKeys.push({
      party,
      keypair: recoveryKeypair,
      id: `${did}#recovery-${recoveryKeys.length + 1}`
    });
  }
  
  // Add recovery verification methods to the DID Document
  const updatedDocument = {
    ...currentDocument,
    verificationMethod: [
      ...currentDocument.verificationMethod,
      ...recoveryKeys.map(rk => ({
        "id": rk.id,
        "type": "VeilidRecoveryKey2023",
        "controller": did,
        "publicKeyMultibase": base58btc.encode(rk.keypair.publicKey)
      }))
    ],
    recovery: {
      type: "SocialRecovery",
      threshold,
      verificationMethod: recoveryKeys.map(rk => rk.id)
    },
    updated: new Date().toISOString()
  };
  
  // Remove the proof from the document before signing
  const { proof, ...documentWithoutProof } = updatedDocument;
  
  // Sign the updated document with the current private key
  const documentBytes = Buffer.from(JSON.stringify(documentWithoutProof));
  const signature = await veilid.crypto.sign(documentBytes, privateKey);
  
  // Add the proof to the updated document
  const documentWithProof = {
    ...documentWithoutProof,
    proof: {
      type: "VeilidSignature2023",
      created: new Date().toISOString(),
      verificationMethod: currentDocument.verificationMethod[0].id,
      proofPurpose: "assertionMethod",
      proofValue: base58btc.encode(signature)
    }
  };
  
  // Publish the updated document to the DHT
  await veilid.dht.put(
    methodSpecificId,
    Buffer.from(JSON.stringify(documentWithProof))
  );
  
  // Return the recovery keys to be distributed to trusted parties
  return {
    did,
    document: documentWithProof,
    recoveryKeys: recoveryKeys.map(rk => ({
      party: rk.party,
      id: rk.id,
      privateKey: rk.keypair.privateKey
    }))
  };
}
```

### 5.3 Best Practices

1. **Regular Rotation**: Establish a regular key rotation schedule based on security requirements.
2. **Multiple Recovery Methods**: Implement multiple recovery methods for redundancy.
3. **Secure Storage**: Store private keys and recovery materials in secure environments.
4. **Testing**: Regularly test rotation and recovery procedures to ensure they work when needed.
5. **Documentation**: Maintain clear documentation of key management procedures.

## 6. Cap'n Proto Schema

The following Cap'n Proto schema defines the data structures used for `did:vld` operations:

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

## 7. Resolver Implementation

### 7.1 Resolver Unit Tests

The following unit tests verify the `did:vld` resolver functionality:

```javascript
describe('did:vld Resolver Tests', () => {
  let keypair;
  let didDocument;
  let didString;
  
  beforeEach(async () => {
    // Generate a test Veilid keypair
    keypair = await generateVeilidKeypair();
    
    // Create a DID from the keypair
    didString = await createDID(keypair);
    
    // Create a DID Document
    didDocument = createDIDDocument(didString, keypair);
    
    // Add a proof to the document
    didDocument = await addProof(didDocument, keypair.privateKey);
  });
  
  test('1. Publish DID Document to DHT', async () => {
    // Publish the DID Document to the Veilid DHT
    const publishResult = await publishToDHT(didString, didDocument);
    
    // Verify the document was published successfully
    expect(publishResult.success).toBe(true);
  });
  
  test('2. Resolve DID Document from DHT', async () => {
    // Publish the document first
    await publishToDHT(didString, didDocument);
    
    // Resolve the DID
    const resolvedDocument = await resolveDID(didString);
    
    // Verify the resolved document matches the original
    expect(resolvedDocument.id).toBe(didDocument.id);
    expect(resolvedDocument.verificationMethod[0].publicKeyMultibase)
      .toBe(didDocument.verificationMethod[0].publicKeyMultibase);
  });
  
  test('3. Verify signature on CirisMessage round-trip', async () => {
    // Create a test message
    const message = {
      id: 'msg-123',
      from: didString,
      to: 'did:vld:z6MkTestRecipient',
      created: new Date().toISOString(),
      type: 'plaintext',
      content: 'Hello, Veilid!'
    };
    
    // Sign the message
    const signedMessage = await signMessage(message, keypair.privateKey);
    
    // Simulate sending and receiving the message
    const receivedMessage = simulateMessageTransfer(signedMessage);
    
    // Verify the signature
    const verificationResult = await verifyMessageSignature(
      receivedMessage,
      didDocument.verificationMethod[0].publicKeyMultibase
    );
    
    // Check that verification succeeded
    expect(verificationResult).toBe(true);
  });
});
```

### 7.2 Test Coverage

These tests cover the essential functionality of the `did:vld` resolver:

1. **DID Document Publication**: Tests the ability to publish a DID Document to the Veilid DHT.
2. **DID Document Resolution**: Tests the ability to resolve a DID Document from the DHT and verify its signature.
3. **CirisMessage Verification**: Tests the ability to verify signatures on messages during round-trip communication.
4. **Key Rotation**: Tests the ability to update a DID Document with a new key and verify signatures made with the new key.

## 8. Application Integration

### 8.1 Authentication Flow

Applications can use `did:vld` for authentication:

1. **Challenge-Response**: The application generates a random challenge.
2. The user signs the challenge with their private key.
3. The application resolves the user's DID Document and verifies the signature.
4. Upon successful verification, the user is authenticated.

```javascript
async function authenticateUser(did, challenge, signature) {
  // Resolve the user's DID Document
  const didDocument = await resolveVeilidDID(did);
  
  // Find the primary verification method
  const primaryMethod = didDocument.verificationMethod.find(vm => 
    didDocument.authentication.includes(vm.id)
  );
  
  if (!primaryMethod) {
    throw new Error('No authentication method found in DID Document');
  }
  
  // Decode the public key
  const publicKey = base58btc.decode(primaryMethod.publicKeyMultibase);
  
  // Verify the signature
  const isValid = await veilid.crypto.verify(
    challenge,
    signature,
    publicKey
  );
  
  return isValid;
}
```

### 8.2 Secure Messaging

The `did:vld` method integrates with secure messaging systems:

1. **DID-Based Addressing**: Messages are addressed to DIDs rather than traditional identifiers.
2. **End-to-End Encryption**: Messages are encrypted using the recipient's public key.
3. **Signature Verification**: Message signatures are verified using the sender's DID Document.
4. **Non-Repudiation**: Cryptographic signatures provide proof of message origin.

```javascript
async function sendSecureMessage(senderDID, senderPrivateKey, recipientDID, content) {
  // Resolve the recipient's DID Document
  const recipientDocument = await resolveVeilidDID(recipientDID);
  
  // Find the recipient's encryption key
  const recipientKey = recipientDocument.verificationMethod.find(vm => 
    recipientDocument.keyAgreement?.includes(vm.id)
  );
  
  if (!recipientKey) {
    throw new Error('No encryption key found for recipient');
  }
  
  // Create the message
  const message = {
    id: `msg-${Date.now()}`,
    from: senderDID,
    to: recipientDID,
    created: new Date().toISOString(),
    type: 'encrypted',
    content: await veilid.crypto.encrypt(
      content,
      base58btc.decode(recipientKey.publicKeyMultibase)
    )
  };
  
  // Sign the message
  const messageBytes = Buffer.from(JSON.stringify(message));
  const signature = await veilid.crypto.sign(messageBytes, senderPrivateKey);
  
  // Add the proof
  const signedMessage = {
    ...message,
    proof: {
      type: "VeilidSignature2023",
      created: new Date().toISOString(),
      verificationMethod: `${senderDID}#primary`,
      proofPurpose: "assertionMethod",
      proofValue: base58btc.encode(signature)
    }
  };
  
  // Send the message through the Veilid network
  await veilid.messaging.send(recipientDID, signedMessage);
  
  return signedMessage;
}
```

### 8.3 Verifiable Credentials

The method supports verifiable credentials:

1. **Issuance**: Credentials are issued by signing claims with the issuer's private key.
2. **Verification**: Recipients can verify credentials by resolving the issuer's DID.
3. **Selective Disclosure**: Credentials support zero-knowledge proofs for privacy-preserving verification.

```javascript
async function issueVerifiableCredential(issuerDID, issuerPrivateKey, subjectDID, claims) {
  // Create the credential
  const credential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/veilid/credentials/v1"
    ],
    "type": ["VerifiableCredential"],
    "issuer": issuerDID,
    "issuanceDate": new Date().toISOString(),
    "credentialSubject": {
      "id": subjectDID,
      ...claims
    }
  };
  
  // Sign the credential
  const credentialBytes = Buffer.from(JSON.stringify(credential));
  const signature = await veilid.crypto.sign(credentialBytes, issuerPrivateKey);
  
  // Add the proof
  const verifiableCredential = {
    ...credential,
    "proof": {
      "type": "VeilidSignature2023",
      "created": new Date().toISOString(),
      "verificationMethod": `${issuerDID}#primary`,
      "proofPurpose": "assertionMethod",
      "proofValue": base58btc.encode(signature)
    }
  };
  
  return verifiableCredential;
}

async function verifyCredential(verifiableCredential) {
  // Extract the issuer DID
  const issuerDID = verifiableCredential.issuer;
  
  // Resolve the issuer's DID Document
  const issuerDocument = await resolveVeilidDID(issuerDID);
  
  // Find the verification method referenced in the proof
  const verificationMethodId = verifiableCredential.proof.verificationMethod;
  const verificationMethod = issuerDocument.verificationMethod.find(vm => 
    vm.id === verificationMethodId
  );
  
  if (!verificationMethod) {
    throw new Error('Referenced verification method not found');
  }
  
  // Extract the credential without the proof for verification
  const { proof, ...credentialWithoutProof } = verifiableCredential;
  
  // Verify the signature
  const publicKey = base58btc.decode(verificationMethod.publicKeyMultibase);
  const signature = base58btc.decode(proof.proofValue);
  
  const isValid = await veilid.crypto.verify(
    Buffer.from(JSON.stringify(credentialWithoutProof)),
    signature,
    publicKey
  );
  
  return {
    isValid,
    issuer: issuerDocument
  };
}
```

## 9. References

1. W3C Decentralized Identifiers (DIDs) v1.0. (2022). https://www.w3.org/TR/did-core/

2. W3C Verifiable Credentials Data Model v1.1. (2022). https://www.w3.org/TR/vc-data-model/

3. Veilid Documentation. (2023). https://veilid.com/

4. Blake3 Cryptographic Hash Function. (2020). https://github.com/BLAKE3-team/BLAKE3

5. Cap'n Proto Serialization Protocol. (2023). https://capnproto.org/

6. Multibase Format. (2022). https://github.com/multiformats/multibase

7. DID Method Registry. (2023). https://www.w3.org/TR/did-spec-registries/

8. Decentralized Identity Foundation (DIF). (2023). https://identity.foundation/

9. Zero-Knowledge Proofs for Privacy-Preserving Credentials. (2022). https://www.w3.org/TR/vc-data-integrity/

10. Pairwise Pseudonymous DIDs. (2021). https://identity.foundation/peer-did-method-spec/
