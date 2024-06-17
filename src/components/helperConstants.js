import { ethers } from "ethers";
import VVS from "../Abi/VVS.json";
import CroDex from "../Abi/CroDex.json";
import Ebisus from "../Abi/Ebisus.json";
import MMF from "../Abi/MMF.json";
import Aggregator from "../Abi/Aggregator.json";
import Token from "../Abi/Token.json";
import WCro from "../Abi/WCro.json";
import FactoryAbi from "../Abi/FactoryAbi.json";
import value from "../value.json";
export const defaultTokens = [
  "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
  "0x7C8b5501A40D382e8A11889834c80b2D7Fa1Fc4F",
];
export const allPaths = [
  [],
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23"],
  ["0xc21223249CA28397B4B6541dfFaEcC539BfF0c59"],
  [
    "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
  ],
  [
    "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
  ],
];

export const token1 = "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23";
export const token2 = "0x7C8b5501A40D382e8A11889834c80b2D7Fa1Fc4F";
export function mmfContract(signer) {
  return new ethers.Contract(value.mmfAddress, MMF, signer);
}
export function vssContract(signer) {
  return new ethers.Contract(value.vvsAddress, VVS, signer);
}
export function croDexContract(signer) {
  return new ethers.Contract(value.croDexAddress, CroDex, signer);
}
export function ebisusContract(signer) {
  return new ethers.Contract(value.ebisusAddress, Ebisus, signer);
}
export function aggregatorContract(signer) {
  return new ethers.Contract(value.aggregatorAddress, Aggregator, signer);
}
export function tokenContract(signer, tokenAddress) {
  return new ethers.Contract(tokenAddress, Token, signer);
}
export function WCroContract(signer, tokenAddress) {
  return new ethers.Contract(tokenAddress, WCro, signer);
}
export function factoryContract(signer, factoryAddress) {
  return new ethers.Contract(factoryAddress, FactoryAbi, signer);
}

export const cronos = {
  id: 25,
  name: "CRONOS",
  network: "cronos",
  nativeCurrency: {
    decimals: 18,
    name: "CRONOS",
    symbol: "CRO",
  },
  rpcUrls: {
    public: { http: ["https://evm-cronos.crypto.org"] },
    default: { http: ["https://evm-cronos.crypto.org"] },
  },
  blockExplorers: {
    etherscan: { name: "CRONOSCAN", url: "https://cronoscan.com" },
    default: { name: "CRONOSCAN", url: "https://cronoscan.com" },
  },
  testnet: false,
};

export const tokenMap = [
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", "CRO", "cronos.webp"],
  ["0x7C8b5501A40D382e8A11889834c80b2D7Fa1Fc4F", "CROKING", "croking.webp"],
  ["0x41bc026dABe978bc2FAfeA1850456511ca4B01bc", "ARY", "ary.webp"],
  ["0x6519BD0745f21F34C22bBb16aBA24601e9B1f366", "CROSAITAMA", "csai.webp"],
  ["0xeC0d0f2D7dDF5e6F1Ed18711fE5DD5C790E1C4d6", "GDRT", "gdrt.webp"],
  ["0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03", "VVS", "vvs.webp"],
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", "WCRO", "cronos.webp"],
  ["0xc21223249CA28397B4B6541dfFaEcC539BfF0c59", "USDC", "usdc.webp"],
  ["0x66e428c3f67a68878562e79A0234c1F83c208770", "USDT", "usdt.webp"],
  ["0x97749c9B61F878a880DfE312d2594AE07AEd7656", "MMF", "mmf.webp"],
  ["0xEfE15a7232b9F0aA890FF97Aaf53afe87D00F8BE", "BTCRONOS", "btcronos.webp"],
  ["0x0224010BA2d567ffa014222eD960D1fa43B8C8E1", "MINT", "minted.webp"],
  ["0xe44Fd7fCb2b1581822D0c862B68222998a0c299a", "ETH", "eth.webp"],
  ["0x3b41b27e74dd366ce27cb389dc7877d4e1516d4d", "MERY", "mery.webp"],
  ["0xF8eDC9f6c088663753B5a5C657Ca7d482f8bCCc6", "Crojak", "crojak.webp"],
  ["0xcCcCcCcCdbEC186DC426F8B5628AF94737dF0E60", "CAW", "caw.webp"],
  ["0xed70e1b02a63fAfD5ECE7c0a2A1B12d4b424B4A8", "CROAK", "croak.webp"],
  ["0x2c95783e0cecDB17DaA687241F49e1bb8e49f78c", "CROBRA", "crobra.webp"],
  ["0xA6C3c213bF5AebC81394669294482c88694eCDCe", "COSTCRO", "costcro.webp"],
  ["0xd677944Df705924AF369d2FCcf4A989f343DbCDf", "FFTB", "fftb.webp"],
  ["0x7492450cc8897a4e444Ad972eB1619251EF15C23", "GM", "gm.webp"],
  ["0xC4137C68f8F6A7F50837725239DE17011B9b6ed9", "MOONEY", "moon.webp"],
  ["0xB26C3A4fBaf42104EeDad8274aE74b88F27c06dE", "ORC", "orc.webp"],
  ["0xDdcC8a4D729626B4aE8Bf9f14f14817245Cb2d48", "HFC", "hfc.webp"],
  ["0x4d7c922D6C12CfbF5BC85F56c9ccB1F61f49bf61", "KITTY", "kitty.webp"],
  ["0x679f6863a653251C8C215e77205A7058b5bF676a", "TROLL", "trollcoin.webp"]
];
export const tokenMap2 = [
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", "CRO", "cronos.webp"],
  ["0x7C8b5501A40D382e8A11889834c80b2D7Fa1Fc4F", "CROKING", "croking.webp"],
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", "WCRO", "cronos.webp"],
  ["0x66e428c3f67a68878562e79A0234c1F83c208770", "USDT", "usdt.webp"],
];

// Function to sort the tokenMap by token name alphabetically, with CROKING always on top
export const sortTokenMap = () => {
  return tokenMap.sort((a, b) => {
    // Check if either token is CROKING
    if (a[1] === "CROKING") return -1;
    if (b[1] === "CROKING") return 1;

    // Alphabetical sorting for the rest
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
  });
}

// Sorted tokenMap
const sortedTokenMap = sortTokenMap();
console.log(sortedTokenMap);
