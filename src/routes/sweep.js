const express = require('express');
const router = express.Router();
const { Multicall } = require('ethereum-multicall');

const { networks, RPCs, addresses } = require("../utils/constants");
const Sweep = require("../contracts/sweep");
const sweep = new Sweep(addresses.sweep);

router.get('/sweep', async (req, res) => {
    try {
        const response = {};
        const resposnses = await Promise.all(networks.map(async (net) => {
            var mc = new Multicall({ nodeUrl: RPCs[net], tryAggregate: true });
            return { [`${net}`]: await sweep.fetchData(mc) };
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

router.get('/sweep/:network', async (req, res) => {
    try {
        const rpc = RPCs[req.params.network];
        const mc = new Multicall({ nodeUrl: rpc, tryAggregate: true });
        const response = await sweep.fetchData(mc);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.get('/sweep-allowance', async (req, res) => {
    try {
        const { network, owner, spender } = req.query;
        const response = await sweep.getAllowance(network, owner, spender);
        console.log(response);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.get('/sweep-balance', async (req, res) => {
    try {
        const { network, account } = req.query;
        const response = await sweep.getBalance(network, account);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.get('/sweep-minters', async (req, res) => {
    try {
        const { network } = req.query;
        const response = await sweep.getMinters(network);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.get('/sweep-minter', async (req, res) => {
    try {
        const { network, account } = req.query;
        const response = await sweep.getMinter(network, account);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.get('/sweep-valid-minter', async (req, res) => {
    try {
        const { network, minter } = req.query;
        const response = await sweep.validMinter(network, minter);
        res.json({ response });
    } catch (error) {
        res.json({ error: error.message });
    }
});

module.exports = router;
