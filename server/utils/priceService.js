const axios = require("axios");

async function getCurrentPrice(symbol) {

    const coinIds = {
        BTC: "bitcoin",
        ETH: "ethereum",
        SOL: "solana",
        LTC: "litecoin",
        XRP: "ripple",
        BCH: "bitcoin-cash"
    };

    const coinId = coinIds[symbol.toUpperCase()];

    if (!coinId) {
        throw new Error("Unsupported cryptocurrency");
    }

    const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
            params: {
                ids: coinId,
                vs_currencies: "usd"
            }
        }
    );

    return response.data[coinId].usd;
}

module.exports = getCurrentPrice;