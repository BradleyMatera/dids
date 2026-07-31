---
title: Adoption reality
description: A measured view of deployed products, exchange standards, public-sector wallets, and the gap between credential adoption and universal DID adoption.
section: Reference
status: analysis
source_path: docs/adoption/index.md
---

Digital credential infrastructure has moved beyond research, but adoption is uneven and does not always use DIDs. Track DID methods, credential formats, exchange protocols, wallets, and trust frameworks separately.

<div class="callout">
  <p><strong>The accurate 2026 position:</strong> verifiable credential products and wallet programs are real; interoperable exchange specifications have matured; DID Core is standardized; no single DID method, wallet, or trust model has become universal.</p>
</div>

## What is concrete

### Stable W3C foundations

- DID Core 1.0 has been a W3C Recommendation since July 19, 2022.
- Verifiable Credentials Data Model 2.0 became a W3C Recommendation on May 15, 2025.
- Related Data Integrity and JOSE/COSE securing specifications reached W3C Recommendation status in May 2025.

These standards provide common models. Products still choose methods, cryptosuites, exchange protocols, credential profiles, status mechanisms, and governance.

### Final OpenID exchange specifications

OpenID for Verifiable Credential Issuance 1.0 defines an OAuth-protected issuance API. OpenID for Verifiable Presentations 1.0 defines how verifiers request and receive credentials. Both are format-flexible; they are not restricted to W3C VC or DID-based systems.

That matters because exchange interoperability is a separate problem from identifier syntax.

### Microsoft Entra Verified ID

Microsoft's current documentation describes Entra Verified ID as an issuance and verification service for W3C verifiable credentials signed with `did:web`.

This is evidence of a commercial DID/VC implementation. It is not evidence that every Entra identity flow uses DIDs or that the wider market has selected one architecture.

### EU Digital Identity Wallet

The European Digital Identity Framework entered into force in May 2024, and the European Commission states that Member States must provide at least one EU Digital Identity Wallet by the end of 2026 under common specifications.

Treat this as major wallet and digital-credential adoption. Do not casually label the entire EUDI architecture a DID deployment: its profiles include multiple formats and protocols, and regulatory trust is central to the system.

## Adoption layers

| Layer | Maturity signal | Fragmentation that remains |
|---|---|---|
| Identifier data model | DID Core 1.0 Recommendation | Many methods and trust models |
| Credential data model | VC Data Model 2.0 Recommendation | W3C VC, SD-JWT VC, ISO mdoc, profiles |
| Issuance | OpenID4VCI 1.0 | Wallet/issuer profiles and assurance |
| Presentation | OpenID4VP 1.0 | Request syntax, formats, verifier policy |
| Wallets | Government and commercial programs | Certification, portability, recovery, platform control |
| Trust | Sector and jurisdiction frameworks | No universal issuer registry |
| Status | Several privacy/cost approaches | Online dependency and correlation tradeoffs |
| DID resolution | Active W3C specification work | Driver coverage and method-specific behavior |

## Sector patterns

### Workforce and account recovery

Credentials can support employee onboarding, contractor eligibility, access recovery, and verified attributes. The hard parts are identity proofing, issuer governance, HR lifecycle, and fallback, not only signature verification.

### Education

Diplomas and certifications are natural portable-credential cases. Adoption depends on institutional trust, transcript detail, correction, long-term verification, and accessible alternatives.

### Government identity

Government wallets operate under legislation, certification, approved issuers, and assurance rules. Their success should not be generalized into “self-sovereign identity replaces government.”

### Supply chain and devices

Signed product, component, and compliance claims can cross organizations. Existing PKI, GS1 identifiers, device certificates, and sector databases remain important alternatives or companions.

### AI and software agents

Interest is growing, but a DID establishes only a controller/key relationship. Agent authority, runtime integrity, model provenance, and output correctness require separate evidence.

## Historical names need context

Older decentralized-identity writing often treats projects such as uPort/Serto or Sovrin as if their early position directly describes the 2026 landscape. Some technologies evolved, changed stewardship, narrowed focus, or lost prominence.

A credible adoption page should:

- use current product documentation;
- separate active products from historical influence;
- include source dates;
- avoid market-size forecasts without methodology;
- avoid predicting that a percentage of Fortune 500 companies “will” adopt a technology.

## How to evaluate a claimed deployment

Ask:

1. Which credential format and version?
2. Which DID method, if any?
3. Which issuance and presentation protocol?
4. Which wallet implementations?
5. Which issuer and verifier trust framework?
6. What is in production versus pilot or preview?
7. How are status, recovery, accessibility, and support handled?
8. Are independent implementations interoperating?
9. Who can suspend, revoke, or exclude participants?
10. What metrics are published, and can they be verified?

## Primary adoption references

- [Microsoft Entra Verified ID overview](https://learn.microsoft.com/en-us/entra/verified-id/decentralized-identifier-overview)
- [OpenID4VCI 1.0](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
- [OpenID4VP 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [European Digital Identity policy](https://digital-strategy.ec.europa.eu/en/policies/eudi-regulation)
- [EUDI Wallet reference implementation](https://digital-strategy.ec.europa.eu/en/policies/eudi-wallet-implementation)

See the [standards tracker]({{ '/future/' | relative_url }}) for exact publication stages.
