# MimoVault — Wallet NFT Gallery · AI Curator

> A wallet, exhibited. Paste any address. Walk every NFT across five EVM chains as a private museum, with an AI curator narrating the catalogue.

**Live:** https://gyoomei.github.io/mimovault
**Built for:** Xiaomi MiMo 100T grant program
**Powered by:** Hermes Agent + Xiaomi MiMo V2.5 + Alchemy NFT API + Pollinations

## What it does

Most NFT viewers (OpenSea profile, Etherscan NFT tab) give you a silent grid — no taste signal, no narrative, no story behind the collection. **MimoVault treats each wallet as a curated exhibition.** A multi-stage agent pipeline normalizes the input, scans five chains in parallel, groups by collection, detects taste pattern, and commissions Xiaomi MiMo V2.5 to write the exhibition catalogue note in the voice of a museum, not a marketplace.

## Five-stage agent pipeline

| Stage | Agent | Function |
|-------|-------|----------|
| 1 | **ENS Resolver** | Normalizes any `0x...` or `.eth` input via public ENSData |
| 2 | **Multi-chain Scanner** | Alchemy NFT v3 across Ethereum, Base, Arbitrum, Polygon, Optimism — parallel |
| 3 | **Curator Agent** | Groups by collection, detects taste (CryptoArt / generative / PFP / 1-of-1 / photography), counts unique works |
| 4 | **Narrative Agent** | Xiaomi MiMo V2.5 via Pollinations writes 110-130 word catalogue note (literary, never marketing) |
| 5 | **Render Agent** | Masonry gallery, lazy-load images, modal artwork detail with OpenSea + explorer links |

## Key features

- **Free, no key, no signup, no signature.** Read-only end-to-end. Wallet never asked to sign.
- **Five EVM chains**: Ethereum, Base, Arbitrum, Polygon, Optimism. Spam filter applied.
- **AI curator**: Real Xiaomi MiMo V2.5 narrative per wallet, generated in real time.
- **Taste profile**: Predominant era · Primary medium · Native chain · Rarity signal — derived from ownership pattern.
- **Roman-numeral exhibition rooms**: Featured collections (≥4 works) get their own "gallery room" with section header.
- **Bilingual**: Auto-detect EN/ID from browser, manual toggle in nav.
- **Light + dark theme**: Light is the default (museum daylight); dark mode preserves the editorial register.
- **Single HTML + JS**: ~55 KB total. No build step. Deploys instantly to GitHub Pages.

## Aesthetic — Editorial Museum

Direction-A from `popular-web-designs` skill (museum / editorial photography portfolio):
- **Background**: warm cream `#fafaf5` (ink black `#0a0a08` in dark)
- **Accent**: warm gold `#b88a3a` (deep gold `#8c6420` for emphasis)
- **Typography**: Playfair Display (serif headlines), Inter (body), JetBrains Mono (labels)
- **Composition**: generous whitespace, italic emphasis, mono small-caps for didactic panels

Bold differentiator from 13 dark-mode mimo* siblings.

## Tech stack

- **Frontend**: vanilla JS + native fetch + CSS custom properties + masonry grid
- **NFT data**: [Alchemy NFT v3](https://docs.alchemy.com/reference/nft-api-quickstart) `getNFTsForOwner` (demo key, no signup)
- **ENS**: [ENSData public API](https://api.ensdata.net/)
- **AI narrative**: [Pollinations.ai](https://pollinations.ai/) → Xiaomi MiMo V2.5
- **Build with**: [Hermes Agent](https://hermes-agent.nousresearch.com/) (autonomous coding agent)
- **Audit**: Vercel Web Interface Guidelines (0 findings)

## Try it

```
https://gyoomei.github.io/mimovault/#vitalik.eth
https://gyoomei.github.io/mimovault/#0x6CC5F688a315f3dC28A7781717a9A798a59fDA7b   # punk6529
https://gyoomei.github.io/mimovault/#0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459   # pranksy (51K NFTs)
```

## Local dev

```bash
git clone https://github.com/gyoomei/mimovault
cd mimovault
python3 -m http.server 8000
open http://localhost:8000
```

No build step. Edit `index.html` + `app.js` and refresh.

## License

MIT — see [LICENSE](LICENSE).

## Credits

- Submitted to [Xiaomi MiMo 100T](https://huolinger010.github.io/mimoorbit/) grant program
- Part of the [mimo* portfolio](https://github.com/gyoomei?tab=repositories) — 13 sibling projects exploring multi-domain agentic patterns

---

*Built with Hermes Agent. Free. Read-only. No key.*
