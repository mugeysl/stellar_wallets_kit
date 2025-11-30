import {
  Contract,
  rpc,
  TransactionBuilder,
  BASE_FEE,
  Networks,
} from "@stellar/stellar-sdk";

// 🔥 BUNU KENDİ CONTRACT ID'N İLE DEĞİŞTİR
export const CONTRACT_ID = "CDGZZCRVL4NWNCB2G7YXS3W225KINI2XUKE6BV25AOQG7T3GBMHXCM3S";

// Soroban RPC endpoint
export const RPC_URL = "https://soroban-testnet.stellar.org";

const server = new rpc.Server(RPC_URL);

export async function callContractMethod({ method, args, publicKey, kit }) {
  if (!publicKey || !kit) {
    throw new Error("Wallet bağlı değil.");
  }

  console.log("🔧 Contract call:", method, args);

  const contract = new Contract(CONTRACT_ID);

  // Wallet'ın hesabını al
  const account = await server.getAccount(publicKey);

  // Transaction oluştur
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call(method, ...(args || [])))
    .setTimeout(30)
    .build();

  // Wallet ile imzala (Freighter)
  const signed = await kit.sign(tx);

  // RPC'ye gönder
  const result = await server.sendTransaction(signed);

  console.log("🚀 Contract result:", result);

  return result;
}
