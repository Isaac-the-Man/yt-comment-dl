const axios = require('axios');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const secret = process.env.GOOGLE_RECAPTCHA_SECRET;
    try {
        const api = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${event.body.token}`;
        console.log(api);
        const res = await axios.post(api);
        return {
            statusCode: 200,
            body: JSON.stringify(res.data)
        }
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        }
    }
}
