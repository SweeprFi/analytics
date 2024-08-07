/*
TYPES =>
  1: Number
  2: date
  3: seconds
  4: boolean
  5: Number without formating
  6: address
  7: string
*/

const defaultData = {
  1: 0, 2: '', 3: 0, 4: "false", 5: 0,
  6: '0x0000000000000000000000000000000000000000',
  7: ''
}

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
  borrower: { type: 6 },
  sweepBorrowed: { type: 1, decimals: 18 },
  loanLimit: { type: 1, decimals: 18 },
  currentValue: { type: 1, decimals: 6 },
  assetValue: { type: 1, decimals: 6 },
  getEquityRatio: { type: 1, decimals: 6 },
  getJuniorTrancheValue: { type: 1, decimals: 6 },
  name: { type: 7 },
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

const stakesRequestedData = {
  claimedAmount: { type: 1, label: "ClaimedAmount" },
  stakedAmount: { type: 1, label: "StakedAmount" },
  ownerOf: { type: 6, label: "Owner" },
  getTokenBoundAccount: { type: 6, label: "TokenBoundAccount" }
}

const dealRequestedData = {
  closingTime: { type: 5 },
  closingDelay: { type: 5 },
  dealMaximum: { type: 1 },
  dealMinimum: { type: 1 },
  totalClaimed: { type: 1 },
  totalStaked: { type: 1 },
  unstakingFee: { type: 1, decimals: 4 },
  nextId: { type: 1, decimals: 0 },
  description: { type: 7 },
  escrowToken: { type: 6 },
  sponsor: { type: 6 },
  state: { type: 6 }, // uint8
  twitter: { type: 7 },
  website: { type: 7 },
  name: { type: 7 },
  symbol: { type: 7 },
  image: { type: 7 },
  arbitrator: { type: 6 },
  stakersWhitelist: { type: 6 },
  claimsWhitelist: { type: 6 },
  transferable: { type: 4 },
  price: { type: 1, decimals: 6 },
  multiplier: { type: 1, decimals: 18 },
}

const tokenRequestData = {
  symbol: { type: 7, label: "escrowSymbol" },
  name: { type: 7, label: "escrowName" },
  decimals: { type: 6, label: "escrowDecimals" } // uint8
}

const dealCardData = {
  name: { type: 7 },
  image: { type: 7 },
  state: { type: 6 }, // uint8
  description: { type: 7 },
}

module.exports = {
  sweepRequestedData,
  sweeprRequestedData,
  assetRequestedData,
  stakesRequestedData,
  dealRequestedData,
  tokenRequestData,
  dealCardData,
  defaultData
}