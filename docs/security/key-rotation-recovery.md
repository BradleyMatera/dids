# Key Rotation and Recovery Flow



This document outlines the key rotation and recovery mechanisms for the `did:vld` method, providing a comprehensive approach to maintaining security and continuity of decentralized identifiers.

## 1. Introduction

Key management is a critical aspect of any DID method. The `did:vld` method implements robust key rotation and recovery mechanisms to address two essential requirements:

1. **Key Rotation**: The ability to update cryptographic keys periodically or in response to potential compromise, while maintaining identity continuity.

2. **Key Recovery**: The ability to regain control of a DID after loss of access to the controlling keys.

These mechanisms form a closed loop that ensures the long-term viability and security of `did:vld` identifiers.

## 2. Key Rotation

### 2.1 Rotation Scenarios

Key rotation may be necessary in several scenarios:

1. **Routine Security Practice**: Regular rotation as a preventative security measure.
2. **Suspected Compromise**: Rotation in response to potential key compromise.
3. **Technology Updates**: Rotation to adopt newer cryptographic algorithms.
4. **Organizational Changes**: Rotation due to changes in key custodians or administrators.
5. **Regulatory Requirements**: Rotation to comply with security policies or regulations.

### 2.2 Rotation Process

The key rotation process for `did:vld` follows these steps:

1. **Generate New Keypair**: Create a new Veilid keypair for the DID.
2. **Retrieve Current DID Document**: Resolve the current DID Document from the Veilid DHT.
3. **Update DID Document**: Add the new verification method to the DID Document.
4. **Sign with Current Key**: Sign the updated document with the current private key.
5. **Publish Updated Document**: Store the updated document in the Veilid DHT.
6. **Transition Period**: Maintain both keys active during a transition period.
7. **Remove Old Key**: After the transition period, update the document again to remove the old key.

### 2.3 Implementation Example

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

### 2.4 Key Removal After Transition

After the transition period, the old key should be removed:

```javascript
async function removeOldKey(did, newPrivateKey, oldKeyId) {
  // Resolve the current DID Document
  const methodSpecificId = did.split(':')[2];
  const result = await veilid.dht.get(methodSpecificId);
  const currentDocument = JSON.parse(result.toString());
  
  // Filter out the old verification method and authentication reference
  const updatedDocument = {
    ...currentDocument,
    verificationMethod: currentDocument.verificationMethod.filter(
      vm => vm.id !== oldKeyId
    ),
    authentication: currentDocument.authentication.filter(
      auth => auth !== oldKeyId
    ),
    updated: new Date().toISOString()
  };
  
  // Remove the proof from the document before signing
  const { proof, ...documentWithoutProof } = updatedDocument;
  
  // Sign with the new private key
  const documentBytes = Buffer.from(JSON.stringify(documentWithoutProof));
  const signature = await veilid.crypto.sign(documentBytes, newPrivateKey);
  
  // Add the proof to the updated document
  const documentWithProof = {
    ...documentWithoutProof,
    proof: {
      type: "VeilidSignature2023",
      created: new Date().toISOString(),
      verificationMethod: updatedDocument.verificationMethod[0].id,
      proofPurpose: "assertionMethod",
      proofValue: base58btc.encode(signature)
    }
  };
  
  // Publish the updated document to the DHT
  await veilid.dht.put(
    methodSpecificId,
    Buffer.from(JSON.stringify(documentWithProof))
  );
  
  return {
    did,
    document: documentWithProof
  };
}
```

## 3. Key Recovery

### 3.1 Recovery Scenarios

Key recovery may be necessary in several scenarios:

1. **Lost Private Key**: The controller has lost access to their private key.
2. **Compromised Key**: The private key has been compromised and needs to be replaced.
3. **Hardware Failure**: Storage device containing the private key has failed.
4. **Organizational Changes**: Key custodian is no longer available.

### 3.2 Recovery Methods

The `did:vld` method supports multiple recovery mechanisms:

#### 3.2.1 Social Recovery

Social recovery involves designating trusted parties who can collectively authorize recovery operations:

1. **Setup Phase**:
   - Generate recovery keys for trusted parties
   - Add recovery verification methods to the DID Document
   - Define a threshold (M-of-N) for recovery authorization

2. **Recovery Phase**:
   - Collect signatures from the required number of trusted parties
   - Generate a new keypair
   - Update the DID Document with the new key
   - Sign with the collected recovery signatures

#### 3.2.2 Backup Keys

Backup keys are pre-generated and stored securely offline:

1. **Setup Phase**:
   - Generate backup keypair(s)
   - Add backup verification method(s) to the DID Document
   - Store backup private key(s) securely offline

2. **Recovery Phase**:
   - Retrieve the backup private key
   - Generate a new primary keypair
   - Update the DID Document with the new primary key
   - Sign with the backup private key

#### 3.2.3 Recovery Service

A trusted recovery service can assist in key recovery:

1. **Setup Phase**:
   - Register with a recovery service
   - Add the recovery service's verification method to the DID Document
   - Establish authentication mechanisms with the service

2. **Recovery Phase**:
   - Authenticate with the recovery service
   - Service generates a recovery signature
   - Generate a new keypair
   - Update the DID Document with the new key
   - Sign with the recovery service's signature

### 3.3 Implementation Example: Social Recovery

#### 3.3.1 Setup Phase

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

#### 3.3.2 Recovery Phase

```javascript
async function recoverWithSocialRecovery(did, recoverySignatures, newKeypair) {
  // Resolve the current DID Document
  const methodSpecificId = did.split(':')[2];
  const result = await veilid.dht.get(methodSpecificId);
  const currentDocument = JSON.parse(result.toString());
  
  // Verify that we have enough signatures to meet the threshold
  if (!currentDocument.recovery || 
      !currentDocument.recovery.threshold || 
      recoverySignatures.length < currentDocument.recovery.threshold) {
    throw new Error(`Insufficient recovery signatures. Need at least ${currentDocument.recovery.threshold}.`);
  }
  
  // Create a new verification method for the new key
  const newVerificationMethod = {
    "id": `${did}#primary-${Date.now()}`,
    "type": "VeilidVerificationKey2023",
    "controller": did,
    "publicKeyMultibase": base58btc.encode(newKeypair.publicKey)
  };
  
  // Update the DID Document with the new verification method
  // and remove the old primary key
  const updatedDocument = {
    ...currentDocument,
    verificationMethod: [
      newVerificationMethod,
      ...currentDocument.verificationMethod.filter(vm => 
        vm.type === "VeilidRecoveryKey2023"
      )
    ],
    authentication: [
      newVerificationMethod.id
    ],
    updated: new Date().toISOString()
  };
  
  // Remove the proof from the document before signing
  const { proof, ...documentWithoutProof } = updatedDocument;
  
  // Create a multi-signature proof
  const multiProof = {
    type: "VeilidMultiSignature2023",
    created: new Date().toISOString(),
    proofPurpose: "recovery",
    verificationMethod: recoverySignatures.map(rs => rs.verificationMethod),
    proofValue: recoverySignatures.map(rs => rs.proofValue)
  };
  
  // Add the multi-signature proof to the updated document
  const documentWithProof = {
    ...documentWithoutProof,
    proof: multiProof
  };
  
  // Publish the updated document to the DHT
  await veilid.dht.put(
    methodSpecificId,
    Buffer.from(JSON.stringify(documentWithProof))
  );
  
  return {
    did,
    newKeypair,
    document: documentWithProof
  };
}
```

### 3.4 Implementation Example: Backup Keys

#### 3.4.1 Setup Phase

```javascript
async function setupBackupKey(did, privateKey) {
  // Generate a backup keypair
  const backupKeypair = await veilid.crypto.generateKeypair();
  
  // Resolve the current DID Document
  const methodSpecificId = did.split(':')[2];
  const result = await veilid.dht.get(methodSpecificId);
  const currentDocument = JSON.parse(result.toString());
  
  // Add the backup verification method to the DID Document
  const backupVerificationMethod = {
    "id": `${did}#backup`,
    "type": "VeilidRecoveryKey2023",
    "controller": did,
    "publicKeyMultibase": base58btc.encode(backupKeypair.publicKey)
  };
  
  const updatedDocument = {
    ...currentDocument,
    verificationMethod: [
      ...currentDocument.verificationMethod,
      backupVerificationMethod
    ],
    recovery: {
      type: "BackupKey",
      verificationMethod: `${did}#backup`
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
  
  return {
    did,
    document: documentWithProof,
    backupKeypair
  };
}
```

#### 3.4.2 Recovery Phase

```javascript
async function recoverWithBackupKey(did, backupPrivateKey) {
  // Generate a new primary keypair
  const newKeypair = await veilid.crypto.generateKeypair();
  
  // Resolve the current DID Document
  const methodSpecificId = did.split(':')[2];
  const result = await veilid.dht.get(methodSpecificId);
  const currentDocument = JSON.parse(result.toString());
  
  // Verify that the document has a backup key recovery method
  if (!currentDocument.recovery || 
      currentDocument.recovery.type !== "BackupKey" ||
      !currentDocument.recovery.verificationMethod) {
    throw new Error("No backup key recovery method found in the DID Document.");
  }
  
  // Find the backup verification method
  const backupMethod = currentDocument.verificationMethod.find(
    vm => vm.id === currentDocument.recovery.verificationMethod
  );
  
  if (!backupMethod) {
    throw new Error("Backup verification method not found in the DID Document.");
  }
  
  // Create a new verification method for the new key
  const newVerificationMethod = {
    "id": `${did}#primary-${Date.now()}`,
    "type": "VeilidVerificationKey2023",
    "controller": did,
    "publicKeyMultibase": base58btc.encode(newKeypair.publicKey)
  };
  
  // Update the DID Document with the new verification method
  // and keep the backup key
  const updatedDocument = {
    ...currentDocument,
    verificationMethod: [
      newVerificationMethod,
      backupMethod
    ],
    authentication: [
      newVerificationMethod.id
    ],
    updated: new Date().toISOString()
  };
  
  // Remove the proof from the document before signing
  const { proof, ...documentWithoutProof } = updatedDocument;
  
  // Sign the updated document with the backup private key
  const documentBytes = Buffer.from(JSON.stringify(documentWithoutProof));
  const signature = await veilid.crypto.sign(documentBytes, backupPrivateKey);
  
  // Add the proof to the updated document
  const documentWithProof = {
    ...documentWithoutProof,
    proof: {
      type: "VeilidSignature2023",
      created: new Date().toISOString(),
      verificationMethod: backupMethod.id,
      proofPurpose: "recovery",
      proofValue: base58btc.encode(signature)
    }
  };
  
  // Publish the updated document to the DHT
  await veilid.dht.put(
    methodSpecificId,
    Buffer.from(JSON.stringify(documentWithProof))
  );
  
  return {
    did,
    newKeypair,
    document: documentWithProof
  };
}
```

## 4. Security Considerations

### 4.1 Transition Period Security

During key rotation, there is a transition period where both the old and new keys are valid. This period introduces security considerations:

1. **Compromise of Old Key**: If the old key is compromised during the transition period, an attacker could potentially update the DID Document to remove the new key.

2. **Revocation Timing**: The transition period should be long enough to allow relying parties to update their systems, but short enough to minimize the window of vulnerability.

3. **Notification Mechanisms**: Systems should be in place to notify relying parties of key rotations.

### 4.2 Recovery Method Security

Each recovery method has its own security considerations:

1. **Social Recovery**:
   - Collusion risk among trusted parties
   - Availability of trusted parties when recovery is needed
   - Secure distribution and storage of recovery keys

2. **Backup Keys**:
   - Secure storage of backup private keys
   - Risk of backup key compromise
   - Regular verification of backup key accessibility

3. **Recovery Service**:
   - Dependency on the continued operation of the service
   - Authentication security for recovery requests
   - Potential centralization risks

### 4.3 Verification and Logging

To enhance security and auditability:

1. **Recovery Logging**: All recovery operations should be logged with appropriate metadata.
2. **Verification Steps**: Implement verification steps to confirm the legitimacy of recovery requests.
3. **Notification Systems**: Notify the DID controller through secondary channels when recovery operations are performed.

## 5. Best Practices

### 5.1 Key Rotation

1. **Regular Schedule**: Establish a regular key rotation schedule based on security requirements.
2. **Automation**: Automate key rotation processes where possible to reduce human error.
3. **Testing**: Test key rotation procedures regularly to ensure they work when needed.
4. **Documentation**: Maintain clear documentation of key rotation procedures and history.

### 5.2 Recovery Preparation

1. **Multiple Methods**: Implement multiple recovery methods for redundancy.
2. **Regular Testing**: Periodically test recovery procedures to ensure they work.
3. **Secure Storage**: Store recovery materials (backup keys, recovery instructions) securely.
4. **Clear Instructions**: Provide clear instructions for recovery procedures to all relevant parties.

### 5.3 User Experience

1. **Simplicity**: Make key rotation and recovery processes as simple as possible for users.
2. **Education**: Educate users about the importance of key management and recovery options.
3. **Guidance**: Provide step-by-step guidance during recovery processes.
4. **Verification**: Implement user-friendly verification steps to prevent unauthorized recovery.

## 6. Conclusion

The key rotation and recovery mechanisms described in this document provide a comprehensive approach to maintaining the security and continuity of `did:vld` identifiers. By implementing these mechanisms, the `did:vld` method satisfies the cryptographic verifiability, privacy, and trust-model requirements while ensuring that users can maintain control of their identifiers over time.

The combination of regular key rotation, multiple recovery options, and secure implementation practices creates a closed loop that addresses the full lifecycle of cryptographic keys. This approach ensures that the Veilid layer can provide a robust foundation for decentralized identity systems that meet the needs of both individual users and organizations.
