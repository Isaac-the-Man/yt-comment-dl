exports.handler = function(event, context, callback) {
        callback(null, {
            statusCode: 200,
            body: 'Verify API: ' + process.env.GOOGLE_RECAPTCHA_SECRET
        });
}
