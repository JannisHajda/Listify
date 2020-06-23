const express = require("express");
const axios = require("axios");
const app = express();
const qs = require("querystring");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "../.env" });

/*
    Configuration
*/

const PORT = process.env.PORT || 8080;
const CLIENT_ID = process.env.CLIENT_ID || "CLIENT_ID";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "CLIENT_SECRET";
const REDIRECT_URI = process.env.REDIRECT_URI || "REDIRECT_URI";

console.log(PORT, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

/*
    Handle requests
*/

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/auth/", async (req, res) => {
  if (req.body.code) {
    try {
      let code = req.body.code;
      let data = await axios({
        responseType: "json",
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        data: qs.stringify({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });
      res.status(200);
      res.send(data.data);
    } catch (e) {
      res.status(500);
      res.send(e.response.data);
    }
  } else {
    res.status(400);
    res.send("Please provide a code!");
  }
});

app.post("/auth/refresh", async (req, res) => {
  if (req.body.refresh_token) {
    let refresh_token = req.body.refresh_token;

    try {
      let data = await axios({
        responseType: "json",
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        data: qs.stringify({
          grant_type: "refresh_token",
          refresh_token,
        }),
      });
      res.status(200);
      res.send(data.data);
    } catch (e) {
      res.status(500);
      res.send(e.response.data);
    }
  } else {
    res.status(400);
    res.send("Please provide a refresh token!");
  }
});

app.get("/test", (req, res) => {
  res.json({
    valid: true,
  });
});

app.listen(PORT, () => console.log("Backend started"));
