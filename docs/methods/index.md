# DID Methods: Variants and Trust Models



This document provides an in-depth overview of various Decentralized Identifier (DID) methods, detailing their structures, underlying trust models, use cases, advantages, limitations, and key implementation considerations. As decentralized identity solutions continue to evolve, understanding the nuances of each DID method is crucial for selecting the right approach based on application requirements such as privacy, scalability, cost, and security.

---

## Table of Contents

- [did:web](#didweb)
- [did:ion](#didion)
- [did:ethr](#didethr)
- [did:key](#didkey)
- [did:jwk](#didjwk)
- [did:pkh](#didpkh)
- [did:sov and did:indy](#didsov-and-didindy)
- [did:peer](#didpeer)
- [did:vld](#didvld)
- [Other Notable Methods](#other-notable-methods)
- [Choosing the Right Method](#choosing-the-right-method)

---

## did:web

**Overview:**  
The did:web method leverages standard web infrastructure to host and resolve a DID Document. A did:web identifier is generated from a domain name—optionally with additional path segments—that points to a web resource where the corresponding DID Document is published. This method is highly accessible because it builds on the web’s well-established trust model.

**Format Example:**  
- Simple identifier: `did:web:example.com`
- User-specific identifier: `did:web:example.com:users:alice`

**Strengths:**  
- **Ease of Adoption:** Organizations can use their existing web hosting setup to publish DID Documents.
- **Cost-Effective:** No additional fees such as transaction costs are required since no blockchain is involved.
- **Human-Friendly:** The identifiers are intuitive and resemble domain names, which enhances trust and readability.

**Limitations:**  
- **Centralization Risks:** Relies on DNS and HTTPS infrastructures, which may be subject to attacks (e.g., DNS hijacking) or misconfigurations.
- **Privacy Concerns:** The use of recognizable domain names can reveal organizational or personal details.
- **Dynamic Updates:** The update and revocation process depends on conventional web hosting practices, lacking the inherent immutability provided by blockchain anchoring.

*Additional Considerations:*  
Despite its limitations, did:web is excellent for initial deployments and for use cases where a high level of decentralization is not strictly required. It is ideal for web-based applications where convenience and cost-effectiveness are top priorities.

---

## did:ion

**Overview:**  
did:ion is built on the Sidetree protocol and leverages the Bitcoin blockchain for anchoring operations. By batching DID operations and storing DID Document payloads off-chain (typically using systems like IPFS), did:ion provides a scalable and secure mechanism for managing DIDs on a public and permissionless network.

**Format:**  
- The DID appears as a long, encoded string (e.g., `did:ion:EiD_soON...`), which contains embedded cryptographic and operational data.

**Strengths:**  
- **High Security:** Anchored to the immutability and broad consensus of the Bitcoin network.
- **Scalability:** Utilizes batched operations, reducing the per-DID transaction overhead.
- **Decentralized Trust:** Operates in a fully permissionless environment, making it resistant to centralized control.

**Limitations:**  
- **Complexity:** The resolution process can be computationally intensive due to the need to parse large, batched operations.
- **Dependency Requirements:** Relies on external caching and decentralized storage systems for efficient resolution.

*Additional Considerations:*  
did:ion is particularly well-suited for large-scale applications where high security and decentralization are paramount, and where the extra complexity is justifiable by the stringent trust requirements.

---

## did:ethr

**Overview:**  
did:ethr anchors identifiers on the Ethereum blockchain, often using Ethereum addresses as the basis for the DID. A smart contract may serve as a registry for managing the associated public keys and enabling DID updates.

**Format Example:**  
- Basic: `did:ethr:0xABC123...`
- With network specification: `did:ethr:rinkeby:0xABC123...`

**Strengths:**  
- **Direct Integration:** Tightly connected to Ethereum wallet addresses, making it natural for applications in the blockchain and DeFi sectors.
- **Wide Adoption:** Has a strong user base within the Ethereum ecosystem, leading to rich developer support and tooling.

**Limitations:**  
- **Transaction Fees:** Updating a DID (e.g., key rotation) incurs gas fees on Ethereum.
- **Privacy Exposure:** Public Ethereum addresses are inherently visible and can be correlated with on-chain activities.

*Additional Considerations:*  
did:ethr is a good choice for applications that already use Ethereum for payments or smart contract interactions, though developers must weigh the cost and privacy implications.

---

## did:key

**Overview:**  
The did:key method creates a self-contained DID where the unique identifier is derived directly from a cryptographic public key. No external registries or network interactions are required, making this method extremely fast and simple.

**Format Example:**  
- `did:key:z6Mkw...ABC123`

**Strengths:**  
- **Simplicity and Speed:** The DID Document is computed directly from the public key, enabling immediate resolution.
- **Self-Sovereignty:** Completely independent of any external service providers.
- **Ideal for Testing and Ephemeral Identities:** Excellent for environments where simplicity is more important than mutability.

**Limitations:**  
- **Immutability:** The DID is permanently tied to the original cryptographic key, and there is no built-in mechanism for key rotation.
- **Limited Functionality:** Only supports a single key as an authentication mechanism, without additional profile data or services.

*Additional Considerations:*  
did:key is perfect for low-stakes, short-lived interactions and for scenarios where the overhead of a full DID method is not warranted.

---

## did:jwk

**Overview:**  
The did:jwk method embeds a JSON Web Key (JWK) directly into the DID, supporting seamless interoperability with systems that use JOSE (JSON Object Signing and Encryption) frameworks. This method offers deterministic conversion from a JWK to a DID.

**Format Example:**  
- The DID includes a base-encoded JWK, making the entire identity self-contained.

**Strengths:**  
- **Interoperability:** Naturally fits into ecosystems that use JSON-based security standards (e.g., JWT).
- **Deterministic Generation:** A consistent transformation process from JWK to DID ensures reproducibility.

**Limitations:**  
- **Static Structure:** As with did:key, key rotation is not supported, limiting its utility in dynamic security environments.
- **Limited Extensibility:** It is primarily designed for simple identities without complex service endpoints.

*Additional Considerations:*  
did:jwk is ideally suited to environments where JOSE standards are prevalent, such as in many web API authentication scenarios.

---

## did:pkh

**Overview:**  
The did:pkh method represents blockchain account addresses as DIDs using a public key hash approach. It is defined through standards like CIP-79 and is ledger-agnostic, allowing it to be used across multiple blockchain environments.

**Format Example:**  
- `did:pkh:eth:0xABC123...`  
Here, “eth” denotes the blockchain namespace (e.g., Ethereum), followed by the full blockchain account address.

**Strengths:**  
- **Ecosystem Bridging:** Directly integrates with existing blockchain account infrastructures.
- **Deterministic Verification:** Enables straightforward verification through signature checks against the underlying blockchain account.

**Limitations:**  
- **Static Identifiers:** Typically, these DIDs are “burner” identifiers without supportive mechanisms for updates.
- **Limited Functionality:** Focuses primarily on identity verification without additional profile or service data.

*Additional Considerations:*  
did:pkh is suitable for scenarios where existing blockchain addresses must be integrated into a decentralized identity framework without necessitating a separate identity system.

---

## did:sov and did:indy

**Overview:**  
Based on the Sovrin/Indy ecosystem, these DID methods are used within permissioned self-sovereign identity systems. They generate compact, base58–encoded DIDs that can support rich DID Documents with multiple keys and services.

**Format Example:**  
- `did:sov:21-22CharacterString`
- Alternatively, `did:indy:<network>:<nym>`

**Strengths:**  
- **Rich DID Documents:** Support complex configurations with multiple authentication methods and service endpoints.
- **Trusted Ecosystems:** Often employed in government and enterprise pilots where trusted stewards manage the network.

**Limitations:**  
- **Permissioned Infrastructure:** Writing to the underlying ledger typically involves governance procedures and onboarding, making it less open than permissionless systems.
- **Public Exposure Concerns:** While secure, the method requires careful governance to maintain privacy and prevent misuse.

*Additional Considerations:*  
These methods are best suited to environments requiring strong trust frameworks and where issuers are known, such as in regulated identity environments.

---

## did:peer

**Overview:**  
did:peer is designed for direct, peer-to-peer scenarios where identities are generated and exchanged locally. It is ideal for off-ledger, temporary, or confidential communications where no public record of the DID is desired.

**Format Example:**  
- The identifier encodes a representation of the DID Document itself within the string.

**Strengths:**  
- **Privacy-Preserving:** There is no public registry, so identities are only shared among communicating parties.
- **Ideal for Secure Communication:** Particularly effective when used in DIDComm scenarios or direct device-to-device interactions.

**Limitations:**  
- **Limited Discoverability:** Since the DID is not published, it cannot be resolved by external parties; it works only in established pairs.
- **Context Dependency:** Loss of local storage or application context can lead to difficulties in identity recovery.

*Additional Considerations:*  
did:peer is best for situations requiring transient or highly confidential identity exchanges, such as in secure messaging or localized applications.

---

## did:vld

**Overview:**  
The did:vld method leverages the Veilid network, a privacy-focused distributed application platform, to create and manage DIDs. It uses Veilid's distributed hash table (DHT), cryptographic primitives, and decentralized architecture to provide a secure, private, and resilient foundation for decentralized identifiers.

**Format Example:**  
- `did:vld:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK`

**Strengths:**  
- **Decentralized Resolution:** Uses Veilid's DHT for resolving DIDs without central authorities.
- **Cryptographic Verification:** Leverages Blake3 hashing and Veilid's cryptographic primitives for secure verification.
- **Privacy-Preserving:** Supports pairwise DIDs to prevent correlation across contexts.
- **Resilient:** Distributed storage ensures high availability and fault tolerance.
- **Lightweight:** Efficient enough for real-time agent needs and resource-constrained devices.

**Limitations:**  
- **Ecosystem Dependency:** Relies on the Veilid network infrastructure for resolution.
- **Emerging Standard:** As a newer method, it has a smaller ecosystem of tools and implementations compared to more established methods.

*Additional Considerations:*  
The did:vld method is particularly well-suited for applications requiring strong privacy guarantees and resilient decentralized infrastructure. For detailed specifications, see the [did:vld Method Specification](did-vld.md), [Summary](did-vld-summary.md), and [Complete Reference](did-vld-complete-reference.md).

## Other Notable Methods

- **did:btcr:**  
  Leverages Bitcoin transaction data to create a DID. It is primarily experimental and serves as a proof-of-concept for blockchain anchoring.

- **Sidetree Variants (e.g., did:orb, did:elem):**  
  These methods are built on the Sidetree protocol but leverage different underlying technologies like Ethereum or IPFS, often optimized for specific performance or storage requirements.

- **Additional Ledger-Specific Methods:**  
  Emerging methods such as did:sol (for Solana), did:cosmos, did:ont, did:eos, did:cheqd, did:kilt, did:jolo, did:work, and did:ebsi address the unique needs of their respective blockchain or distributed environments while balancing decentralization, cost, and feature sets.

*Additional Considerations:*  
New DID methods continue to emerge as blockchain and decentralized technology ecosystems mature. It is important to monitor evolving standards and community consensus regarding these implementations.

---

## Choosing the Right Method

When selecting a DID method, consider the following factors:
- **Decentralization Requirements:**  
  Is an immutable, permissionless ledger necessary, or is convenience through established web infrastructure acceptable?
- **Privacy Considerations:**  
  Should the identifier maintain strong pseudonymity, or is a human-readable domain advantageous for trust?
- **Operational Costs:**  
  Are blockchain transaction fees and potential network costs acceptable, or is a fee-free method like did:web preferable?
- **Update and Flexibility Needs:**  
  Does your application require key rotation, dynamic updates, or support for multiple authentication methods?
- **Ecosystem Alignment:**  
  Select a method that fits the target environment—whether it’s Ethereum-based (did:ethr), uses Bitcoin’s security model (did:ion), or needs the simplicity of did:key for testing or ephemeral interactions.

*Decision-Making Example:*  
For an enterprise identity system needing robust key management and update capabilities, did:ethr or did:sov might be preferable despite higher costs due to transaction fees. Conversely, for a privacy-focused web application with minimal overhead, did:web or did:key could be the better option.

---

This document highlights the trade-offs inherent in each DID method and provides guidance for choosing the optimal approach based on your specific application requirements. By understanding these variants and their respective models of trust, implementers can better design a decentralized identity solution that is both secure and well-suited to their operational context.
