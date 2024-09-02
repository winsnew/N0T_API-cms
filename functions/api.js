import express from "express";
import ServerlessHttp from "serverless-http";

const app = express()
app.get("/.netlify/functions/api")

const handler = ServerlessHttp(app, (req, res) => {
    return res.json({
        message: "hello world"
    })
})

module.exports.handler = async (event, context) => {
    const result = await handler(event, context);
    return result
}