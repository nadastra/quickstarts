// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
// ------------------------------------------------------------

const express = require('express');
const app = express();

// These ports are injected automatically into the container.
const daprPort = process.env.DAPR_HTTP_PORT || 3500; 
const daprGRPCPort = process.env.DAPR_GRPC_PORT || 50001;

const port = 3001;

app.get('/time', (_req, res) => {  
        let date = new Date();
        let hours = date.getHours();
        let mins = date.getMinutes();
        let secs = date.getSeconds();
        let ctime = hours + "h:" + mins + "m:" + secs + "s";
        console.log ("current time: " + ctime);
        res.status(200).send({time: ctime});    
});

app.get('/ports', (_req, res) => {
    console.log("DAPR_HTTP_PORT: " + daprPort);
    console.log("DAPR_GRPC_PORT: " + daprGRPCPort);
    res.status(200).send({DAPR_HTTP_PORT: daprPort, DAPR_GRPC_PORT: daprGRPCPort })
});

app.listen(port, () => console.log(`Time micro service listening on port- ${port}!`));
