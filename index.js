const Provider = require("./src/contracts/provider");
const Sweepr = require("./src/contracts/sweepr");
const Asset = require("./src/contracts/asset");
const Sweep = require("./src/contracts/sweep");
const AMM = require("./src/contracts/amm");
const Vesting = require("./src/contracts/vesting");
const MarketMaker = require("./src/contracts/market");
const DealNFT = require("./src/contracts/deal");

const index = {
    Provider,
    Sweepr,
    Asset,
    Sweep,
    AMM,
    Vesting,
    MarketMaker,
    DealNFT,
}

module.exports = index