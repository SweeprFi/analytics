const { ethers } = require("ethers");
const { Multicall } = require('ethereum-multicall');
const { supportedNetworks } = require("../utils/constants");

class Provider {
  constructor() {
    this.alchemyProviders = {};
    this.rpcsProviders = {};

    this.initProviders();
  }

  initProviders() {
    Object.keys(supportedNetworks).forEach(net => {
      this.alchemyProviders[net] = new ethers.AlchemyProvider(net, null);
      this.rpcsProviders[net] = supportedNetworks[net].rpc;
    });
  }

  setProvider(name, key) {
    if (!!supportedNetworks[key]) {
      this.rpcsProviders[name] = supportedNetworks[key] + key;
      this.alchemyProviders[name] = new ethers.AlchemyProvider(name, key);
    }
  }

  getAlchemyProvider(name) {
    return this.alchemyProviders[name];
  }

  getMulticall(network) {
    const rpc = this.rpcsProviders[network];
    return new Multicall({ nodeUrl: rpc, tryAggregate: true });
  }
}

module.exports = Provider;