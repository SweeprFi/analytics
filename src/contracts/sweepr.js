const { ethers } = require("ethers");
const sweeprABI = require("../abis/sweepr.json");
const { sweeprRequestedData, keys } = require("../utils/constants");

class Sweepr {
  constructor(address) {
    this.abi = sweeprABI;
    this.address = address;
  }

  async fetchData (multicall) {
    const callInfo = {
      reference: 'sweepr',
      contractAddress: this.address,
      abi: this.abi,
      calls: sweeprRequestedData.map(data => {
        return { reference: data+'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['sweepr']['callsReturnContext'];
    const result = {};
    sweeprRequestedData.forEach((reference, index) => {
      result[reference] = this.safeGet(data, index)
    });
    return result;
  }

  async getAllowance (network, owner, spender) {
    const provider = new ethers.AlchemyProvider(network, keys[network])
    const sweepr = new ethers.Contract(this.address, this.abi, provider);
    const allowance = await sweepr.allowance(owner, spender);
    return allowance.toString();
  }

  async getBalance (network, account) {
    const provider = new ethers.AlchemyProvider(network, keys[network])
    const sweepr = new ethers.Contract(this.address, this.abi, provider);
    const balance = await sweepr.balanceOf(account);
    return balance.toString();
  }

  // private
  safeGet = (data, index) => (data && data[index] && data[index].returnValues[0]);
}

module.exports = Sweepr;
