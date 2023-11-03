const addresses = {
  sweep: "0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574",
  sweepr: "0x89B1e7068bF8E3232dD8f16c35cAc45bDA584f4E"
}

const sweepRequestedData = [
  'ammPrice',
  'arbSpread',
  'circulatingSupply',
  'currentInterestRate',
  'currentPeriodStart',
  'currentTargetPrice',
  'daysInterest',
  'interestRate',
  'isMintingAllowed',
  'nextInterestRate',
  'nextPeriodStart',
  'nextTargetPrice',
  'periodStart',
  'stepValue',
  'targetPrice',
  'totalSupply',
  'twaPrice'
]

const sweeprRequestedData = [
  'circulatingSupply',
  'isGovernanceChain',
  'price',
  'totalMinted'
]

const assetRequestedData = [
  'borrower',
  'sweepBorrowed',
  'loanLimit',
  'currentValue',
  'assetValue',
  'getEquityRatio',
  'getJuniorTrancheValue',
  'name',
  'getDebt',
  'accruedFee',
  'minEquityRatio',
  'callDelay',
  'callAmount',
  'callTime',
  'spreadFee',
  'spreadDate',
  'autoInvestMinRatio',
  'autoInvestMinAmount',
  'autoInvestEnabled',
  'settingsEnabled',
  'startingTime',
  'startingPrice',
  'decreaseFactor',
  'minLiquidationRatio',
  'auctionAllowed'
]

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
  }
}

module.exports = {
  addresses,
  sweepRequestedData,
  sweeprRequestedData,
  assetRequestedData,
  supportedNetworks
}