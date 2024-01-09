const ammABI = require("../abis/amm.json");
const sweepABI = require("../abis/sweep.json");

const { addresses } = require("../utils/constants");
const { safeGet, parser } = require("../utils/helper");

class AMM {
  constructor(provider) {
    this.provider = provider;
  }

  async fetchData(network, ammAddress, tokenId) {
    const multicall = this.provider.getMulticall(network);

    const callInfo = [
      {
        reference: 'sweep',
        contractAddress: addresses.sweep,
        abi: sweepABI,
        calls: [{ reference: 'target', methodName: 'targetPrice' }]
      },
      {
        reference: 'amm',
        contractAddress: ammAddress,
        abi: ammABI,
        calls: tokenId.map((id, index) => {
          return { reference: `position${index}`, methodName: 'getPositions', methodParameters: [id] }
        })
      }
    ]

    let callResults = await multicall.call(callInfo);
    const sweepData = callResults.results['sweep']['callsReturnContext'];
    const ammData = callResults.results['amm']['callsReturnContext'];

    const target = safeGet({ type: 1, decimals: 6 }, sweepData, 0);
    const position = ammData.length > 0 ? ammData : [];

    // TODO: remove fixed decimals
    const dec = network === 'bsc' ? 18 : 6;
    const usdxPosition = this.sum(position, 0, dec);
    const sweepPosition = this.sum(position, 1, 18);
    const lpPosition = this.sum(position, 2, 18);

    return {
      position: {
        usdxAmount: usdxPosition,
        sweepAmount: sweepPosition,
        lp: lpPosition,
        sweepValue: (sweepPosition * target)
      }
    };
  }

  sum = (positions, index, decimals) => {
    var total = 0;
    positions.forEach(position => {
      total += parser(parseInt(position?.returnValues[index]?.hex, 16), decimals)
    });

    return total;
  }
}

module.exports = AMM;
