const assetABI = require("../abis/asset.json");
const { safeGet } = require("../utils/helper");
const { assetRequestedData } = require("../utils/data");

class Asset {
  constructor(provider) {
    this.abi = assetABI;
    this.provider = provider;
  }

  async fetchData(network, address) {
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(assetRequestedData);
    const callInfo = {
      reference: 'stabilizer',
      contractAddress: address,
      abi: this.abi,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['stabilizer']['callsReturnContext'];
    const result = {};
    keys.forEach((key, index) => {
      result[key] = safeGet(assetRequestedData[key], data, index)
    });

    return result;
  }
}

module.exports = Asset;
