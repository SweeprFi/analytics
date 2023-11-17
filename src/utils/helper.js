const { ethers } = require("ethers");

const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const safeGet = (reference, data, index) => {
  if (data && data[index]) {
    let value = data[index].returnValues[0];
    switch (reference.type) {
      case 1:
        return parser(parseInt(value?.hex, 16), reference.decimals);
      case 2:
        return toDate(parseInt(value?.hex, 16));
      case 3:
        return value/(60*60*24);
      default:
        return value;
    }
  }
  return;
}

const parser = (v, d, p = 5) => {
  if(!v) return 0;
  return Number((v / (10 ** d)).toFixed(p));
}

const format = (value, p = 5) => {
  return Number(Number(ethers.formatUnits(value,18)).toFixed(p));
}

const toDate = (value) => {
  if (value === 0) return '-';
  const date = new Date(value * 1000);
  return month[date.getMonth()] + ' ' + date.getDate() + ', ' + zeroToNum(date.getHours()) + ':' + zeroToNum(date.getMinutes());
}

const zeroToNum = (val) => {
  return ('00' + val).slice(-2);
}

module.exports = { parser, format, toDate, safeGet }
