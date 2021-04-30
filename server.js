const express = require("express");
const path = require("path");
const { stringify } = require("querystring");

const app = express();
const port = process.env.PORT || "3000";

app.use(express.static('public'))

app.listen(port, () => {
    console.log("Listening to requests on http://localhost:" + port);
});