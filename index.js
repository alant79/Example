const express = require("express");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/working-with-ymap"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/dist/working-with-ymap/index.html"));
});

app.post("/linkToZone", function(req, res) {
  try {

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(__dirname + "/indexYmap.html");
    await page.evaluate((addresses) => {
       const elAddresses = document.querySelector('.addresses');
       elAddresses.innerHTML = addresses;
     }, JSON.stringify(req.body.addresses));

     await page.evaluate((zones) => {
      const elZones = document.querySelector('.zones');
      elZones.innerHTML = zones;
    }, JSON.stringify(req.body.zones));

    await page.click('.btn');
   
    const result = await page.evaluate(() => {
      const elResult = document.querySelector('.result').innerHTML;
       return elResult;
    });
    const json = JSON.parse(result)
    res.json(json);

    await browser.close();
  })();

    
  } catch (error) {
    res.status(500).send(error);
  }
});


// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8090);

module.exports = app;
