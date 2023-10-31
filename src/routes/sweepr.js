const express = require('express');
const router = express.Router();
const { Multicall } = require('ethereum-multicall');

const { networks, RPCs, addresses } = require("../utils/constants");
const Sweepr = require("../contracts/sweepr");
const sweepr = new Sweepr(addresses.sweepr);

router.get('/sweepr', async (req, res) => {
    try {
        const response = {};
        const resposnses = await Promise.all(networks.map(async (net) => {
            var mc = new Multicall({ nodeUrl: RPCs[net], tryAggregate: true });
            return { [`${net}`]: await sweepr.fetchData(mc) };
        }));

        resposnses.forEach(resp => {
            const net = Object.keys(resp)[0];
            response[net] = resp[net];
        });

        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.get('/sweepr/:network', async (req, res) => {
    try {
        const rpc = RPCs[req.params.network];
        const mc = new Multicall({ nodeUrl: rpc, tryAggregate: true });
        const response = await sweepr.fetchData(mc);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.get('/sweepr-allowance', async (req, res) => {
    try {
        const { network, owner, spender } = req.query;
        const response = await sweepr.getAllowance(network, owner, spender);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.get('/sweepr-balance', async (req, res) => {
    try {
        const { network, account } = req.query;
        const response = await sweepr.getBalance(network, account);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

module.exports = router;
