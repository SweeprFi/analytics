const addresses = {
  sweep: "0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574",
  sweepr: "0x89B1e7068bF8E3232dD8f16c35cAc45bDA584f4E"
}

const supportedNetworks = {
  mainnet: {
    rpc: "https://ethereum.publicnode.com",
    alchemy: "https://eth-mainnet.alchemyapi.io/v2/"
  },
  arbitrum: {
    rpc: "https://arb1.arbitrum.io/rpc",
    alchemy: "https://arb-mainnet.g.alchemy.com/v2/"
  },
  optimism: {
    rpc: "https://mainnet.optimism.io",
    alchemy: "https://opt-mainnet.g.alchemy.com/v2/"
  },
  base: {
    rpc: "https://mainnet.base.org",
    alchemy: "https://base-mainnet.g.alchemy.com/v2/"
  },
  // bnb: {
  //   rpc: "https://bscrpc.com",
  //   alchemy: ""
  // },
  polygon: {
    rpc: "https://polygon.llamarpc.com",
    alchemy: "https://polygon-mainnet.g.alchemy.com/v2/"
  },
  // avalanche: {
  //   rpc: "",
  //   alchemy: ""
  // },
  // celo: {
  //   rpc: "",
  //   alchemy: ""
  // },
}

module.exports = {
  addresses,
  supportedNetworks
}