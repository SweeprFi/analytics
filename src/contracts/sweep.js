const { ethers } = require("ethers");
const sweepABI = require("../abis/sweep.json");
const { sweepRequestedData, addresses } = require("../utils/constants");

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
    const callInfo = {
      reference: 'sweep',
      contractAddress: this.address,
      abi: this.abi,
      calls: sweepRequestedData.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['sweep']['callsReturnContext'];
    const result = {};
    sweepRequestedData.forEach((reference, index) => {
      result[reference] = this.safeGet(data, index)
    });
    return result;
  }

  async getAllowance(network, owner, spender) {
    const sweep = this.sweep(network);
    const allowance = await sweep.allowance(owner, spender);
    return { allowance: allowance.toString() }
  }

  async getBalance(network, account) {
    const sweep = this.sweep(network);
    const balance = await sweep.balanceOf(account);
    return { balance: balance.toString() }
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
      maxAmount: minter[0].toString(),
      mintedAmount: minter[1].toString(),
      isListed: minter[2],
      isEnabled: minter[3]
    };
  }

  async validMinter(network, minter) {
    const sweep = this.sweep(network);
    const isValid = await sweep.isValidMinter(minter);
    return isValid;
  }

  // private
  safeGet = (data, index) => (data && data[index] && data[index].returnValues[0]);
}

module.exports = Sweep;
