# Contributing

This project accepts factual corrections, source updates, accessibility fixes, design improvements, and reviewable research proposals.

## Factual corrections

Include:

1. the page and exact claim;
2. why it is incorrect, outdated, or misleading;
3. a primary source;
4. the source's publication date and standards stage;
5. replacement wording.

Prefer W3C, OpenID Foundation, DIF, official Veilid documentation/source, official product documentation, specifications, test suites, and reproducible code.

## Evidence rules

- A specification is not an implementation.
- A registry entry is not an endorsement.
- Pseudocode is not a passing test.
- A unit test against a mock is not a network integration test.
- A signature is not identity proofing.
- A DID is not a credential.
- A privacy control is not a measured privacy result.
- A pilot is not broad adoption.

Label work as a standard, draft, explainer, analysis, proposal, design, or test plan.

## `did:vld` proposals

State:

- the problem being solved;
- affected method requirement;
- Veilid version and API/source reference;
- security and privacy assumptions;
- serialization and cryptographic behavior;
- failure and migration behavior;
- tests and test vectors;
- compatibility impact.

Do not call a proposal production-ready.

## Site changes

- Keep navigation in `docs/_data/navigation.yml`.
- Add front matter with `title`, `description`, `section`, `status`, and `source_path`.
- Use extensionless internal site routes ending in `/`.
- Make interactive controls keyboard accessible.
- Check dark and light themes and widths from 320px upward.
- Do not add external font, analytics, or script dependencies without a privacy and availability reason.
- Run `npm test`.

## Pull requests

Keep each pull request focused. Explain what changed, why, how it was verified, and whether any factual status or maturity label changed.
