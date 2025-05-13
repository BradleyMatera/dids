# Implementing DIDs with Veilid

{% include navigation.md %}

This document explains how our system creates and manages Decentralized Identifiers (DIDs) using the Veilid network, focusing on the `did:vld` method.

## Overview

Veilid provides an ideal foundation for DIDs due to its decentralized architecture, strong cryptographic primitives, and distributed hash table (DHT). Our implementation leverages these features to create a secure, private, and resilient DID method.

## How did:vld Works

### Method-Specific ID Generation

The `did:vld` method uses a 32-byte Blake3 hash of the Veilid public key as its method-specific identifier. This approach provides several benefits:

1. **Cryptographic Derivation**: The identifier is cryptographically derived from the public key, creating a verifiable link between the identifier and the key material.

2. **Collision Resistance**: Blake3's strong collision resistance ensures that different public keys will generate different identifiers.

3. **Fixed Length**: The 32-byte output provides a consistent identifier length regardless of the input key size.

4. **Performance**: Blake3 is extremely fast, allowing for efficient identifier generation even on resource-constrained devices.

The generation process follows these steps:

```
1. Generate a Veilid keypair
2. Extract the public key
3. Compute the Blake3 hash of the public key
4. Encode the hash using base58btc
5. Prefix with "did:vld:" to form the complete DID
```

### DHT-Based Resolution

The resolver for `did:vld` operates through the Veilid Distributed Hash Table (DHT):

1. **Lookup Process**: When resolving a DID, the system extracts the method-specific identifier and uses it as a key to query the Veilid DHT.

2. **Distributed Storage**: The DID Document is stored across multiple nodes in the Veilid network, providing redundancy and high availability.

3. **Cryptographic Verification**: Upon retrieval, the DID Document's signature is verified using the public key to ensure authenticity.

4. **Caching**: For performance optimization, resolved DID Documents can be cached locally with appropriate time-to-live values.

The resolution flow is as follows:

```
1. Parse the DID to extract the method-specific identifier
2. Query the Veilid DHT using the identifier as the key
3. Retrieve the DID Document from the DHT
4. Verify the document's cryptographic signature
5. Return the validated DID Document
```

## Implementation Details

### System Components

Our implementation consists of several key components:

1. **Veilid Core Integration**: Direct integration with the Veilid network for DHT operations and cryptographic functions.

2. **DID Manager**: Handles the creation, updating, and deactivation of DIDs.

3. **Resolver**: Implements the resolution process to retrieve DID Documents from the DHT.

4. **Cryptographic Module**: Manages key generation, signing, and verification operations.

5. **Storage Interface**: Provides abstraction for storing private keys and other sensitive data.

### Key Management

Secure key management is critical for the `did:vld` method:

1. **Key Generation**: Uses Veilid's cryptographic primitives to generate secure keypairs.

2. **Key Storage**: Private keys are stored in secure, encrypted storage with appropriate access controls.

3. **Key Rotation**: Supports seamless key rotation while maintaining identity continuity.

4. **Recovery Mechanisms**: Implements multiple recovery options including social recovery and backup keys.

### Privacy Enhancements

Our implementation includes several privacy-enhancing features:

1. **Pairwise DIDs**: Generates different DIDs for different relationships to prevent correlation.

2. **Minimal Disclosure**: DID Documents contain only necessary information.

3. **Encrypted Storage**: All sensitive data in the DHT is encrypted.

4. **Anonymous Resolution**: DHT queries are routed through multiple nodes to obscure the requester's identity.

## Code Examples

### Creating a did:vld Identifier

```javascript
// Example code for creating a did:vld identifier

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

### Resolving a did:vld Identifier

```javascript
// Example code for resolving a did:vld identifier

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

## Integration with Applications

### Authentication Flow

Applications can use `did:vld` for authentication:

1. **Challenge-Response**: The application generates a random challenge.
2. The user signs the challenge with their private key.
3. The application resolves the user's DID Document and verifies the signature.
4. Upon successful verification, the user is authenticated.

### Secure Messaging

The `did:vld` method integrates with secure messaging systems:

1. **DID-Based Addressing**: Messages are addressed to DIDs rather than traditional identifiers.
2. **End-to-End Encryption**: Messages are encrypted using the recipient's public key.
3. **Signature Verification**: Message signatures are verified using the sender's DID Document.
4. **Non-Repudiation**: Cryptographic signatures provide proof of message origin.

### Verifiable Credentials

Our implementation supports verifiable credentials:

1. **Issuance**: Credentials are issued by signing claims with the issuer's private key.
2. **Verification**: Recipients can verify credentials by resolving the issuer's DID.
3. **Selective Disclosure**: Credentials support zero-knowledge proofs for privacy-preserving verification.

## Conclusion

The `did:vld` method leverages Veilid's distributed architecture to provide a secure, private, and resilient foundation for decentralized identifiers. By using the Veilid DHT as a resolver and incorporating strong cryptographic proofs, this method enables verifiable digital identities while maintaining privacy through features like pairwise DIDs.

Our implementation satisfies the cryptographic verifiability, privacy, and trust-model requirements while remaining lightweight enough for real-time agent needs. The combination of Blake3 hashing for method-specific IDs and DHT-based resolution creates a robust system for managing digital identities in a decentralized environment.
