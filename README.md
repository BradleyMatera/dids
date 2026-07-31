# DID Field Guide

A standards-first field guide to decentralized identifiers (DIDs), method tradeoffs, security, implementation patterns, and an experimental Veilid-backed DID method proposal.

**Read the published guide:** [bradleymatera.github.io/dids](https://bradleymatera.github.io/dids/)

## Start here

- [DIDs, clearly](https://bradleymatera.github.io/dids/overview/) — the core model in ten minutes
- [Project status](https://bradleymatera.github.io/dids/status/) — what exists, what is proposed, and what is missing
- [Compare DID methods](https://bradleymatera.github.io/dids/methods/) — trust and lifecycle tradeoffs
- [Security and privacy](https://bradleymatera.github.io/dids/security/) — threats and deployment controls
- [`did:vld` proposal](https://bradleymatera.github.io/dids/methods/did-vld/) — the experimental Veilid research track

## Important project status

`did:vld` is a research proposal. It is:

- not listed in the W3C DID Methods registry as of July 31, 2026;
- not an official Veilid Foundation specification;
- not implemented by a resolver in this repository;
- not supported by executable DHT integration tests here;
- not production-ready.

The repository contains documentation, design analysis, a schema sketch, and a resolver test plan. See the [full evidence inventory](https://bradleymatera.github.io/dids/status/).

## Why the repository was rebuilt

The original documentation mixed established standards, conceptual examples, and unimplemented Veilid work. Several pages described imagined tests and privacy results as completed engineering. The 2026 overhaul:

- separates standards, drafts, analysis, proposals, designs, and test plans;
- removes unsupported metrics and production-readiness claims;
- consolidates duplicated `did:vld` pages;
- uses current primary sources;
- replaces the default GitHub Pages theme with a responsive documentation system;
- adds structured navigation, full-text search, page outlines, source metadata, dark/light themes, and accessible mobile behavior;
- keeps GitHub as the source and contribution layer instead of using repository links as the site's information architecture.

## Documentation map

```text
docs/
├── overview/          Core DID mental model
├── methods/           Method comparison and did:vld proposal
├── security/          Threat model, correlation, rotation, recovery
├── implementations/   Build path, WebRTC pattern, Veilid design, test plan
├── applications/      AI, education, IoT, and secure messaging
├── adoption/          Current deployment reality
├── future/            Standards tracker and outlook
├── reference/         Primary sources and glossary
├── status/            Evidence and maturity inventory
├── _layouts/          Jekyll page templates
├── _includes/         Shared navigation, icons, and footer
├── _data/             Central navigation model
└── assets/            Design system and client-side behavior
```

## Local validation

The published site is built by GitHub Pages from `docs/`.

Run the repository checks:

```bash
npm test
```

For a Jekyll preview, install Ruby and Bundler, then:

```bash
bundle install
bundle exec jekyll serve --source docs --baseurl /dids
```

Open `http://127.0.0.1:4000/dids/`.

## Contributing

Factual corrections are welcome. Include the exact page and claim, a primary source, the source's publication/status date, and a proposed correction.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Use the issue templates for factual corrections or `did:vld` research proposals.

## Primary references

- [W3C DID Core 1.0](https://www.w3.org/TR/did-core/)
- [W3C DID Core 1.1](https://www.w3.org/TR/did-1.1/)
- [W3C DID Resolution](https://www.w3.org/TR/did-resolution/)
- [W3C DID Methods](https://www.w3.org/TR/did-extensions-methods/)
- [W3C Verifiable Credentials Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [Veilid](https://veilid.com/)
- [Veilid source](https://gitlab.com/veilid/veilid)

## License

The research and documentation are licensed under [Creative Commons Attribution 4.0 International](LICENSE.md). Code used to render or validate the site is available under the same repository license unless a file states otherwise.
