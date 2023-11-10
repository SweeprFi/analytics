const addresses = {
  sweep: "0xB88a5Ac00917a02d82c7cd6CEBd73E2852d43574",
  sweepr: "0x89B1e7068bF8E3232dD8f16c35cAc45bDA584f4E"
}

// TYPES => 1: Number | 2: date | 3: seconds | 4: address~boolean
const sweepRequestedData = {
  ammPrice: { type: 1, decimals: 6 },
  arbSpread: { type: 1, decimals: 0 },
  circulatingSupply: { type: 1, decimals: 18 },
  currentInterestRate: { type: 1, decimals: 6 },
  currentPeriodStart: { type: 2 },
  currentTargetPrice: { type: 1, decimals: 6 },
  daysInterest: { type: 1, decimals: 0 },
  interestRate: { type: 1, decimals: 6 },
  isMintingAllowed: { type: 4 },
  nextInterestRate: { type: 1, decimals: 6 },
  nextPeriodStart: { type: 2 },
  nextTargetPrice: { type: 1, decimals: 6 },
  periodStart: { type: 2 },
  stepValue: { type: 1, decimals: 0 },
  targetPrice: { type: 1, decimals: 6 },
  totalSupply: { type: 1, decimals: 18 },
  twaPrice: { type: 1, decimals: 6 }
}

const sweeprRequestedData = {
  circulatingSupply: { type: 1, decimals: 18 },
  isGovernanceChain: { type: 4 },
  price: { type: 1, decimals: 6 },
  totalMinted: { type: 1, decimals: 18 },
}

const assetRequestedData = {
  borrower: { type: 4 },
  sweepBorrowed: { type: 1, decimals: 18 },
  loanLimit: { type: 1, decimals: 18 },
  currentValue: { type: 1, decimals: 6 },
  assetValue: { type: 1, decimals: 6 },
  getEquityRatio: { type: 1, decimals: 6 },
  getJuniorTrancheValue: { type: 1, decimals: 6 },
  name: { type: 4 },
  getDebt: { type: 1, decimals: 18 },
  accruedFee: { type: 1, decimals: 18 },
  minEquityRatio: { type: 1, decimals: 6 },
  callDelay: { type: 3 },
  callAmount: { type: 1, decimals: 18 },
  callTime: { type: 2 },
  spreadFee: { type: 1, decimals: 6 },
  spreadDate: { type: 2 },
  autoInvestMinRatio: { type: 1, decimals: 6 },
  autoInvestMinAmount: { type: 1, decimals: 18 },
  autoInvestEnabled: { type: 4 },
  settingsEnabled: { type: 4 },
  startingTime: { type: 2 },
  startingPrice: { type: 1, decimals: 6 },
  decreaseFactor: { type: 1, decimals: 6 },
  minLiquidationRatio: { type: 1, decimals: 6 },
  auctionAllowed: { type: 4 },
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
  }
}

module.exports = {
  addresses,
  sweepRequestedData,
  sweeprRequestedData,
  assetRequestedData,
  supportedNetworks
}