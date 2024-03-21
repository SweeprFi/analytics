const { ethers } = require("ethers");
const marketABI = require("../abis/marketMaker.json");
const { safeGet } = require("../utils/helper");

class MarketMaker {
  constructor(provider) {
    this.abi = marketABI;
    this.provider = provider
  }

  market(network, address) {
    const provider = this.provider.getAlchemyProvider(network);
    return new ethers.Contract(address, this.abi, provider);
  }

  async getPositions(network, address, grow) {
    const multicall = this.provider.getMulticall(network);
    const keys = grow ? ['tradePosition', 'redeemPosition', 'growPosition'] : ['tradePosition', 'redeemPosition'];
    const callInfo = {
      reference: 'market',
      contractAddress: address,
      abi: this.abi,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['market']['callsReturnContext'];

    const result = keys.map((_key, index) => {
      return safeGet({ type: 1, decimals: 0 }, data, index)
    });

    return result;
  }
}

module.exports = MarketMaker;
