const WebSocket = require("ws");

const prices = {};

const streams = [
    "btcusdt@ticker",
    "ethusdt@ticker",
    "solusdt@ticker",
    "ltcusdt@ticker",
    "xrpusdt@ticker"
];

let ws;


function connectBinance() {

 const url =
    `wss://stream.binance.com:443/stream?streams=${streams.join("/")}`;
    console.log("Connecting to Binance...");
    console.log(url);

    ws = new WebSocket(url, {
        handshakeTimeout: 15000
    });


    ws.on("open", () => {

        console.log("================================");
        console.log("BINANCE WEBSOCKET CONNECTED");
        console.log("================================");

    });


    ws.on("message", (message) => {

        try {

            const result = JSON.parse(message.toString());

            const data = result.data;

            if (!data || !data.s) {
                return;
            }


            const coin = data.s
                .replace("USDT", "")
                .toUpperCase();


            prices[coin] = {
                coin: coin,
                price: data.c,
                updatedAt: Date.now()
            };


           /* console.log(
                `${coin}: ${data.c}`
            );*/


        } catch (error) {

            console.log(
                "Message parsing error:",
                error.message
            );

        }

    });


    ws.on("error", (error) => {

        console.log(
            "BINANCE WEBSOCKET ERROR:",
            error.message
        );

    });


    ws.on("close", (code, reason) => {

        console.log(
            "Binance WebSocket closed:",
            code,
            reason.toString()
        );


        setTimeout(() => {

            console.log("Attempting Binance reconnect...");

            connectBinance();

        }, 20000);

    });

}

connectBinance();


module.exports = prices;