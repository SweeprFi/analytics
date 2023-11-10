const { ethers } = require("ethers");
const sweeprABI = require("../abis/sweepr.json");
const { format, safeGet } = require("../utils/helper");
const { sweeprRequestedData, addresses } = require("../utils/constants");

class Sweepr {
  constructor(provider) {
    this.abi = sweeprABI;
    this.provider = provider
    this.address = addresses.sweepr;
  }

  sweepr(network) {
    const provider = this.provider.getAlchemyProvider(network);
    return new ethers.Contract(this.address, this.abi, provider);
  }

  async fetchData(network) {
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(sweeprRequestedData);
    const callInfo = {
      reference: 'sweepr',
      contractAddress: this.address,
      abi: this.abi,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['sweepr']['callsReturnContext'];
    const result = {};
    keys.forEach((key, index) => {
      result[key] = safeGet(sweeprRequestedData[key], data, index)
    });
    return result;
  }

  async getAllowance(network, owner, spender) {
    const sweepr = this.sweepr(network);
    const allowance = await sweepr.allowance(owner, spender);
    return { allowance: format(allowance) }
  }

  async getBalance(network, account) {
    const sweepr = this.sweepr(network);
    const balance = await sweepr.balanceOf(account);
    return { balance: format(balance) }
  }
}

module.exports = Sweepr;
