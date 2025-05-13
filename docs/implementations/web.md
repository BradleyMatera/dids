# In-Depth Guide for did:web and WebRTC Integration

This document provides a comprehensive overview of integrating `did:web`—a decentralized identifier method based on standard web infrastructure—with WebRTC to facilitate secure, peer-to-peer communication in web applications. It covers core concepts, protocols, practical implementation using JavaScript, HTML, and WebRTC APIs, and advanced considerations for building robust, scalable, and secure systems. Whether you're a developer building decentralized applications or an architect designing secure communication solutions, this guide offers actionable insights and code examples to help you leverage the power of decentralized identity in real-time web interactions.

---

## Table of Contents

- [Introduction: The Power of Decentralized Communication](#introduction-the-power-of-decentralized-communication)
- [Overview of Decentralized Identifiers (DIDs) and did:web](#overview-of-decentralized-identifiers-dids-and-didweb)
  - [What is did:web?](#what-is-didweb)
  - [Key Advantages and Limitations](#key-advantages-and-limitations)
- [WebRTC Fundamentals: Enabling Real-Time Communication](#webrtc-fundamentals-enabling-real-time-communication)
  - [What is WebRTC?](#what-is-webrtc)
  - [Core Components of WebRTC](#core-components-of-webrtc)
- [Integration of did:web with WebRTC: A Synergistic Approach](#integration-of-didweb-with-webrtc-a-synergistic-approach)
  - [Why Combine did:web and WebRTC?](#why-combine-didweb-and-webrtc)
  - [Security and Authentication Considerations](#security-and-authentication-considerations)
- [Implementation using JavaScript, HTML, and WebRTC](#implementation-using-javascript-html-and-webrtc)
  - [Prerequisites and Setup](#prerequisites-and-setup)
  - [Architectural Overview](#architectural-overview)
  - [Step-by-Step Development Guide](#step-by-step-development-guide)
    - [1. Generating a did:web Identifier](#1-generating-a-didweb-identifier)
    - [2. Hosting and Resolving the did:web Document](#2-hosting-and-resolving-the-didweb-document)
    - [3. Establishing a WebRTC Peer Connection](#3-establishing-a-webrtc-peer-connection)
    - [4. Integrating DID-based Authentication into WebRTC Signaling](#4-integrating-did-based-authentication-into-webrtc-signaling)
  - [Example Code Snippets](#example-code-snippets)
- [Best Practices and Troubleshooting](#best-practices-and-troubleshooting)
- [Further Reading and Resources](#further-reading-and-resources)

---

## Introduction: The Power of Decentralized Communication

Decentralized Identifiers (DIDs) empower users, devices, and entities to create and manage identities without reliance on centralized authorities, fostering a user-centric model of trust and security. The `did:web` method leverages existing web infrastructure (DNS and HTTPS) to host and resolve DID Documents, making it an accessible and cost-effective approach for integrating decentralized identity into web applications. When combined with WebRTC—an open framework for real-time communication in browsers and mobile apps—it creates a powerful foundation for establishing secure, direct, and authenticated peer-to-peer (P2P) interactions.

This guide explains how to implement such an integration, enabling web applications to leverage cryptographically verifiable identities for real-time communication flows. By marrying `did:web` with WebRTC, developers can build systems where users authenticate each other using decentralized identities, establish encrypted communication channels, and interact without intermediaries—ideal for applications ranging from secure video conferencing to private data sharing in collaborative tools.

*Expanded Context:*  
The convergence of decentralized identity and real-time communication addresses critical needs in today’s digital landscape, where privacy breaches, identity theft, and centralized control pose significant risks. This integration not only enhances security but also aligns with the growing demand for user sovereignty and interoperability in web technologies, paving the way for a more trusted and open internet.

---

## Overview of Decentralized Identifiers (DIDs) and did:web

### What is did:web?

**did:web** is a DID method that utilizes conventional web hosting as its verifiable data registry, leveraging the ubiquitous infrastructure of DNS and HTTPS. A `did:web` identifier is derived from a domain name and optionally path segments, reflecting a hierarchical structure tied to web resources. For example:

- A simple organizational identifier: `did:web:example.com`
- A user-specific identifier: `did:web:example.com:users:alice`

The corresponding DID Document—a JSON or JSON-LD file containing public keys, authentication methods, and service endpoints—is hosted at a predictable URL derived from the DID. For instance:
- For `did:web:example.com`, the document might be at `https://example.com/.well-known/did.json`.
- For `did:web:example.com:users:alice`, it could be at `https://example.com/users/alice/did.json`.

This method delivers DID security properties (persistence, cryptographic verifiability) without requiring blockchain or distributed ledger systems, relying instead on the security guarantees of TLS and DNS.

*Further Detail:*  
The `did:web` method is defined by the W3C Credentials Community Group and is particularly suited for entities already operating web domains, as it builds on existing trust in web infrastructure while avoiding the complexity or cost of blockchain-based methods.

### Key Advantages and Limitations

**Advantages:**
- **Ease of Adoption:** Leverages existing web servers, domain ownership, and HTTPS standards, making it accessible to organizations with established online presences.
- **Cost-Effectiveness:** Typically incurs no additional costs beyond standard web hosting, unlike blockchain-based DID methods that may involve transaction fees.
- **Human-Friendly Identifiers:** Uses recognizable domain names, enhancing readability and trust compared to abstract cryptographic strings in other methods.

**Limitations:**
- **Centralization Risk:** Inherits security risks from DNS and TLS infrastructure, such as domain hijacking or certificate authority compromises, which could undermine DID integrity.
- **Limited Pseudonymity:** Domain names in the identifier may reveal organizational or personal details, reducing privacy compared to fully pseudonymous methods like `did:key`.
- **Update and Revocation Challenges:** Relies on web hosting practices for updates; lacks inherent immutability or tamper-evidence compared to on-chain registries, requiring additional safeguards.

*Added Perspective:*  
While `did:web` sacrifices some decentralization for practicality, it serves as an excellent entry point for organizations transitioning to decentralized identity systems, offering a balance of familiarity and innovation. It is particularly effective for web-centric applications where domain ownership already implies a level of trust.

---

## WebRTC Fundamentals: Enabling Real-Time Communication

### What is WebRTC?

WebRTC (Web Real-Time Communication) is an open-source project and set of APIs that enable real-time voice, video, and data sharing directly between browsers and mobile applications. Supported by major browsers like Chrome, Firefox, Safari, and Edge, WebRTC facilitates peer-to-peer (P2P) communication without the need for external plugins or proprietary software, making it a cornerstone of modern web-based collaboration tools.

*Key Features:*  
- Real-time audio and video streaming for conferencing or calls.
- Direct data exchange for file sharing, gaming, or collaborative editing.
- Cross-platform compatibility across web and native apps.

### Core Components of WebRTC

- **RTCPeerConnection:** The primary interface for managing P2P connections. It handles ICE (Interactive Connectivity Establishment) for NAT traversal, media exchange, and data channels, ensuring reliable connectivity even behind firewalls.
- **RTCDataChannel:** Enables direct, bidirectional data exchange between peers, ideal for non-media payloads like text chat, file transfers, or application-specific data.
- **MediaStream:** Manages audio and video streams, allowing capture from microphones/cameras and rendering to user interfaces.
- **Signaling Mechanism:** Although not defined by WebRTC itself, signaling is a critical process for exchanging Session Description Protocol (SDP) messages and ICE candidates to negotiate and establish connections. Signaling often uses WebSockets, HTTP, or other transport protocols.

*Further Explanation:*  
WebRTC operates on a P2P model where peers directly exchange data once connected, minimizing latency and server load. However, initial connection setup (signaling) often requires a server to facilitate discovery and negotiation, which introduces a potential point of vulnerability or centralization that DID-based authentication can address.

---

## Integration of did:web with WebRTC: A Synergistic Approach

### Why Combine did:web and WebRTC?

Integrating `did:web` with WebRTC creates a powerful synergy that enhances the security and trust of real-time communications:
- **Decentralized Identity Verification:** Peers can authenticate each other using cryptographically verifiable DID Documents, ensuring that communication partners are who they claim to be without relying on centralized identity providers.
- **Enhanced Trust Model:** Each peer can trust the authenticity of connection requests through DID-based digital signatures, mitigating risks of impersonation or man-in-the-middle (MitM) attacks during WebRTC signaling.
- **Secure Signaling Process:** Incorporating DID authentication into the signaling phase prevents unauthorized access to connection details, ensuring that only verified peers establish sessions.
- **Privacy and User Control:** DIDs enable users to control their identity disclosure, choosing which attributes or credentials to share during communication setup, aligning with self-sovereign identity principles.

*Use Case Example:*  
In a decentralized video conferencing app, users with `did:web` identifiers can authenticate each other before initiating a WebRTC call, ensuring that only invited participants join the session, even without a central server managing access.

### Security and Authentication Considerations

- **Verification Process:** Peers resolve each other’s `did:web` Documents from their respective domains to obtain public keys for signature verification and encryption. This process must be secure and resilient to DNS spoofing or server compromise.
- **DID-based Signature Mechanism:** Prior to or during WebRTC signaling, peers can sign messages (e.g., SDP offers, ICE candidates) using private keys corresponding to the public keys published in their `did:web` Document, providing proof of identity.
- **Integration Points:** Applications can embed DID resolution and verification within the WebRTC signaling server or use a decentralized signaling mechanism (e.g., via a P2P network or blockchain-based channel) to perform real-time authentication.
- **Key Management:** Secure storage and rotation of private keys are critical to prevent unauthorized use. Applications should leverage browser secure storage (e.g., IndexedDB with encryption) or hardware-backed key stores where available.
- **Trust in Web Infrastructure:** Since `did:web` relies on DNS and HTTPS, additional safeguards (e.g., DNSSEC, certificate transparency) should be considered to mitigate risks of domain or certificate tampering.

*Added Insight:*  
The integration addresses a key limitation of WebRTC—its lack of built-in identity verification—by layering DID-based authentication on top of the communication protocol. This creates a trust model where security is rooted in cryptographic identity rather than server control, aligning with the ethos of decentralization.

---

## Implementation using JavaScript, HTML, and WebRTC

### Prerequisites and Setup

To build a `did:web` and WebRTC integrated application, ensure the following are in place:
- **Web Server:** Required to host the `did:web` Document (e.g., Apache, NGINX, or a simple Node.js server). The server must support HTTPS for secure document delivery.
- **Modern Browser:** Must support WebRTC APIs (e.g., Chrome, Firefox, Edge, Safari) for real-time communication capabilities.
- **JavaScript Libraries:** Use libraries like `did-resolver` (for DID resolution) or custom code to fetch and process DID Documents. For WebRTC, native browser APIs are sufficient, though libraries like `simple-peer` can simplify implementation.
- **Signaling Server:** A basic WebSocket or HTTP server to exchange SDP messages and ICE candidates between peers during WebRTC connection setup. Alternatively, explore decentralized signaling options for full decentralization.
- **Cryptographic Tools:** Libraries or browser APIs (e.g., Web Crypto API) for key generation, signing, and verification to support DID-based authentication.

*Setup Tip:*  
For development, use local servers with self-signed certificates (ensuring HTTPS for WebRTC), but for production, secure a proper SSL/TLS certificate and domain for hosting `did:web` Documents.

### Architectural Overview

The architecture for integrating `did:web` with WebRTC involves several key components and flows:
1. **DID Setup and Hosting:** Each peer registers a `did:web` identifier and hosts its DID Document on a secure web server under a predictable URL path.
2. **DID Resolution Integration:** Client applications implement logic to resolve peer DIDs to fetch DID Documents containing public keys and service endpoints.
3. **WebRTC Connection Setup:** Peers initiate a WebRTC session using a signaling channel to exchange connection details (SDP offers/answers, ICE candidates).
4. **Authentication Layer:** Digital signatures tied to DIDs are embedded in signaling messages, verified using public keys from resolved DID Documents to ensure peer authenticity before establishing the connection.

*Diagram Concept (Textual Representation):*
```
[Peer A] <--> [Signaling Server] <--> [Peer B]
   | DID Resolution (fetch DID Doc)      | DID Resolution
   | Authenticate (sign/verify)          | Authenticate
   | WebRTC Connection Established <----> WebRTC Connection
```

*Further Explanation:*  
This architecture balances decentralization (via DIDs for identity) with practical necessities (e.g., signaling servers for WebRTC setup). Over time, fully decentralized signaling (e.g., using P2P networks or blockchain channels) could eliminate central points entirely.

### Step-by-Step Development Guide

#### 1. Generating a did:web Identifier

- **Define the Identifier Structure:** Choose a domain and optional path structure for the DID based on your web infrastructure (e.g., `did:web:example.com:users:alice` for a user-specific identifier).
- **Create a DID Document:** Construct a JSON or JSON-LD document containing the DID, public keys for verification/authentication, and optional service endpoints (e.g., for messaging or WebRTC signaling).

*Example DID Document (Simplified):*
```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:web:example.com:users:alice",
  "verificationMethod": [{
    "id": "did:web:example.com:users:alice#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:web:example.com:users:alice",
    "publicKeyMultibase": "z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH"
  }],
  "authentication": ["did:web:example.com:users:alice#key-1"],
  "service": [{
    "id": "did:web:example.com:users:alice#messaging",
    "type": "DIDCommMessaging",
    "serviceEndpoint": "https://example.com/users/alice/messaging"
  }]
}
```

*Note:* Generate the key pair securely (e.g., using Web Crypto API or a library like `@noble/ed25519`) and store the private key safely, as it will be used for signing.

#### 2. Hosting and Resolving the did:web Document

- **Hosting the DID Document:** Store the DID Document on a secure web server at a predictable URL derived from the DID. For `did:web:example.com:users:alice`, host it at `https://example.com/users/alice/did.json` or use the `.well-known` path for domain-level DIDs (e.g., `https://example.com/.well-known/did.json`).
- **Resolving a did:web Identifier:** Implement a resolution function in JavaScript to map the DID to its URL and fetch the document.

*Resolution Function Example:*
```javascript
// Function to resolve a did:web identifier to its DID Document
async function resolveDidWeb(did) {
  try {
    // Remove "did:web:" prefix and split into components
    const parts = did.replace("did:web:", "").split(":");
    let url = `https://${parts[0]}`;
    // Append path segments if they exist
    if (parts.length > 1) {
      url += "/" + parts.slice(1).join("/");
    }
    // Default to did.json at the path or use .well-known for root domain
    url += parts.length > 1 ? "/did.json" : "/.well-known/did.json";
    console.log(`Resolving DID Document from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch DID Document: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error resolving did:web ${did}:`, error.message);
    throw error;
  }
}

// Usage: Resolve a peer's DID Document
// const peerDidDoc = await resolveDidWeb("did:web:example.com:users:bob");
```

*Practical Tip:*  
Cache resolved DID Documents locally (e.g., in browser storage) to reduce network requests, but implement a refresh mechanism to handle key rotations or document updates.

#### 3. Establishing a WebRTC Peer Connection

- **Create an RTCPeerConnection:** Initialize a WebRTC peer connection to manage audio, video, or data channels between peers.
- **Set Up Signaling:** Use a signaling mechanism (e.g., WebSocket server) to exchange Session Description Protocol (SDP) offers/answers and ICE candidates for NAT traversal and connection setup.

*Basic WebRTC Setup Example:*
```javascript
// Initialize a WebRTC peer connection
function createPeerConnection(onIceCandidate, onDataChannel) {
  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Use public STUN server for NAT traversal
  };
  const peerConnection = new RTCPeerConnection(configuration);
  
  // Handle ICE candidate events (send to peer via signaling)
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };
  
  // Handle incoming data channel (for non-media data exchange)
  peerConnection.ondatachannel = (event) => {
    onDataChannel(event.channel);
  };
  
  return peerConnection;
}

// Create a data channel for messaging or file sharing
function createDataChannel(peerConnection, label) {
  const dataChannel = peerConnection.createDataChannel(label, {
    reliable: true // Ensure ordered, reliable delivery
  });
  return dataChannel;
}

// Usage: Set up a connection and data channel
// const pc = createPeerConnection(
//   (candidate) => signalingChannel.send(JSON.stringify({ type: 'ice', candidate })),
//   (channel) => console.log('Data Channel Established:', channel)
// );
// const chatChannel = createDataChannel(pc, 'chat');
```

*Further Detail:*  
For production, include TURN servers (in addition to STUN) in the ICE configuration to handle complex NAT scenarios, and implement robust error handling for connection failures.

#### 4. Integrating DID-based Authentication into WebRTC Signaling

- **Embed Signatures in Signaling:** When sending SDP offers, answers, or ICE candidates, include a digital signature of the message content using the sender’s private key tied to their `did:web` identifier.
- **Verify Signatures on Receipt:** On receiving a signaling message, resolve the sender’s `did:web` Document to obtain their public key, and verify the signature to confirm authenticity before processing the message.

*Authentication in Signaling Example:*
```javascript
// Function to send a signed signaling message
async function sendSignedSignalingMessage(message, senderDid, senderPrivateKey, signalingChannel) {
  // Convert message object to string for signing
  const messageString = JSON.stringify(message);
  // Sign the message using the sender's private key
  const signature = await signMessage(messageString, senderPrivateKey);
  // Include sender DID and signature in the payload
  const signedMessage = {
    did: senderDid,
    message: message,
    signature: encodeBase64Url(signature) // URL-safe encoding for transmission
  };
  // Send via signaling channel (e.g., WebSocket)
  signalingChannel.send(JSON.stringify(signedMessage));
  console.log(`Sent Signed Signaling Message from ${senderDid}`);
}

// Function to handle and verify incoming signaling messages
async function onSignalingMessage(event, signalingChannel) {
  try {
    const receivedData = JSON.parse(event.data);
    const { did, message, signature } = receivedData;
    // Resolve the sender's DID Document to get their public key
    const didDocument = await resolveDidWeb(did);
    const verificationMethod = didDocument.verificationMethod.find(vm => 
      didDocument.authentication.includes(vm.id)
    );
    if (!verificationMethod) {
      throw new Error("No suitable authentication key found in DID Document.");
    }
    const publicKey = decodeMultibase(verificationMethod.publicKeyMultibase);
    // Verify the signature on the message
    const messageString = JSON.stringify(message);
    const signatureBytes = decodeBase64Url(signature);
    const isValid = await verifySignature(messageString, signatureBytes, publicKey);
    if (!isValid) {
      console.error("Invalid signature. Discarding message from", did);
      return;
    }
    // Process the valid signaling message (e.g., SDP offer/answer, ICE candidate)
    console.log(`Verified Signaling Message from ${did}`);
    processSignalingMessage(message);
  } catch (error) {
    console.error("Error processing signaling message:", error.message);
  }
}

// Placeholder functions for cryptographic operations (to be implemented with Web Crypto API or library)
async function signMessage(message, privateKey) {
  // Implement signing using Web Crypto API or library like @noble/ed25519
  return new Uint8Array(64); // Placeholder for signature bytes
}

async function verifySignature(message, signature, publicKey) {
  // Implement verification
  return true; // Placeholder for demo
}

// Process the WebRTC signaling message
function processSignalingMessage(message) {
  // Handle SDP offers, answers, ICE candidates, etc.
  console.log("Processing WebRTC Signaling Message:", message);
  // Example: if (message.type === 'offer') { peerConnection.setRemoteDescription(new RTCSessionDescription(message)); }
}
```

*Implementation Note:*  
Actual cryptographic operations should use the Web Crypto API (`crypto.subtle`) or libraries like `@noble/ed25519` for Ed25519 signing/verification. Ensure secure key storage (e.g., using browser's secure storage or prompting for key import) to prevent theft.

### Example Code Snippets

Below are simplified, integrated examples combining HTML and JavaScript to illustrate a basic `did:web` and WebRTC application.

- **HTML Setup (index.html):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DID Web & WebRTC Integration Demo</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    #status { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
    button { padding: 8px 16px; margin: 5px; cursor: pointer; }
    #chat-log { height: 200px; border: 1px solid #ddd; overflow-y: scroll; padding: 10px; margin-top: 10px; }
    #chat-input { width: 300px; padding: 5px; }
  </style>
</head>
<body>
  <h1>DID Web & WebRTC Demo</h1>
  <div id="status">Initializing...</div>
  <div>
    <label for="my-did">My DID:</label>
    <input type="text" id="my-did" readonly value="Not Set" style="width: 400px;">
    <button onclick="generateDidWeb()">Generate DID</button>
  </div>
  <div>
    <label for="peer-did">Peer DID:</label>
    <input type="text" id="peer-did" placeholder="Enter Peer DID (did:web:...)" style="width: 400px;">
    <button onclick="connectToPeer()">Connect</button>
  </div>
  <div>
    <h3>Chat:</h3>
    <div id="chat-log"></div>
    <input type="text" id="chat-input" placeholder="Type a message...">
    <button onclick="sendChatMessage()">Send</button>
  </div>
  <script src="app.js"></script>
</body>
</html>
```

- **JavaScript (app.js):**

```javascript
// Global variables for the demo
let myIdentity = null;
let peerConnection = null;
let dataChannel = null;
let signalingChannel = null;
const statusElement = document.getElementById('status');
const chatLogElement = document.getElementById('chat-log');

// Utility: Generate a UUID for unique IDs
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Step 1: Generate a did:web identifier (simplified for demo - in reality, host on actual domain)
async function generateDidWeb() {
  try {
    // Simulate key pair generation (placeholder)
    const keyPair = { publicKey: new Uint8Array(32), privateKey: new Uint8Array(64) };
    // For demo, use a placeholder domain (in practice, tied to actual domain)
    const did = `did:web:demo.example.com:users:${generateUUID().slice(0, 8)}`;
    myIdentity = { did, keyPair };
    document.getElementById('my-did').value = did;
    statusElement.textContent = `DID Generated: ${did}`;
    // Initialize signaling channel (e.g., WebSocket to a server)
    initializeSignalingChannel();
  } catch (error) {
    statusElement.textContent = `Error generating DID: ${error.message}`;
  }
}

// Step 2: Initialize signaling channel (placeholder for WebSocket connection)
function initializeSignalingChannel() {
  // In a real app, connect to a WebSocket server for signaling
  signalingChannel = {
    send: (data) => console.log("Sending via signaling channel (placeholder):", data),
    onmessage: (callback) => console.log("Signaling channel listener set (placeholder)")
  };
  statusElement.textContent = "Signaling Channel Initialized (Placeholder)";
}

// Step 3: Connect to a peer using their DID
async function connectToPeer() {
  try {
    const peerDid = document.getElementById('peer-did').value.trim();
    if (!peerDid || !peerDid.startsWith("did:web:")) {
      throw new Error("Invalid Peer DID. Must start with did:web:");
    }
    if (!myIdentity) {
      throw new Error("Generate your DID first.");
    }
    statusElement.textContent = `Connecting to ${peerDid}...`;
    
    // Resolve peer's DID Document (placeholder for demo)
    const peerDidDoc = await resolveDidWeb(peerDid);
    console.log("Resolved Peer DID Document (simulated):", peerDidDoc);
    
    // Create WebRTC peer connection
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    peerConnection = new RTCPeerConnection(configuration);
    
    // Handle ICE candidates (send to peer via signaling)
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignedSignalingMessage(
          { type: 'ice', candidate: event.candidate },
          myIdentity.did,
          myIdentity.keyPair.privateKey,
          signalingChannel
        );
      }
    };
    
    // Handle incoming data channel
    peerConnection.ondatachannel = (event) => {
      dataChannel = event.channel;
      setupDataChannel(dataChannel);
      statusElement.textContent = "Data Channel Established with Peer!";
    };
    
    // Create a data channel for chat
    dataChannel = peerConnection.createDataChannel('chat', { reliable: true });
    setupDataChannel(dataChannel);
    
    // Create and send an SDP offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendSignedSignalingMessage(
      { type: 'offer', sdp: offer },
      myIdentity.did,
      myIdentity.keyPair.privateKey,
      signalingChannel
    );
    statusElement.textContent = `Connection Offer Sent to ${peerDid}`;
  } catch (error) {
    statusElement.textContent = `Error connecting to peer: ${error.message}`;
  }
}

// Setup data channel event listeners
function setupDataChannel(channel) {
  channel.onopen = () => console.log("Data Channel Opened!");
  channel.onmessage = (event) => {
    const message = event.data;
    chatLogElement.innerHTML += `<p><strong>Peer:</strong> ${message}</p>`;
    chatLogElement.scrollTop = chatLogElement.scrollHeight;
  };
  channel.onclose = () => console.log("Data Channel Closed.");
}

// Send a chat message via the data channel
function sendChatMessage() {
  if (!dataChannel || dataChannel.readyState !== 'open') {
    statusElement.textContent = "Error: No active connection to send message.";
    return;
  }
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (message) {
    dataChannel.send(message);
    chatLogElement.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    chatLogElement.scrollTop = chatLogElement.scrollHeight;
    input.value = '';
  }
}

// Placeholder: Resolve did:web (simulated for demo)
async function resolveDidWeb(did) {
  // In a real app, fetch from the web endpoint
  return {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": did,
    "verificationMethod": [{
      "id": `${did}#key-1`,
      "type": "Ed25519VerificationKey2020",
      "controller": did,
      "publicKeyMultibase": "z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH"
    }],
    "authentication": [`${did}#key-1`],
    "service": [{
      "id": `${did}#messaging`,
      "type": "DIDCommMessaging",
      "serviceEndpoint": "https://demo.example.com/messaging"
    }]
  };
}

// Placeholder: Send signed signaling message (simulated)
async function sendSignedSignalingMessage(message, senderDid, senderPrivateKey, signalingChannel) {
  // In a real app, sign the message with the private key
  const signedMessage = {
    did: senderDid,
    message: message,
    signature: "placeholder-signature"
  };
  signalingChannel.send(JSON.stringify(signedMessage));
}
```

*Demo Limitation Note:*  
This code is a simplified demo with placeholder functions for DID resolution and cryptographic operations. In a production environment, implement actual DID resolution (fetching from web endpoints), secure key storage, and proper signing/verification using libraries like `@veramo/did-resolver` and Web Crypto API.

---

## Best Practices and Troubleshooting

- **Secure Hosting for DID Documents:** Ensure your `did:web` Document is hosted on a secure server with HTTPS enabled. Use strong TLS configurations (e.g., TLS 1.3, perfect forward secrecy) and monitor certificate validity to prevent MitM attacks. Consider DNSSEC to protect against domain spoofing.
- **Key Management Security:** Store private keys securely using browser APIs (e.g., `crypto.subtle` with non-exportable keys) or prompt users to import keys from secure storage. Implement key rotation policies and backup mechanisms to handle loss or compromise.
- **Error Handling for Robustness:** Implement comprehensive error handling for DID resolution failures (e.g., network issues, invalid documents) and WebRTC connection issues (e.g., NAT traversal failures). Provide user-friendly feedback for resolution or connection errors.
- **Testing Across Scenarios:** Thoroughly test the full signaling and communication flow, including edge cases like network interruptions, invalid signatures, or unsupported browsers. Simulate adversary scenarios (e.g., forged DIDs, MitM attempts) to validate security.
- **Performance Optimization:** Cache resolved DID Documents to minimize resolution latency during WebRTC setup, but implement a refresh mechanism (e.g., based on document expiration or periodic checks) to handle updates. Optimize WebRTC connections by selecting efficient codecs and minimizing ICE candidate exchanges.
- **Troubleshooting Common Issues:**
  - **DID Resolution Fails:** Check network connectivity, verify the DID Document URL is accessible, and ensure the server returns the correct MIME type (`application/json` or `application/ld+json`).
  - **WebRTC Connection Fails:** Verify ICE servers (STUN/TURN) are reachable, ensure signaling messages are exchanged correctly, and check browser WebRTC compatibility. Use browser developer tools to debug connection states.
  - **Authentication Errors:** Confirm signatures match the public keys in DID Documents, ensure clocks are synchronized for timestamp-based challenges, and log verification failures for analysis.

*Added Best Practice:*  
Implement logging for all DID resolution, authentication, and WebRTC connection events (while respecting user privacy) to facilitate debugging and monitoring. Use analytics to identify common failure points and improve user experience over time.

---

## Further Reading and Resources

- **DID Core Specification:** [W3C DID Core 1.0](https://www.w3.org/TR/did-core/) - The foundational standard for understanding DIDs and their data model.
- **did:web Specification:** [W3C Credentials Community Group - did:web](https://w3c-ccg.github.io/did-method-web/) - Detailed specification for the `did:web` method.
- **WebRTC Documentation:** [WebRTC.org](https://webrtc.org/) - Official resource for WebRTC concepts, APIs, and tutorials.
- **Cryptography in Browsers:** [MDN Web Docs on Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Guide to cryptographic operations in JavaScript for signing and verification.
- **DID Resolver Libraries:** [DID Resolver GitHub](https://github.com/decentralized-identity/did-resolver) - Open-source library for resolving various DID methods, including `did:web`.
- **WebRTC Samples and Tutorials:** [WebRTC Samples](https://webrtc.github.io/samples/) - Interactive examples demonstrating WebRTC capabilities for audio, video, and data channels.
- **Decentralized Identity Foundation (DIF):** [identity.foundation](https://identity.foundation/) - Community resources and working groups on DIDComm and related protocols for secure messaging.

*Additional Resource Tip:*  
Join community forums like the DIF Slack or W3C Credentials Community Group mailing lists to stay updated on `did:web` and WebRTC integration best practices, and to collaborate on solving implementation challenges.

---

This guide provides a detailed walkthrough to help you understand and implement `did:web` integrated with WebRTC. It covers the theoretical underpinnings, practical coding examples, and best practices for ensuring secure and reliable decentralized communications in web applications. By following these steps and leveraging the provided resources, developers can build innovative, trust-centric real-time communication solutions that empower users with control over their digital identities.
