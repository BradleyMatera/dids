# DID Methods: Variants and Trust Models

This document provides an in-depth overview of various Decentralized Identifier (DID) methods, detailing their structures, trust models, use cases, advantages, limitations, and implementation considerations. Understanding these differences is crucial for selecting the right DID method for your particular application needs.

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
- [Other Notable Methods](#other-notable-methods)
- [Choosing the Right Method](#choosing-the-right-method)

---

## did:web

**Overview:**  
The did:web method leverages standard web infrastructure for hosting DID Documents. The DID is generated based on a domain name and optional path segments.

**Format Example:**  
- `did:web:example.com`
- `did:web:example.com:users:alice`

**Strengths:**  
- **Ease of Adoption:** Uses existing web hosting services.
- **Cost-Effective:** No blockchain transactions needed.
- **Human-Friendly Identifiers:** Clearly resembles a domain name.

**Limitations:**  
- **Centralization Risks:** Relies on DNS and HTTPS security.
- **Privacy Concerns:** Identifiers can reveal organizational or personal details.
- **Dynamic Updates:** No inherent immutability like blockchain anchoring.

---

## did:ion

**Overview:**  
did:ion is built on the Sidetree protocol over the Bitcoin blockchain. It leverages batched operations anchored to Bitcoin and uses distributed storage (e.g., IPFS) for the DID Document payload.

**Format:**  
A long, encoded string representing the DID, e.g., `did:ion:EiD_soON...`

**Strengths:**  
- **High Security:** Leverages Bitcoin’s immutability.
- **Scalability:** Batch processing of DID operations.
- **Decentralized Trust:** Open permissionless system.

**Limitations:**  
- **Complexity:** Resolution process can be heavy.
- **Dependency:** Relies on external nodes and caches for fast resolution.

---

## did:ethr

**Overview:**  
did:ethr anchors DIDs on the Ethereum blockchain. It typically uses Ethereum addresses as the unique identifier, often accompanied by a smart contract acting as a registry.

**Format Example:**  
- `did:ethr:0xABC123...`
- With network specifics: `did:ethr:rinkeby:0xABC123...`

**Strengths:**  
- **Direct Integration:** Easy linkage with Ethereum wallet addresses.
- **Wide Adoption:** Popular among blockchain and DeFi communities.

**Limitations:**  
- **Transaction Fees:** Updates incur gas fees.
- **Privacy:** Public Ethereum addresses can contribute to linkage of on-chain activities.

---

## did:key

**Overview:**  
The did:key method creates a self-contained DID where the identifier is directly derived from a cryptographic public key. No external registries are required.

**Format Example:**  
- `did:key:z6Mkw...ABC123`

**Strengths:**  
- **Simplicity and Speed:** Resolver computes the DID Document on-the-fly.
- **Self-Sovereign:** No reliance on external systems.
- **Ideal for Testing and Ephemeral Identities.**

**Limitations:**  
- **Immutability:** The identifier is permanently tied to the original key; key rotation isn’t supported.
- **Limited Functionalities:** No support for additional authentication methods beyond the primary key.

---

## did:jwk

**Overview:**  
Similar to did:key, did:jwk encodes a JSON Web Key (JWK) into the DID itself. This method is tailored for interoperability with existing JOSE (JSON Object Signing and Encryption) standards.

**Format Example:**  
- Encodes a JWK as part of the DID string.

**Strengths:**  
- **Interoperability:** Aligns with JOSE/JWT ecosystems.
- **Deterministic:** Consistent transformation from JWK to DID.

**Limitations:**  
- **Static Nature:** Like did:key, it does not support key rotation.
- **Limited Extensibility:** Primarily for simple, self-contained identities.

---

## did:pkh

**Overview:**  
The did:pkh method represents blockchain account addresses as DIDs using a public key hash approach. It is defined via CIP-79 and is ledger-agnostic.

**Format Example:**  
- `did:pkh:eth:0xABC123...`  
Here "eth" denotes the blockchain namespace, and the address follows.

**Strengths:**  
- **Bridges Ecosystems:** Seamlessly integrates with existing blockchain accounts.
- **Deterministic Verification:** Proves identity via signature using the underlying blockchain account.

**Limitations:**  
- **Static Nature:** Typically “burner” identifiers with no facility for key rotation.
- **Feature-Limited:** Offers minimal profile management capabilities.

---

## did:sov and did:indy

**Overview:**  
These methods are based on the Sovrin/Indy framework commonly used in permissioned SSI systems. They often generate a compact, base58-encoded DID.

**Format Example:**  
- `did:sov:21-22CharacterString`
- or using the newer generic format: `did:indy:<network>:<nym>`

**Strengths:**  
- **Rich DID Documents:** Supports multiple keys and services with on-ledger update mechanisms.
- **Trusted Ecosystems:** Often used in government and enterprise pilots with known stewards.

**Limitations:**  
- **Permissioned Writing:** Requires onboarding procedures and governance structures.
- **Public Exposure:** Although the underlying ledger is secure, the system is not fully permissionless.

---

## did:peer

**Overview:**  
did:peer is designed for localized, peer-to-peer scenarios where identifiers are generated and exchanged directly between parties without public publication.

**Format Example:**  
- Typically includes a derivation of a JSON DID Document within the identifier itself.

**Strengths:**  
- **Privacy-Preserving:** No globally resolvable record.
- **Ideal for DIDComm:** Facilitates one-to-one, off-ledger secure communications.

**Limitations:**  
- **Limited Discovery:** Only known to exchanging parties; cannot be resolved by third parties.
- **Context Dependency:** Loss of contextual data (e.g., if an agent is uninstalled) means identity recovery is difficult.

---

## Other Notable Methods

- **did:btcr:**  
  Uses Bitcoin transaction references to create DIDs. It’s primarily a proof-of-concept method.

- **Sidetree Variants (e.g., did:orb, did:elem):**  
  These methods build on the Sidetree protocol (like did:ion) but use different underlying networks such as Ethereum and IPFS.

- **Additional Ledger-Specific Methods:**  
  Methods like did:sol, did:cosmos, did:ont, did:eos, did:cheqd, did:kilt, did:jolo, did:work, and did:ebsi each address unique blockchain or network needs, offering various trade-offs in decentralization, cost, and feature sets.

---

## Choosing the Right Method

When selecting a DID method, consider the following:
- **Decentralization needs:** Is an immutable, permissionless ledger required, or is convenience via existing web infrastructure acceptable?
- **Privacy Considerations:** Should the identifier be pseudonymous or can it leverage human-readable domains?
- **Cost:** Are blockchain transaction fees acceptable, or is a free alternative like did:web preferred?
- **Update Requirements:** Does your use case demand key rotation and comprehensive profile management?
- **Ecosystem Fit:** Choose methods that align with your target ecosystem (e.g., did:ethr for Ethereum-based applications).

This document provides a detailed comparison to help inform your decision in selecting the optimal DID method for your use case.
