import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';

import fs from 'fs';

import { HardhatUserConfig } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/src/types/config';

const mnemonicFileName = process.env.MNEMONIC_FILE;
let mnemonic = 'test '.repeat(11) + 'junk';
if (mnemonicFileName != null && fs.existsSync(mnemonicFileName)) {
  mnemonic = fs.readFileSync(mnemonicFileName, 'ascii').trim();
}

const infuraUrl = (name: string): string => `https://${name}.infura.io/v3/${process.env.INFURA_ID}`;

function getNetwork(url: string): NetworkUserConfig {
  console.log(`mnemonic: ${mnemonic}`);
  return {
    url,
    accounts: {
      mnemonic,
    },
  };
}

function getInfuraNetwork(name: string): NetworkUserConfig {
  console.warn(`name: ${name}`);
  return getNetwork(infuraUrl(name));
}

console.warn(`process.env.INFURA_API_KEY: ${process.env.INFURA_API_KEY}`);
console.warn(`process.env.SEPOLIA_PRIVATE_KEY: ${process.env.SEPOLIA_PRIVATE_KEY}`);

const config: HardhatUserConfig = {
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5',
  },
  networks: {
    localhost: {
      url: 'http://localhost:8545/',
      saveDeployments: false,
    },
    sepolia: {
      url: `https://ethereum-sepolia-rpc.publicnode.com`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY || ''],
    },
    goerli: getInfuraNetwork('goerli'),
  },
  solidity: {
    version: '0.8.23',
    settings: {
      evmVersion: 'paris',
      optimizer: { enabled: true },
    },
  },
};

export default config;
