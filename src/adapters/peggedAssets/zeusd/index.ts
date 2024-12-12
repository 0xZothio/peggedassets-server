const sdk = require("@defillama/sdk");
import {
  ChainBlocks,
  PeggedIssuanceAdapter,
} from "../peggedAsset.type";

const contractAddresses = "0xf9Cb28aca07B76941c461833AA7CBD2909F24640"

async function ethereumMinted() {
return async function (
    _timestamp: number,
    _ethBlock: number,
    _chainBlocks: ChainBlocks
) {
    const totalSupply = (
      await sdk.api.abi.call({
        abi: "erc20:totalSupply",
        target: contractAddresses,
        chain: "ethereum",
      })
    ).output;
    return { peggedUSD: totalSupply/1e18};
  };
}

async function bridgedFromEthereum(chain: string) {
    return async function (
        _timestamp: number,
        _ethBlock: number,
        _chainBlocks: ChainBlocks
    ) {
        const totalSupply = (
          await sdk.api.abi.call({
            abi: "erc20:totalSupply",
            target: contractAddresses,
            chain,
          })
        ).output;
        return { peggedUSD: totalSupply/1e18};
      };
    }




const zeusd_adapter: PeggedIssuanceAdapter = {
  ethereum: {
    minted: ethereumMinted(),
    unreleased: bridgedFromEthereum("manta"),
  },
    manta: {
        minted: bridgedFromEthereum("manta"),
        unreleased: async () => ({}),
    }
};

export default zeusd_adapter;
