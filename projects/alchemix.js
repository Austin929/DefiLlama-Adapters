const { getChainTransform } = require('./helper/portedTokens.js');
const { unwrapYearn, sumTokensSharedOwners } = require('./helper/unwrapLPs')
const { fetch } = require("./helper/alchemixHelper.js")

const contracts = {
  "fantom": {
    "tokenHolders": {
      "alUSDAlchemist": "0x76b2E3c5a183970AAAD2A48cF6Ae79E3e16D3A0E",
      "alUSDTransmuterBuffer": "0x5a07d36D1f543960EE7806d35827E995539Fe5CF"
    },
    "underlyingTokens": {
      "DAI": "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      "USDC": "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      "fUSDT": "0x049d68029688eAbF473097a2fC38ef61633A3C7A"
    },
    "yvTokens": {
      "yvDAI": "0x637ec617c86d24e421328e6caea1d92114892439",
      "yvUSDC": "0xef0210eb96c7eb36af8ed1c20306462764935607", 
      "yvUSDT": "0x148c05caf1bb09b5670f00d511718f733c54bc4c"
    }
  },
  "ethereum": {
    "tokenHolders": {
      "alUSDAlchemist": "0x5C6374a2ac4EBC38DeA0Fc1F8716e5Ea1AdD94dd",
      "alETHAlchemist": "0x062Bf725dC4cDF947aa79Ca2aaCCD4F385b13b5c",
      "alUSDAMO": "0x9735f7d3ea56b454b24ffd74c58e9bd85cfad31b",
      "alETHAMO": "0xe761bf731a06fe8259fee05897b2687d56933110",
      "USDTransmuterB": "0xeE69BD81Bd056339368c97c4B2837B4Dc4b796E7",
      "USDYearnVaultAdapter": "0xb039eA6153c827e59b620bDCd974F7bbFe68214A",
      "USDYearnVaultAdapterTransmuterB": "0x6Fe02BE0EC79dCF582cBDB936D7037d2eB17F661",
      "ETHTransmuter": "0x9FD9946E526357B35D95Bcb4b388614be4cFd4AC",
      "ETHAlchemist": "0xf8317BD5F48B6fE608a52B48C856D3367540B73B",
      "ETHYearnVaultAdapter": "0x546E6711032Ec744A7708D4b7b283A210a85B3BC",
      "ETHYearnVaultAdapter": "0x6d75657771256C7a8CB4d475fDf5047B70160132"
    },
    "underlyingTokens": {
      "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "wstETH": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      "rETH": "0xae78736Cd615f374D3085123A210448E74Fc6393",
      "WETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    "yvTokens": {
      "yvDAI": "0xda816459f1ab5631232fe5e97a05bbbb94970c95",
      "yvUSDC": "0xa354f35829ae975e850e23e9615b11da1b3dc4de", 
      "yvUSDT": "0x7da96a3891add058ada2e826306d812c638d87a7",
      "yvWETH": "0xa258c4606ca8206d8aa700ce2143d7db854d168c"
    }
  }
};

function tvl(chain) {
  return async (timestamp, block, chainBlocks) => {
    const balances = {};
    const transform = await getChainTransform(chain);
    await sumTokensSharedOwners(
      balances, 
      Object.values(contracts[chain].underlyingTokens)
        .concat(Object.values(contracts[chain].yvTokens)), 
        Object.values(contracts[chain].tokenHolders), 
        chainBlocks[chain],
        chain, 
        transform
      );

    for (const yvToken of Object.values(contracts[chain].yvTokens)) {
      await unwrapYearn(balances, yvToken, chainBlocks[chain], chain, transform);
    };

    return balances;
  };
};

function staking(chain) {
  return async (timestamp, block, chainBlocks) => {
    return {};
  };
};

module.exports = {
  ethereum: {
    tvl: tvl('ethereum')
  },
  fantom: {
    tvl: tvl('fantom')
  }
}; // node test.js projects/alchemix.js