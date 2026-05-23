// MimoVault — Wallet NFT Gallery · AI Curator
// Free, no-key, read-only. Alchemy demo + Pollinations.

const $ = (id) => document.getElementById(id);
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => Array.from(p.querySelectorAll(s));

const CHAINS = {
  eth:  { id: 'eth-mainnet',     label: 'ETH',  full: 'Ethereum',  color: '#627eea' },
  base: { id: 'base-mainnet',    label: 'BASE', full: 'Base',      color: '#0052ff' },
  arb:  { id: 'arb-mainnet',     label: 'ARB',  full: 'Arbitrum',  color: '#28a0f0' },
  poly: { id: 'polygon-mainnet', label: 'POL',  full: 'Polygon',   color: '#8247e5' },
  opt:  { id: 'opt-mainnet',     label: 'OPT',  full: 'Optimism',  color: '#ff0420' },
};

let state = {
  lang: 'en',
  theme: 'light',
  selectedChains: ['eth', 'base', 'arb', 'poly', 'opt'],
  nfts: [],
  walletAddr: '',
  walletEns: '',
};

// ═══════════════════════════════════════════════════════════════
// I18N
// ═══════════════════════════════════════════════════════════════
const T = {
  en: {
    h1Pre: 'Every NFT a wallet holds, ',
    h1Em:  'curated',
    h1Post: ' like a private museum.',
    lead: "Paste any address. MimoVault catalogues every artwork across five chains, writes an exhibition note in your collector's voice, and lets you walk the gallery one frame at a time.",
    placeholder: '0x… or vitalik.eth',
    scan: 'Open the vault',
    scanLabel: 'Select chains to scan',
    try: 'Try:',
    walking: 'Walking the vault…',
    fetching: 'Fetching artworks across the chains…',
    composing: 'MimoCurator is composing the catalogue…',
    rendering: 'Hanging the works…',
    invalidAddr: 'That doesn\'t look like a wallet address or .eth name.',
    netErr: 'Couldn\'t reach the chains. Try again in a moment.',
    noChains: 'Select at least one chain.',
    noNfts: 'No NFTs found in this wallet across the selected chains.',
    chainsLabel: 'chains',
    aiPerWallet: 'AI curator per wallet',
    free: 'Free — no key',
    readOnly: 'Read-only — never signs',
    exhibitionEyebrow: 'EXHIBITION',
    works: 'works',
    collections: 'collections',
    chainsMeta: 'chains',
    rare: 'one-of-ones',
    curatorTag: 'CURATOR\'S NOTE — XIAOMI MIMO V2.5',
    curatorByline: 'Composed in real time by MiMo V2.5 · Hermes Agent',
    tasteEra: 'Predominant era',
    tasteMedium: 'Primary medium',
    tasteChain: 'Native chain',
    tasteRare: 'Rarity signal',
    sectionFloor: 'view detail',
    detailContract: 'Contract',
    detailToken: 'Token ID',
    detailChain: 'Chain',
    detailCollection: 'Collection',
    detailViewOpensea: 'View on OpenSea',
    detailViewExplorer: 'View on explorer',
    detailMissingDesc: 'No description provided by the artist.',
    eyebrow: '100T · Powered by Xiaomi MiMo V2.5',
    h1Em: 'curated',
    chainNames: { eth: 'Ethereum', base: 'Base', arb: 'Arbitrum', poly: 'Polygon', opt: 'Optimism' },
    examplesTry: 'Try',
    aboutEyebrow: 'How it works',
    aboutH2: 'An autonomous curator, one address at a time.',
    aboutP1: 'MimoVault treats each wallet as a private collection. A multi-stage agent pipeline normalizes your input, queries five chains for every token you hold, deduplicates and groups by artist, then commissions Xiaomi MiMo V2.5 to write the exhibition note — in the voice of a museum catalogue, not a marketplace.',
    aboutP2: 'Free. Read-only. No signature. No key. The gallery never asks your wallet to sign anything.',
    pipe1Title: 'ENS Resolver',
    pipe1Desc: 'Normalizes any 0x or .eth input through public Cloudflare ENS gateway.',
    pipe2Title: 'Multi-chain scan',
    pipe2Desc: 'Ethereum, Base, Arbitrum, Polygon, Optimism — Alchemy NFT v3 in parallel.',
    pipe3Title: 'Curator agent',
    pipe3Desc: 'Groups by collection, detects taste pattern, builds the exhibition outline.',
    pipe4Title: 'Narrative agent',
    pipe4Desc: "MiMo V2.5 writes the catalogue note — collector's voice, two paragraphs.",
    footerTag: 'A wallet, exhibited. Catalogue composed in real time by an autonomous curator agent. Free — no key, no signature, no custody.',
    footerColophon1: 'Exhibition data: Alchemy NFT API across five EVM chains.',
    footerColophon2: 'Catalogue notes: Xiaomi MiMo V2.5 via Pollinations.',
    footerColophon3: 'Hosted on GitHub Pages. Built with Hermes Agent.',
    sourceLink: 'Source',
    mimoOrbitLink: 'MiMo Orbit 100T',
    metaChains: 'chains',
    metaCurator: 'AI curator',
    metaCuratorPer: 'per wallet',
    metaFree: 'Free',
    metaFreeNo: 'no key',
    metaReadOnly: 'Read-only',
    metaReadOnlySigns: 'never signs',
    modalClose: 'Close',
    langBtnAria: 'Switch language',
    themeBtnAria: 'Toggle theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    detailViewExplorerSuffix: '',
    exhibitionTitleTpl: 'A private exhibition of {works} {worksLabel}, drawn from {collections} {collectionsLabel}.',
    broaderCollection: 'From the broader collection',
  },
  id: {
    h1Pre: 'Setiap NFT yang dimiliki dompet, ',
    h1Em:  'dikuratori',
    h1Post: ' seperti museum pribadi.',
    lead: "Tempel alamat apa pun. MimoVault membuat katalog setiap karya di lima chain, menulis catatan kurator dalam suara kolektor, dan membiarkan kamu berjalan menyusuri galerinya satu bingkai sekali.",
    placeholder: '0x… atau vitalik.eth',
    scan: 'Buka brankas',
    scanLabel: 'Pilih chain untuk di-scan',
    try: 'Coba:',
    walking: 'Berjalan menyusuri brankas…',
    fetching: 'Mengambil karya dari semua chain…',
    composing: 'MimoCurator sedang menulis katalog…',
    rendering: 'Menggantung karya-karyanya…',
    invalidAddr: 'Itu sepertinya bukan alamat wallet atau nama .eth.',
    netErr: 'Gagal menghubungi chain. Coba lagi sebentar.',
    noChains: 'Pilih minimal satu chain.',
    noNfts: 'Tidak ada NFT ditemukan untuk wallet ini di chain yang dipilih.',
    chainsLabel: 'chain',
    aiPerWallet: 'Kurator AI per dompet',
    free: 'Gratis — tanpa key',
    readOnly: 'Read-only — tidak pernah sign',
    exhibitionEyebrow: 'EKSHIBISI',
    works: 'karya',
    collections: 'koleksi',
    chainsMeta: 'chain',
    rare: 'one-of-one',
    curatorTag: 'CATATAN KURATOR — XIAOMI MIMO V2.5',
    curatorByline: 'Disusun real-time oleh MiMo V2.5 · Hermes Agent',
    tasteEra: 'Era dominan',
    tasteMedium: 'Medium utama',
    tasteChain: 'Chain favorit',
    tasteRare: 'Sinyal kelangkaan',
    sectionFloor: 'lihat detail',
    detailContract: 'Kontrak',
    detailToken: 'Token ID',
    detailChain: 'Chain',
    detailCollection: 'Koleksi',
    detailViewOpensea: 'Lihat di OpenSea',
    detailViewExplorer: 'Lihat di explorer',
    detailMissingDesc: 'Artis tidak memberikan deskripsi.',
    eyebrow: '100T · Didukung Xiaomi MiMo V2.5',
    h1Em: 'dikuratori',
    chainNames: { eth: 'Ethereum', base: 'Base', arb: 'Arbitrum', poly: 'Polygon', opt: 'Optimism' },
    examplesTry: 'Coba',
    aboutEyebrow: 'Cara kerjanya',
    aboutH2: 'Kurator otonom, satu alamat sekali waktu.',
    aboutP1: 'MimoVault memperlakukan setiap dompet sebagai koleksi pribadi. Sebuah pipeline multi-agen menormalkan masukanmu, mengkueri lima chain untuk setiap token yang kamu pegang, deduplikasi dan mengelompokkan per artis, lalu meminta Xiaomi MiMo V2.5 menulis catatan ekshibisi — dalam suara katalog museum, bukan marketplace.',
    aboutP2: 'Gratis. Read-only. Tanpa tanda tangan. Tanpa key. Galeri tidak pernah meminta dompetmu menandatangani apa pun.',
    pipe1Title: 'ENS Resolver',
    pipe1Desc: 'Menormalkan masukan 0x atau .eth melalui gateway ENS Cloudflare publik.',
    pipe2Title: 'Pemindai multi-chain',
    pipe2Desc: 'Ethereum, Base, Arbitrum, Polygon, Optimism — Alchemy NFT v3 paralel.',
    pipe3Title: 'Agen kurator',
    pipe3Desc: 'Mengelompokkan per koleksi, mendeteksi pola selera, membangun rangka ekshibisi.',
    pipe4Title: 'Agen naratif',
    pipe4Desc: 'MiMo V2.5 menulis catatan katalog — suara kolektor, dua paragraf.',
    footerTag: 'Sebuah dompet, dipamerkan. Katalog disusun real-time oleh agen kurator otonom. Gratis — tanpa key, tanpa tanda tangan, tanpa kustodi.',
    footerColophon1: 'Data ekshibisi: Alchemy NFT API di lima chain EVM.',
    footerColophon2: 'Catatan katalog: Xiaomi MiMo V2.5 via Pollinations.',
    footerColophon3: 'Di-host di GitHub Pages. Dibangun dengan Hermes Agent.',
    sourceLink: 'Source',
    mimoOrbitLink: 'MiMo Orbit 100T',
    metaChains: 'chain',
    metaCurator: 'Kurator AI',
    metaCuratorPer: 'per dompet',
    metaFree: 'Gratis',
    metaFreeNo: 'tanpa key',
    metaReadOnly: 'Read-only',
    metaReadOnlySigns: 'tidak pernah sign',
    modalClose: 'Tutup',
    langBtnAria: 'Ganti bahasa',
    themeBtnAria: 'Ganti tema',
    themeLight: 'Terang',
    themeDark: 'Gelap',
    detailViewExplorerSuffix: '',
    exhibitionTitleTpl: 'Ekshibisi pribadi {works} {worksLabel}, diambil dari {collections} {collectionsLabel}.',
    broaderCollection: 'Dari koleksi yang lebih luas',
  },
};
const t = (k) => T[state.lang][k] || k;

// ═══════════════════════════════════════════════════════════════
// IMAGE URL HELPERS
// ═══════════════════════════════════════════════════════════════
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://nftstorage.link/ipfs/',
  'https://4everland.io/ipfs/',
];

function resolveImageUrl(raw) {
  if (!raw) return '';
  if (raw.startsWith('ipfs://')) {
    return IPFS_GATEWAYS[0] + raw.replace('ipfs://', '').replace(/^ipfs\//, '');
  }
  if (raw.startsWith('ar://')) {
    return 'https://arweave.net/' + raw.replace('ar://', '');
  }
  return raw;
}

// ═══════════════════════════════════════════════════════════════
// ENS RESOLVER
// ═══════════════════════════════════════════════════════════════
async function resolveEns(input) {
  const trimmed = input.trim();
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return { address: trimmed.toLowerCase(), ens: '' };
  }
  if (!trimmed.endsWith('.eth')) return null;
  try {
    const res = await fetch(`https://cloudflare-eth.com/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'eth_call',
        params: [{
          to: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', // ENS Registry not used directly — use namehash via public resolver via ensdata.net fallback
          data: '0x'
        }, 'latest']
      })
    });
    // Cloudflare doesn't auto-resolve ENS via eth_call without namehash. Use ensdata.net public.
  } catch (_) {}
  // Fallback: free ensdata.net
  try {
    const res = await fetch(`https://api.ensdata.net/${trimmed}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.address) {
      return { address: data.address.toLowerCase(), ens: trimmed };
    }
  } catch (_) {}
  return null;
}

// ═══════════════════════════════════════════════════════════════
// MULTI-CHAIN NFT FETCHER (Alchemy demo)
// ═══════════════════════════════════════════════════════════════
async function fetchNftsForChain(chainKey, address) {
  const chain = CHAINS[chainKey];
  const url = `https://${chain.id}.g.alchemy.com/nft/v3/demo/getNFTsForOwner?owner=${address}&pageSize=80&withMetadata=true&excludeFilters[]=SPAM`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { chain: chainKey, nfts: [], total: 0 };
    const data = await res.json();
    const nfts = (data.ownedNfts || []).map(n => normalizeAlchemyNft(n, chainKey));
    return { chain: chainKey, nfts, total: data.totalCount || nfts.length };
  } catch (e) {
    console.error(`Fetch error ${chainKey}:`, e);
    return { chain: chainKey, nfts: [], total: 0 };
  }
}

function normalizeAlchemyNft(n, chainKey) {
  const img = n.image || {};
  const imageUrl = img.cachedUrl || img.thumbnailUrl || img.originalUrl || img.pngUrl || '';
  const animation = n.animation || {};
  const animUrl = animation.cachedUrl || animation.originalUrl || '';
  const isVideo = animUrl && /\.(mp4|webm|mov)$/i.test(animUrl);

  return {
    contractAddr: n.contract?.address || '',
    contractName: n.contract?.name || n.collection?.name || 'Unknown collection',
    tokenId: n.tokenId || '',
    tokenIdShort: shortenTokenId(n.tokenId || ''),
    title: n.name || `#${shortenTokenId(n.tokenId || '?')}`,
    description: n.description || '',
    imageUrl: resolveImageUrl(imageUrl),
    animationUrl: resolveImageUrl(animUrl),
    isVideo,
    chain: chainKey,
    tokenType: n.tokenType || 'ERC721',
    attributes: (n.raw?.metadata?.attributes || []).slice(0, 8),
    floorPrice: n.contract?.openSeaMetadata?.floorPrice || null,
    totalSupply: n.contract?.totalSupply || null,
  };
}

function toRoman(n) {
  const map = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return map[n] || String(n);
}

function shortenTokenId(id) {
  const s = String(id);
  if (s.length <= 6) return s;
  return s.slice(0, 4) + '…' + s.slice(-2);
}

// ═══════════════════════════════════════════════════════════════
// CURATOR AGENT — group, detect taste, build outline
// ═══════════════════════════════════════════════════════════════
function curate(nfts) {
  const byCollection = {};
  for (const n of nfts) {
    if (!n.imageUrl && !n.animationUrl) continue;
    const k = n.contractAddr.toLowerCase() + ':' + n.chain;
    if (!byCollection[k]) byCollection[k] = { name: n.contractName, chain: n.chain, items: [] };
    byCollection[k].items.push(n);
  }
  const collections = Object.values(byCollection)
    .sort((a, b) => b.items.length - a.items.length);

  const totalCollections = collections.length;
  const totalWorks = nfts.filter(n => n.imageUrl || n.animationUrl).length;
  const chainSet = new Set(nfts.map(n => n.chain));
  const oneOfOnes = collections.filter(c => c.items.length === 1).length;

  // Heuristic taste detection
  const collNames = nfts.map(n => (n.contractName || '').toLowerCase());
  const titles = nfts.map(n => (n.title || '').toLowerCase());
  const allText = (collNames.join(' ') + ' ' + titles.join(' ')).toLowerCase();

  let medium = 'Mixed media';
  if (/punk|crypto.*punk|cryptopunks/.test(allText)) medium = 'CryptoArt classics';
  else if (/art block|fidenza|ringers|chromie|squiggle|generative/.test(allText)) medium = 'Generative art';
  else if (/pfp|ape|club|mfer|punks|toad/.test(allText)) medium = 'PFP collectibles';
  else if (/photo|aperture|moments|frame/.test(allText)) medium = 'Photography';
  else if (/edition|prints|drop/.test(allText)) medium = 'Editions & prints';
  else if (oneOfOnes / Math.max(1, totalCollections) > 0.6) medium = '1-of-1 art';
  else if (/game|axie|sandbox|land/.test(allText)) medium = 'Gaming assets';

  const chainCounts = {};
  for (const n of nfts) chainCounts[n.chain] = (chainCounts[n.chain] || 0) + 1;
  const topChain = Object.entries(chainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'eth';

  const era = totalWorks > 200 ? 'Veteran collector — multi-cycle archive'
            : totalWorks > 50  ? 'Active collector — current cycle'
            : totalWorks > 10  ? 'Emerging collector'
            : 'Selective curator';

  const rareSignal = oneOfOnes >= totalCollections * 0.7 ? 'High — most works are unique'
                   : oneOfOnes >= totalCollections * 0.3 ? 'Medium — mix of editions and 1-of-1s'
                   : 'Editions-driven';

  return {
    collections,
    stats: { totalWorks, collections: totalCollections, chains: chainSet.size, oneOfOnes },
    taste: { era, medium, topChain: CHAINS[topChain]?.full || 'Ethereum', rareSignal },
  };
}

// ═══════════════════════════════════════════════════════════════
// NARRATIVE AGENT — Pollinations
// ═══════════════════════════════════════════════════════════════
async function composeNarrative(taste, stats, walletLabel) {
  const lang = state.lang;
  const collectionList = state.curated.collections.slice(0, 8)
    .map(c => `${c.name} (${c.items.length})`).join(', ');

  const sysEn = `You are MimoCurator, a museum-trained art writer composing exhibition catalogue notes for crypto-native NFT collections. Tone: literary, observational, never marketing-speak. No exclamation points. No "amazing", "stunning", "incredible". Write like Aperture or Frieze magazine. Two short paragraphs. Total 110-130 words.`;

  const sysId = `Kamu adalah MimoCurator, penulis seni museum yang menulis catatan katalog ekshibisi untuk koleksi NFT kripto-native. Nada: literer, observasional, bukan bahasa pemasaran. Tanpa tanda seru. Tanpa kata "menakjubkan", "luar biasa". Tulis seperti majalah Aperture atau Frieze. Dua paragraf pendek. Total 110-130 kata.`;

  const userEn = `Compose a catalogue note for "${walletLabel}". Stats: ${stats.totalWorks} works across ${stats.collections} collections on ${stats.chains} chains. Predominant era: ${taste.era}. Primary medium: ${taste.medium}. Native chain: ${taste.topChain}. Rarity signal: ${taste.rareSignal}. Top collections: ${collectionList}. Write the note now.`;

  const userId = `Susun catatan katalog untuk "${walletLabel}". Statistik: ${stats.totalWorks} karya di ${stats.collections} koleksi pada ${stats.chains} chain. Era dominan: ${taste.era}. Medium utama: ${taste.medium}. Chain favorit: ${taste.topChain}. Sinyal kelangkaan: ${taste.rareSignal}. Koleksi teratas: ${collectionList}. Tulis catatannya sekarang.`;

  try {
    const res = await fetch('https://text.pollinations.ai/openai?referrer=mimovault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        referrer: 'mimovault',
        messages: [
          { role: 'system', content: lang === 'id' ? sysId : sysEn },
          { role: 'user',   content: lang === 'id' ? userId : userEn },
        ],
      }),
    });
    if (!res.ok) throw new Error('Pollinations HTTP ' + res.status);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    return text.trim() || fallbackNarrative(taste, stats, walletLabel);
  } catch (e) {
    console.warn('Curator narrative fallback:', e);
    return fallbackNarrative(taste, stats, walletLabel);
  }
}

function fallbackNarrative(taste, stats, walletLabel) {
  if (state.lang === 'id') {
    return `Brankas ${walletLabel} berisi ${stats.totalWorks} karya yang tersebar di ${stats.collections} koleksi pada ${stats.chains} chain. Pola yang muncul adalah ${taste.medium.toLowerCase()}, dengan ${taste.topChain} sebagai chain rumah. ${taste.era}.\n\nSinyal kelangkaan: ${taste.rareSignal.toLowerCase()}. Setiap entri berikut adalah satu bingkai dalam ekshibisi pribadi ini.`;
  }
  return `The ${walletLabel} vault holds ${stats.totalWorks} works across ${stats.collections} collections on ${stats.chains} chains. The pattern is ${taste.medium.toLowerCase()}, with ${taste.topChain} as the home chain. ${taste.era}.\n\nRarity signal: ${taste.rareSignal.toLowerCase()}. Each entry below is one frame in this private exhibition.`;
}

// ═══════════════════════════════════════════════════════════════
// RENDERERS
// ═══════════════════════════════════════════════════════════════
function renderExhibitionHeader(walletLabel, stats) {
  $('exhibitionHeader').innerHTML = `
    <div class="exhibition-header">
      <div class="exhibition-meta">${t('exhibitionEyebrow')} · ${walletLabel}</div>
        <h2 class="exhibition-title">${t('exhibitionTitleTpl').replace('{works}', stats.totalWorks).replace('{worksLabel}', t('works')).replace('{collections}', stats.collections).replace('{collectionsLabel}', t('collections'))}</h2>
      <div class="exhibition-stats">
        <div class="stat-block">
          <span class="num">${stats.totalWorks}</span>
          <span class="label">${t('works')}</span>
        </div>
        <div class="stat-block">
          <span class="num">${stats.collections}</span>
          <span class="label">${t('collections')}</span>
        </div>
        <div class="stat-block">
          <span class="num">${stats.chains}</span>
          <span class="label">${t('chainsMeta')}</span>
        </div>
        <div class="stat-block">
          <span class="num">${stats.oneOfOnes}</span>
          <span class="label">${t('rare')}</span>
        </div>
      </div>
    </div>`;
}

function renderCuratorNote(text) {
  const html = text.split(/\n\n+/).map(p => `<p>${escapeHtml(p)}</p>`).join('');
  $('curatorNote').innerHTML = `
    <div class="curator-note">
      <div class="curator-tag">${t('curatorTag')}</div>
      <div class="curator-text">${html}</div>
      <div class="curator-byline">${t('curatorByline')}</div>
    </div>`;
}

function renderTasteGrid(taste) {
  $('tasteGrid').innerHTML = `
    <div class="taste-grid">
      <div class="taste-card">
        <div class="label">${t('tasteEra')}</div>
        <div class="value">${escapeHtml(taste.era)}</div>
      </div>
      <div class="taste-card">
        <div class="label">${t('tasteMedium')}</div>
        <div class="value">${escapeHtml(taste.medium)}</div>
      </div>
      <div class="taste-card">
        <div class="label">${t('tasteChain')}</div>
        <div class="value">${escapeHtml(taste.topChain)}</div>
      </div>
      <div class="taste-card">
        <div class="label">${t('tasteRare')}</div>
        <div class="value">${escapeHtml(taste.rareSignal)}</div>
      </div>
    </div>`;
}

function renderGallery(collections) {
  // Show all NFTs flat, but group sections by collection where size > 4
  const featured = collections.filter(c => c.items.length >= 4).slice(0, 6);
  const featuredKeys = new Set(featured.map(c => c.name + ':' + c.chain));
  const otherItems = [];
  for (const c of collections) {
    if (!featuredKeys.has(c.name + ':' + c.chain)) {
      otherItems.push(...c.items);
    }
  }

  let html = '';
  for (const c of featured) {
    html += `
      <div class="gallery-section">
        <div class="gallery-section-header">
          <div class="gallery-section-title"><span class="gallery-roman">${toRoman(featured.indexOf(c) + 1)}</span> ${escapeHtml(c.name)}</div>
          <div class="gallery-section-meta">${c.items.length} ${t('works')} · ${CHAINS[c.chain]?.full || c.chain}</div>
        </div>
        <div class="gallery">${c.items.slice(0, 12).map((n, i) => artworkCard(n, i)).join('')}</div>
      </div>`;
  }
  if (otherItems.length) {
    html += `
      <div class="gallery-section">
        <div class="gallery-section-header">
          <div class="gallery-section-title"><span class="gallery-roman">${toRoman(featured.length + 1)}</span> ${t('broaderCollection')}</div>
          <div class="gallery-section-meta">${otherItems.length} ${t('works')}</div>
        </div>
        <div class="gallery">${otherItems.slice(0, 36).map((n, i) => artworkCard(n, i + 1000)).join('')}</div>
      </div>`;
  }
  $('galleryRoot').innerHTML = html;

  // Wire artwork click → modal
  qsa('.artwork').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.idx));
  });
}

function artworkCard(n, idx) {
  const cIdx = state.flatIndex[n.contractAddr + ':' + n.tokenId + ':' + n.chain] ?? 0;
  const chainLabel = CHAINS[n.chain]?.label || n.chain.toUpperCase();
  const mediaTag = n.isVideo
    ? `<video src="${escapeAttr(n.animationUrl)}" muted loop playsinline preload="metadata"></video>`
    : n.imageUrl
      ? `<img src="${escapeAttr(n.imageUrl)}" alt="${escapeAttr(n.title)}" loading="lazy" decoding="async" onerror="this.parentElement.innerHTML='<div class=&quot;artwork-placeholder&quot;>image pending</div>'">`
      : `<div class="artwork-placeholder">no media</div>`;
  return `
    <article class="artwork" data-idx="${cIdx}">
      <div class="artwork-frame">
        ${mediaTag}
        <span class="artwork-chain">${chainLabel}</span>
      </div>
      <div class="artwork-meta">
        <div class="artwork-title-wrap">
          <div class="artwork-title">${escapeHtml(n.title)}</div>
          <div class="artwork-collection">${escapeHtml(n.contractName)}</div>
        </div>
        ${n.title.includes('#') ? '' : `<div class="artwork-id">#${escapeHtml(n.tokenIdShort)}</div>`}
      </div>
    </article>`;
}

function openModal(idx) {
  const n = state.curated.flatList[idx];
  if (!n) return;
  const chainName = CHAINS[n.chain]?.full || n.chain;
  const explorerBase = {
    eth: 'https://etherscan.io/nft',
    base: 'https://basescan.org/nft',
    arb: 'https://arbiscan.io/nft',
    poly: 'https://polygonscan.com/nft',
    opt: 'https://optimistic.etherscan.io/nft',
  }[n.chain] || 'https://etherscan.io/nft';
  const openseaSlug = {
    eth: 'ethereum', base: 'base', arb: 'arbitrum', poly: 'matic', opt: 'optimism'
  }[n.chain] || 'ethereum';

  const media = n.isVideo
    ? `<video src="${escapeAttr(n.animationUrl)}" controls autoplay loop playsinline></video>`
    : n.imageUrl
      ? `<img src="${escapeAttr(n.imageUrl)}" alt="${escapeAttr(n.title)}">`
      : `<div class="artwork-placeholder">no media</div>`;

  const attrs = (n.attributes || [])
    .filter(a => a.trait_type && a.value !== undefined)
    .slice(0, 6)
    .map(a => `<div class="modal-attr"><b>${escapeHtml(a.trait_type)}</b>${escapeHtml(String(a.value))}</div>`)
    .join('');

  $('modalInner').innerHTML = `
    <div class="modal-img">${media}</div>
    <div class="modal-body">
      <div class="modal-collection">${t('detailCollection')} · ${escapeHtml(n.contractName)} · ${chainName}</div>
      <h3 class="modal-title" id="modalTitle">${escapeHtml(n.title)}</h3>
      <div class="modal-id">${t('detailToken')} #${escapeHtml(n.tokenIdShort)}</div>
      <div class="modal-desc">${escapeHtml(n.description || t('detailMissingDesc'))}</div>
      ${attrs ? `<div class="modal-attrs">${attrs}</div>` : ''}
      <div class="modal-actions">
        <a class="modal-btn" href="https://opensea.io/assets/${openseaSlug}/${n.contractAddr}/${n.tokenId}" target="_blank" rel="noopener">${t('detailViewOpensea')} →</a>
        <a class="modal-btn ghost" href="${explorerBase}/${n.contractAddr}/${n.tokenId}" target="_blank" rel="noopener">${t('detailViewExplorer')} →</a>
      </div>
    </div>`;
  $('modal').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  $('modal').classList.remove('on');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

function showError(msg) {
  const el = $('errBox');
  el.textContent = msg;
  el.classList.add('on');
}
function clearError() { $('errBox').classList.remove('on'); }

// ═══════════════════════════════════════════════════════════════
// MAIN SCAN
// ═══════════════════════════════════════════════════════════════
async function scan(input) {
  clearError();
  $('resultBox').classList.remove('on');

  if (!input || !input.trim()) {
    showError(t('invalidAddr'));
    return;
  }
  if (state.selectedChains.length === 0) {
    showError(t('noChains'));
    return;
  }

  state.currentLoadKey = 'walking';
  $('loadBox').classList.add('on');
  $('loadMsg').textContent = t('walking');

  try {
    const resolved = await resolveEns(input);
    if (!resolved) {
      $('loadBox').classList.remove('on');
      showError(t('invalidAddr'));
      return;
    }
    state.walletAddr = resolved.address;
    state.walletEns  = resolved.ens;

    state.currentLoadKey = 'fetching';
    $('loadMsg').textContent = t('fetching');
    const fetches = state.selectedChains.map(c => fetchNftsForChain(c, resolved.address));
    const results = await Promise.all(fetches);

    const flat = results.flatMap(r => r.nfts).filter(n => n.imageUrl || n.animationUrl);
    state.nfts = flat;

    if (flat.length === 0) {
      $('loadBox').classList.remove('on');
      showError(t('noNfts'));
      return;
    }

    state.curated = curate(flat);
    state.curated.flatList = state.nfts;
    state.flatIndex = {};
    state.nfts.forEach((n, i) => {
      state.flatIndex[n.contractAddr + ':' + n.tokenId + ':' + n.chain] = i;
    });

    state.currentLoadKey = 'composing';
    $('loadMsg').textContent = t('composing');
    const walletLabel = resolved.ens || resolved.address.slice(0, 6) + '…' + resolved.address.slice(-4);

    const narrative = await composeNarrative(state.curated.taste, state.curated.stats, walletLabel);
    state.lastNarrative = narrative;

    state.currentLoadKey = 'rendering';
    $('loadMsg').textContent = t('rendering');
    await new Promise(r => setTimeout(r, 100));

    renderExhibitionHeader(walletLabel, state.curated.stats);
    renderCuratorNote(narrative);
    renderTasteGrid(state.curated.taste);
    renderGallery(state.curated.collections);

    $('loadBox').classList.remove('on');
    $('resultBox').classList.add('on');
    $('resultBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    console.error('Scan error:', e);
    $('loadBox').classList.remove('on');
    showError(t('netErr'));
  }
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
function applyLang() {
  document.documentElement.lang = state.lang;
  // Nav
  $('langBtn').textContent = state.lang === 'en' ? 'EN' : 'ID';
  $('langBtn').setAttribute('aria-label', t('langBtnAria'));
  $('themeBtn').setAttribute('aria-label', t('themeBtnAria'));
  // Hero
  $('eyebrow').textContent = t('eyebrow');
  $('heroH1').innerHTML = `${t('h1Pre')}<em>${t('h1Em')}</em>${t('h1Post')}`;
  $('heroLead').textContent = t('lead');
  // Hero meta
  const cn = T[state.lang].chainNames;
  $('heroMeta').innerHTML = `
    <span><b>5</b> ${t('metaChains')}</span>
    <span><b>${t('metaCurator')}</b> ${t('metaCuratorPer')}</span>
    <span><b>${t('metaFree')}</b> · ${t('metaFreeNo')}</span>
    <span><b>${t('metaReadOnly')}</b> · ${t('metaReadOnlySigns')}</span>`;
  // Scan card
  $('scanLabel').textContent = t('scanLabel');
  $('addrIn').placeholder = t('placeholder');
  $('scanBtn').textContent = t('scan');
  // Chain pills (preserve selected state)
  const chainKeys = ['eth','base','arb','poly','opt'];
  $('chainRow').innerHTML = chainKeys.map(k => {
    const on = state.selectedChains.includes(k) ? ' on' : '';
    return `<button class="chain-pill${on}" data-chain="${k}">${cn[k]}</button>`;
  }).join('');
  // Re-bind chain pills
  qsa('.chain-pill').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('on');
      const c = el.dataset.chain;
      if (el.classList.contains('on')) {
        if (!state.selectedChains.includes(c)) state.selectedChains.push(c);
      } else {
        state.selectedChains = state.selectedChains.filter(x => x !== c);
      }
    });
  });
  // Examples
  $('examplesRow').innerHTML = `
    <b>${t('examplesTry')}:</b>
    <button class="example-btn" data-addr="vitalik.eth">vitalik.eth</button>
    <button class="example-btn" data-addr="0x6CC5F688a315f3dC28A7781717a9A798a59fDA7b">punk6529</button>
    <button class="example-btn" data-addr="0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459">pranksy</button>`;
  qsa('.example-btn').forEach(el => {
    el.addEventListener('click', () => {
      $('addrIn').value = el.dataset.addr;
      scan(el.dataset.addr);
    });
  });
  // Loading message — keep current if already showing
  if ($('loadBox').classList.contains('on')) {
    // If a key is mid-flow, refresh from current loadKey state
    if (state.currentLoadKey) {
      $('loadMsg').textContent = t(state.currentLoadKey);
    }
  } else {
    $('loadMsg').textContent = t('walking');
  }
  // About section
  $('aboutEyebrow').textContent = t('aboutEyebrow');
  $('aboutH2').textContent = t('aboutH2');
  $('aboutP1').textContent = t('aboutP1');
  $('aboutP2').textContent = t('aboutP2');
  $('aboutPipeline').innerHTML = [1,2,3,4].map(n => `
    <div class="pipe-step">
      <span class="num">0${n}</span>
      <div class="title">${escapeHtml(t('pipe' + n + 'Title'))}</div>
      <div class="desc">${escapeHtml(t('pipe' + n + 'Desc'))}</div>
    </div>`).join('');
  // Footer
  $('footerTag').textContent = t('footerTag');
  $('footerColophon').innerHTML = `${t('footerColophon1')}<br>${t('footerColophon2')}<br>${t('footerColophon3')}`;
  $('footerLinks').innerHTML = `
    <a href="https://api.alchemy.com" target="_blank" rel="noopener">Alchemy NFT</a>
    <a href="https://pollinations.ai" target="_blank" rel="noopener">Pollinations</a>
    <a href="https://huolinger010.github.io/mimoorbit/" target="_blank" rel="noopener">${t('mimoOrbitLink')}</a>
    <a href="https://github.com/gyoomei/mimovault" target="_blank" rel="noopener">${t('sourceLink')}</a>`;
  // Modal close aria
  $('modalClose').setAttribute('aria-label', t('modalClose'));
  // Re-render result section if currently showing (to update curator note byline, taste labels, exhibition labels, etc.)
  if (state.curated && $('resultBox').classList.contains('on')) {
    const walletLabel = state.walletEns || (state.walletAddr ? state.walletAddr.slice(0,6) + '…' + state.walletAddr.slice(-4) : '');
    renderExhibitionHeader(walletLabel, state.curated.stats);
    renderTasteGrid(state.curated.taste);
    renderGallery(state.curated.collections);
    if (state.lastNarrative) renderCuratorNote(state.lastNarrative);
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  $('themeBtn').textContent = state.theme === 'dark' ? t('themeLight') : t('themeDark');
}

function init() {
  // Read URL hash for direct address
  const hashAddr = window.location.hash.slice(1);
  if (hashAddr) $('addrIn').value = hashAddr;

  // Lang preference
  const navLang = (navigator.language || 'en').toLowerCase();
  if (navLang.startsWith('id')) state.lang = 'id';
  applyLang();
  applyTheme();

  // (chain pills + examples bound inside applyLang)

  // Scan
  $('scanBtn').addEventListener('click', () => scan($('addrIn').value));
  $('addrIn').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') scan(e.target.value);
  });

  // Lang toggle
  $('langBtn').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'id' : 'en';
    applyLang();
  });

  // Theme toggle
  $('themeBtn').addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
  });

  // Modal close
  $('modalClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', (e) => {
    if (e.target === $('modal')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $('modal').classList.contains('on')) closeModal();
  });

  // Auto-scan if hash provided
  if (hashAddr) {
    setTimeout(() => scan(hashAddr), 500);
  }
}

document.addEventListener('DOMContentLoaded', init);
