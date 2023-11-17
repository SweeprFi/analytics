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
      const rpc = supportedNetworks[net].rpc;
      this.alchemyProviders[net] = new ethers.JsonRpcProvider(rpc);
      this.rpcsProviders[net] = rpc
    });
  }

  setProvider(name, key) {
    if (!!supportedNetworks[name]) {
      const newRPC = supportedNetworks[name].alchemy + key;
      this.rpcsProviders[name] = newRPC;
      this.alchemyProviders[name] = new ethers.JsonRpcProvider(newRPC);
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