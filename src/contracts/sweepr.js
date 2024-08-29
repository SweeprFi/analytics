const { ethers } = require("ethers");

const sweeprABI = require("../abis/sweepr.json");
const { addresses } = require("../utils/constants");
const { format, safeGet } = require("../utils/helper");
const { sweeprRequestedData } = require("../utils/data");
const NETWORKS = ["mainnet", "arbitrum", "optimism", "base", "avalanche", "polygon", "bsc"]

class Sweepr {
  constructor(provider) {
    this.abi = sweeprABI;
    this.provider = provider
    this.address = addresses.sweepr;
  }

  sweepr(network) {
    if(NETWORKS.includes(network)) {
      const provider = this.provider.getAlchemyProvider(network);
      return new ethers.Contract(this.address, this.abi, provider);
    }
    return null;
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
    if(!sweepr) return { allowance: 0 }

    const allowance = await sweepr.allowance(owner, spender);
    return { allowance: format(allowance) }
  }

  async getBalance(network, account) {
    const sweepr = this.sweepr(network);
    if(!sweepr) return { balance: 0 }
    
    const balance = await sweepr.balanceOf(account);
    return { balance: format(balance) }
  }

  async getTotalSupply(network) {
    const sweepr = this.sweepr(network);
    if(!sweepr) return { totalSupply: 0 }

    const totalSupply = await sweepr.totalSupply();
    return { totalSupply: format(totalSupply) }
  }

  async getTotalMinted(network) {
    const sweepr = this.sweepr(network);
    if(!sweepr) return { totalMinted: 0 }

    const totalMinted = await sweepr.totalMinted();
    return { totalMinted: format(totalMinted) }
  }
}

module.exports = Sweepr;
