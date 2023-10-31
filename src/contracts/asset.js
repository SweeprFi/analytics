const assetABI = require("../abis/asset.json");
const { assetRequestedData } = require("../utils/constants");

class Asset {
  constructor() {
    this.abi = assetABI;
  }

  async fetchData (multicall, address) {
    const callInfo = {
      reference: 'stabilizer',
      contractAddress: address,
      abi: this.abi,
      calls: assetRequestedData.map(data => {
        return { reference: data+'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['stabilizer']['callsReturnContext'];
    const result = {};
    assetRequestedData.forEach((reference, index) => {
      result[reference] = this.safeGet(data, index)
    });
    return result;
  }

  // private
  safeGet = (data, index) => (data && data[index] && data[index].returnValues[0]);
}

module.exports = Asset;
