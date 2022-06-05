const { getToken, validateToken, twitchSearch } = require("./twitch.js");
const express = require("express");
const redis = require("redis");
const app = express();
var cors = require("cors");
const axios = require("axios");

var cron = require("node-cron");
require("dotenv").config();

// const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

const client = redis.createClient({ url: process.env.REDISCLOUD_URL });
client.connect();

// MIDDLEWARE
app.use(cors());

// Middleware to reference the react 'build' for heroku
app.use(express.static("build"));

// Validation middleware
app.use((req, res, next) => {
    // this can be put in a node module.
    cron.schedule("0 0 */1 * *", () => {
        validateToken();
    });
    next();
});

// Get token route
app.get("/token", (req, res) => {});

// Search route
app.get("/search/:channels", async (req, res) => {
    const { channels } = req.params;
    const results = await twitchSearch(channels, CLIENT_ID);
    // console.log(results);
    res.send(results);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("App is running on port " + port);
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
// });
