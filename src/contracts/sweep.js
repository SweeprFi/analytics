const { ethers } = require("ethers");

const sweepABI = require("../abis/sweep.json");
const { addresses } = require("../utils/constants");
const { format, safeGet } = require("../utils/helper");
const { sweepRequestedData } = require("../utils/data");

class Sweep {
  constructor(provider) {
    this.abi = sweepABI;
    this.provider = provider;
    this.address = addresses.sweep;
  }

  sweep(network) {
    const provider = this.provider.getAlchemyProvider(network);
    return new ethers.Contract(this.address, this.abi, provider);
  }

  async fetchData(network) {
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(sweepRequestedData);
    const callInfo = {
      reference: 'sweep',
      contractAddress: this.address,
      abi: this.abi,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['sweep']['callsReturnContext'];
    const result = {};
    keys.forEach((key, index) => {
      result[key] = safeGet(sweepRequestedData[key], data, index)
    });
    return result;
  }

  async getTotalSupply(network) {
    const sweep = this.sweep(network);
    const totalSupply = await sweep.totalSupply();
    return { totalSupply: format(totalSupply) }
  }

  async getAllowance(network, owner, spender) {
    const sweep = this.sweep(network);
    const allowance = await sweep.allowance(owner, spender);
    return { allowance: format(allowance) }
  }

  async getBalance(network, account) {
    const sweep = this.sweep(network);
    const balance = await sweep.balanceOf(account);
    return { balance: format(balance) }
  }

  async getMinters(network) {
    const sweep = this.sweep(network);
    const minters = await sweep.getMinters();
    return { minters };
  }

  async getMinter(network, account) {
    const sweep = this.sweep(network);
    const minter = await sweep.minters(account);
    return {
      maxAmount: format(minter[0]),
      mintedAmount: format(minter[1]),
      isListed: minter[2],
      isEnabled: minter[3]
    };
  }

  async validMinter(network, minter) {
    const sweep = this.sweep(network);
    const isValidMinter = await sweep.isValidMinter(minter);
    return { isValidMinter };
  }

  async getPrice(network) {
    const sweep = this.sweep(network);
    const ammPrice = await sweep.ammPrice();
    return { ammPrice: format(ammPrice, 6) };
  }

  async getTWAPrice(network) {
    const sweep = this.sweep(network);
    const price = await sweep.twaPrice();
    return { twaPrice: format(price, 6) };
  }

  async getTargetPrice(network) {
    const sweep = this.sweep(network);
    const target = await sweep.targetPrice();
    return { targetPrice: format(target, 6) };
  }
}

module.exports = Sweep;
