const erc20ABI = require("../abis/erc20.json");
const sweepABI = require("../abis/sweep.json");
const assetABI = require("../abis/uniAsset.json");
const helperABI = require("../abis/liquidityHelper.json");

const { safeGet, parser } = require("../utils/helper");
const { uniswapAssetRequestedData } = require("../utils/data");

class Uniswap {
  constructor(provider) {
    this.provider = provider;
  }

  async fetchData(network, asset, helper, pool) {
    const multicall = this.provider.getMulticall(network);
    const data = await this.fetchAsset(multicall, asset);
    const flag = (data.token0 === data.sweep);

    const callInfo = [
      {
        reference: 'sweep',
        contractAddress: data.sweep,
        abi: sweepABI,
        calls: [
          { reference: 'balanceAsset', methodName: 'balanceOf', methodParameters: [asset] },
          { reference: 'balancePool', methodName: 'balanceOf', methodParameters: [pool] },
          { reference: 'target', methodName: 'targetPrice' },
        ]
      },
      {
        reference: 'usdx',
        contractAddress: data.usdx,
        abi: erc20ABI,
        calls: [
          { reference: 'balanceAsset', methodName: 'balanceOf', methodParameters: [asset] },
          { reference: 'balancePool', methodName: 'balanceOf', methodParameters: [pool] },
        ]
      },
      {
        reference: 'helper',
        contractAddress: helper,
        abi: helperABI,
        calls: [
          {
            reference: 'tokenAmount',
            methodName: 'getTokenAmountsFromLP',
            methodParameters: [data.tokenId, data.token0, data.token1, 500]
          },
        ]
      },
    ]
    let callResults = await multicall.call(callInfo);

    const sweep = callResults.results['sweep']['callsReturnContext'];
    const usdx = callResults.results['usdx']['callsReturnContext'];
    const helpers = callResults.results['helper']['callsReturnContext'];

    const sweepAsset = safeGet({ type: 1, decimals: 18 }, sweep, 0);
    const sweepPool = safeGet({ type: 1, decimals: 18 }, sweep, 1);
    const target = safeGet({ type: 1, decimals: 6 }, sweep, 2);

    return {
      uniswapAsset: {
        sweepAmount: sweepAsset,
        usdxAmount: safeGet({ type: 1, decimals: 6 }, usdx, 0),
        sweepInTarget: sweepAsset * target,
        position: this._getPositions(helpers[0].returnValues, flag)
      },
      uniswapPool: {
        sweepAmount: sweepPool,
        usdxAmount: safeGet({ type: 1, decimals: 6 }, usdx, 1),
        sweepInTarget: (sweepPool * target)
      }
    };
  }

  async fetchAsset(multicall, address) {
    const keys = Object.keys(uniswapAssetRequestedData);
    const callInfo = {
      reference: 'asset',
      contractAddress: address,
      abi: assetABI,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['asset']['callsReturnContext'];
    const result = {};
    keys.forEach((key, index) => {
      result[key] = safeGet(uniswapAssetRequestedData[key], data, index)
    });
    return result;
  }

  _getPositions(data, flag) {
    let tokenSweep, tokenUsdx;
    if (data.length > 0) {
      tokenSweep = flag ? data[0] : data[1];
      tokenUsdx = flag ? data[1] : data[0];
      return {
        sweepAmount: parser(parseInt(tokenSweep.hex, 16), 18),
        usdxAmount: parser(parseInt(tokenUsdx.hex, 16), 6)
      }
    } else {
      return { sweepAmount: 0, usdxAmount: 0 }
    }
  }

}

module.exports = Uniswap;
