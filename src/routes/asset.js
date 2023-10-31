const express = require('express');
const router = express.Router();
const { Multicall } = require('ethereum-multicall');

const { RPCs, addresses } = require("../utils/constants");
const Sweep = require("../contracts/sweep");
const Asset = require("../contracts/asset");

const sweep = new Sweep(addresses.sweep);
const asset = new Asset();

router.get('/asset', async (req, res) => {
    try {
        const { network, address } = req.query;

        const rpc = RPCs[network];
        const isValid = await sweep.validMinter(network, address);
        if(!isValid) throw new Error("Invalid asset");

        const mc = new Multicall({ nodeUrl: rpc, tryAggregate: true });
        const response = await asset.fetchData(mc, address); 

        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

module.exports = router;
