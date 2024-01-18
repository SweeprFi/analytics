const { ethers } = require("ethers");
const vestingABI = require("../abis/vestingApprover.json");
const tokenABI = require("../abis/erc20.json");
const { format } = require("../utils/helper");

class Vesting {
  constructor(provider) {
    this.abi = vestingABI;
    this.provider = provider;
  }

  async lockedAmount(network, address) {
    const provider = this.provider.getAlchemyProvider(network);
    const vesting = new ethers.Contract(address, this.abi, provider);
    const sweeprAddress = await vesting.sweepr();
    const sweepr = new ethers.Contract(sweeprAddress, tokenABI, provider);

    const vestingCount = await vesting.getVestingSchedulesCount();
    const beneficiaries = [];

    for (let index = 0; index < vestingCount; index++) {
      beneficiaries.push(vesting.beneficiaries(index));
    }

    const beneficiaryList = await Promise.all(beneficiaries);
    const lockedAmountsPromise = Promise.all(beneficiaryList.map(beneficiary => vesting.getLockedAmount(beneficiary)));
    const balancesPromise = Promise.all(beneficiaryList.map(beneficiary => sweepr.balanceOf(beneficiary)));
    const [lockedAmounts, balances] = await Promise.all([lockedAmountsPromise, balancesPromise]);
    const amounts = beneficiaryList.map((beneficiary, index) => Math.min(format(lockedAmounts[index]), format(balances[index])));

    let locked = 0;
    amounts.forEach(amount => { locked += amount; })

    return { locked };
  }
}

module.exports = Vesting;
