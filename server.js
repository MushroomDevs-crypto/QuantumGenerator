// server.js (backend Node.js para gerar carteira Solana)
const express = require('express');
const cors = require('cors');
const bip39 = require('bip39');
const ed25519 = require('ed25519-hd-key');
const { Keypair } = require('@solana/web3.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Rota raiz — evita erro "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Solana Wallet Generator API is running.');
});

// Rota de geração da carteira
app.get('/generate', async (req, res) => {
  try {
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivationPath = "m/44'/501'/0'/0'";
    const derivedSeed = ed25519.derivePath(derivationPath, seed.toString('hex')).key;

    const keypair = Keypair.fromSeed(derivedSeed);

    res.json({
      mnemonic,
      address: keypair.publicKey.toBase58(),
      privateKey: Array.from(keypair.secretKey),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate wallet.' });
  }
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
