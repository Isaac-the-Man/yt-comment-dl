// const axios = require('axios');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        console.log('preflight')
        return {
            statusCode: 200,
            headers,
            body: 'Method Not Allowed'
        };
    }
    console.log('actual post')
    return {
        statusCode: 200,
        headers,
        body: 'Actual Post'
    }
    // const secret = process.env.GOOGLE_RECAPTCHA_SECRET;
    // const body = JSON.parse(event.body);
    // try {
    //     const api = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${body.token}`;
    //     console.log(api);
    //     const res = await axios.post(api);
    //     return {
    //         statusCode: 200,
    //         headers,
    //         body: JSON.stringify(res.data)
    //     }
    // } catch (e) {
    //     console.log(e);
    //     return {
    //         statusCode: 500,
    //         headers,
    //         body: 'Internal Server Error'
    //     }
    // }
}
