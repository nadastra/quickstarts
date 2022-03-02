// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// ------------------------------------------------------------

const express = require('express');
const bodyParser = require('body-parser');
const isEmpty = require('lodash/isEmpty');
const cors = require('cors');
require('isomorphic-fetch');

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: 'http://wildflycontainerqs-75cb78889c-hxqnc.af302b6b0eae45b58299.australiaeast.aksapp.io'}));

// These ports are injected automatically into the container.
const daprPort = process.env.DAPR_HTTP_PORT || 3500; 
const daprGRPCPort = process.env.DAPR_GRPC_PORT || 50001;

const methodName = 'time';
//const timemsUrl = `http://localhost:${daprPort}/v1.0/invoke/nodems/method/${methodName}`; one way to invoke
//const timemsUrl = `http://dapr-app-id:timems@localhost:${daprPort}/${methodName}`; //another way to invoke
const port = 3000;

/*app.get('/order', (_req, res) => {
    fetch(`${stateUrl}/order`)
        .then((response) => {
            if (!response.ok) {
                throw "Could not get state.";
            }

            return response.text();
        }).then((orders) => {
            res.send(orders);
        }).catch((error) => {
            console.log(error);
            res.status(500).send({message: error});
        });
});*/

app.get('/echo', (_req, res) => {
        console.log("Got a /get on nodeapp");
        //get time to echo back
        let ctime ='';
        fetch(`http://dapr-app-id:timems@localhost:${daprPort}/${methodName}`)
        .then((response) => {
            if (response.status !== 200) {
                res.status(500).send({message: response.status + ":" + response.statusText});
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            res.status(200).send({message: "echo back time after time: " + data.time});  
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({message: error});
        });
          
});

/*app.post('/neworder', (req, res) => {
    const data = req.body.data;
    const orderId = data.orderId;
    console.log("Got a new order! Order ID: " + orderId);

    const state = [{
        key: "order",
        value: data
    }];

    fetch(stateUrl, {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (!response.ok) {
            throw "Failed to persist state.";
        }

        console.log("Successfully persisted state.");
        res.status(200).send();
    }).catch((error) => {
        console.log(error);
        res.status(500).send({message: error});
    });
});*/

app.post('/echo', (req, res) => {
    
    if (isEmpty(req.body) || !req.body.message) {
        res.status(500).send({message: "nothing to echo back"});
    }
    const message = req.body.message;
    console.log("Got a message: " + message);
    
    res.status(200).send({message: `echo ${message}`});
   
});

app.get('/ports', (_req, res) => {
    console.log("DAPR_HTTP_PORT: " + daprPort);
    console.log("DAPR_GRPC_PORT: " + daprGRPCPort);
    res.status(200).send({DAPR_HTTP_PORT: daprPort, DAPR_GRPC_PORT: daprGRPCPort })
});

app.listen(port, () => console.log(`Node App listening on port ${port}!`));
