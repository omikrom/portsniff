const express = require('express');
const app = express();
const port = 9000;
const users = require('./model/userModel');
const ipaddr = require('ipaddr.js');
const ip = require("ip");
const axios = require('axios');

const ServiceMonitor = require('./class/serviceMonitor.js');
const passwordBreach = require('./class/passwordBreach.js');
const rateLimiterUsingThirdParty = require('./middleware/rateLimiter.js');

app.use(express.json());
app.use(rateLimiterUsingThirdParty);
app.use(express.static('public'));
app.get('/', (req, res) => res.send(users));



app.get('/ip', (req, res) => {
    console.log(ip.address());
    var ipHeaders = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress
    console.log(ipHeaders);
});

app.get('/current-ip', function (req, res) {
    res.send(ip.address());
});



app.get('/ip2', (req, res) => {
    let remoteAddress = req.ip;
    if (ipaddr.isValid(remoteAddress)) {
        const addr = ipaddr.parse(remoteAddress);
        if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
            remoteAddress = addr.toIPv4Address().toString();
        }
    }
    res.json({
        remoteAddress,
    });
});

app.get('/iptest', async (req, res) => {
    //let minRange = req.body.min;
    //let maxRange = req.body.max;
    let minRange = 0;
    let maxRange = 1000;
    var status = await pingIp(ip.address(), minRange, maxRange);

    //console.log('status', status);
    res.setHeader('Content-Type', 'application/json');

    //status = JSON.parse(JSON.stringify(status));
    res.send(status).status(200).end();

});

app.get('/pwned', async (req, res) => {
    //var password = req.body.clientPassword.toString();
    var password = "password123";
    var status = {};
    try {
        status = await passwordBreach(password);
        console.log('status', status);
    } catch (err) {
        console.log('err', err);
    }

    res.send(status).status(200).end();
});


async function pingIp(ip, min, max) {

    // generate services from ip
    let services = []

    for (let i = min; i < max; i++) {
        services.push({
            service: ip,
            port: i,
            timeout: 1000,
            attempts: 1
        });
    }

    let status = await new ServiceMonitor(services).monitor();
    //console.log(status.openPorts);
    return status;
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});

