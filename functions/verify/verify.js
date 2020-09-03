const express = require('express');
const serverless = require('serverless-http');
const app = express();
const axios = require('axios').default;

async function verityRecaptcha(token) {
  const api = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${token}`;
  return await axios.post(api);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/verify', async (req, res) => {
  const response = verityRecaptcha(req.body.token);
  res.json(response);
});

module.exports.handler = serverless(app);