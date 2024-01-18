const { ethers } = require("ethers");
const vestingABI = require("../abis/vestingApprover.json");
const { format } = require("../utils/helper");

class Vesting {
  constructor(provider) {
    this.abi = vestingABI;
    this.provider = provider;
  }

  async lockedAmount(network, address) {
    const provider = this.provider.getAlchemyProvider(network);
    const vesting = new ethers.Contract(address, this.abi, provider);

    const vestingCount = await vesting.getVestingSchedulesCount();
    const beneficiaries = [];

    for (let index = 0; index < vestingCount; index++) {
      beneficiaries.push(vesting.beneficiaries(index));
    }

    const beneficiaryList = await Promise.all(beneficiaries);
    const amounts = await Promise.all(beneficiaryList.map(beneficiary => vesting.getLockedAmount(beneficiary)));

    let locked = 0;
    amounts.forEach(amount => { locked += format(amount); })

    return { locked };
  }
}

module.exports = Vesting;
