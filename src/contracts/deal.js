const { ethers } = require("ethers");
const dealABI = require("../abis/deal.json");
const tokenABI = require("../abis/erc20.json");
const { safeGet } = require("../utils/helper");
const {
  stakesRequestedData,
  dealRequestedData,
  tokenRequestData,
  dealCardData
} = require("../utils/data");

class DealNFT {
  constructor(provider) {
    this.abi = dealABI;
    this.provider = provider
  }

  deal(network, address) {
    const provider = this.provider.getAlchemyProvider(network);
    return new ethers.Contract(address, this.abi, provider);
  }

  token(network, address) {
    const provider = this.provider.getAlchemyProvider(network);
    return new ethers.Contract(address, tokenABI, provider);
  }

  async getClaimedData(network, address) {
    const deal = this.deal(network, address);
    const scrow = await deal.escrowToken();
    const token = this.token(network, scrow);
    const decimals = Number(await token.decimals());
    return await this._getStakesData(network, address, decimals);
  }

  async getDealData(network, address) {
    const result = {};
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(dealRequestedData);
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

    const deal = this.deal(network, address);
    const escrowAddress = await deal.escrowToken();
    const tokenData = await this._getTokenScrowData(network, escrowAddress);
    const decimals = tokenData.escrowDecimals;
    const claimed = await this._getStakesData(network, address, decimals);

    keys.forEach((key, index) => {
      result[key] = safeGet(dealRequestedData[key], data, index, decimals)
    });

    return {...result, ...tokenData, claimed };
  }

  async getDealCardData(network, address) {
    const result = {};
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(dealCardData);
    const callInfo = {
      reference: 'card',
      contractAddress: address,
      abi: this.abi,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['card']['callsReturnContext'];
    keys.forEach((key, index) => {
      result[key] = safeGet(dealCardData[key], data, index)
    });

    return result;
  }

  //----- internal functions -----//
  async _getTokenScrowData(network, address) {
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(tokenRequestData);
    const callInfo = {
      reference: 'token',
      contractAddress: address,
      abi: tokenABI,
      calls: keys.map(data => {
        return { reference: data + 'C', methodName: data }
      })
    }

    let callResults = await multicall.call(callInfo);
    const data = callResults.results['token']['callsReturnContext'];

    const result = {};
    keys.forEach((key, index) => {
      result[tokenRequestData[key].label] = safeGet(tokenRequestData[key], data, index)
    });

    return result;
  }

  async _getClaimedData(network, address, id, decimals) {
    const multicall = this.provider.getMulticall(network);
    const keys = Object.keys(stakesRequestedData);
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
      result[stakesRequestedData[key].label] = safeGet(stakesRequestedData[key], data, index, decimals)
    });

    result.nftId = id;
    return result;
  }

  async _getStakesData(network, address, decimals) {
    const deal = this.deal(network, address);
    const nextId = Number(await deal.nextId());
    let stakes = [];

    try {
      stakes = await deal.getStakesTo(nextId);
    } catch (error) {
      const promises = [];
      for (let index = 0; index < nextId; index++) {
        promises.push(this._getClaimedData(network, address, index, decimals));
      }
      stakes = await Promise.all(promises);
    }

    return stakes;
  }
}

module.exports = DealNFT;
