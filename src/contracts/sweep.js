const { ethers } = require("ethers");
const { BalancerSDK } = require("@balancer-labs/sdk");

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

  async getPrice(network, poolId, token) {
    const RPC = this.provider.getRPCProvider(network);
    const chainId = this.provider.getChain(network);
    const balancer = new BalancerSDK({ network: chainId, rpcUrl: RPC });

    const pool = await balancer.pools.find(poolId);
    const spotPrice = await pool.calcSpotPrice(token, this.address);

    return { ammPrice: Number(Number(spotPrice).toFixed(5)) }
  }
}

module.exports = Sweep;
