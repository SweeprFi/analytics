const { ethers } = require("ethers");
const dealABI = require("../abis/deal.json");
const { safeGet } = require("../utils/helper");
const { dealRequestedData, dealsRequestedData } = require("../utils/data");

class DealNFT {
  constructor(provider) {
    this.abi = dealABI;
    this.provider = provider
  }

  deal(network, address) {
    const provider = this.provider.getAlchemyProvider(network);
    return new ethers.Contract(address, this.abi, provider);
  }

  async getClaimedData(network, address, id) {
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(dealRequestedData);
    const callInfo = {
      reference: 'deal',
      contractAddress: address,
      abi: this.abi,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data, methodParameters: [id] }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['deal']['callsReturnContext'];

    const result = {};
    keys.forEach((key, index) => {
      result[dealRequestedData[key].label] = safeGet(dealRequestedData[key], data, index)
    });

    return result;
  }

  async getDealData(network, address) {
    const result = {};
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(dealsRequestedData);
    const callInfo = {
      reference: 'deals',
      contractAddress: address,
      abi: this.abi,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['deals']['callsReturnContext'];

    keys.forEach((key, index) => {
      result[key] = safeGet(dealsRequestedData[key], data, index)
    });

    return result;
  }

  async getNextId(network, address) {
    const deal = this.deal(network, address);
    const nextId = await deal.nextId();
    return { nextId: Number(nextId) };
  }
}

module.exports = DealNFT;
