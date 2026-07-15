const hashed = await bcrypt.hash(Password, 10);
        const user = await UserModel.create({ Name,Username,Email,Phone,Gender,Country, Password: hashed, Account_Type });
        if (user) {
            console.log('worked')
            res.json({
                data: user,
                success: true
            })
        }






        async function initChart() {
    const el = document.querySelector("#chart");

    chart = new ApexCharts(el, {
        chart: {
            type: 'candlestick',
            height: 400
        },
        series: [{ data: [] }],
        xaxis: { type: 'datetime' }
    });

    await chart.render(); // 🔥 WAIT until ready
}
    function loadPrices() {
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/markets",
        method: "GET",
        data: {
            vs_currency: "usd",
            per_page: 20
        },
        success: function(data) {

            let html = "";

            data.forEach(coin => {
                html += `
                    <tr class="coin-row" data-id="bitcoin">
                        <td>
                            <img src="${coin.image}" width="20" />
                            ${coin.name}
                        </td>
                        <td>$${coin.current_price}</td>
                    </tr>
                `;
            });

            $('#cryptoTable').html(html);
        }
    });
}
async function loadChart(coin) {

    if (!chart) {
        console.error("Chart not ready");
        return;
    }

    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=usd&days=1`
    );

    const data = await res.json();

    if (!data || data.length === 0) return;

    const formatted = data.map(c => ({
        x: new Date(c[0]),
        y: [c[1], c[2], c[3], c[4]]
    }));

    chart.updateSeries([{ data: formatted }]);
}
// ✅ CLICK HANDLER (IMPORTANT)
$(document).on('click', '.coin-row', function() {
    const coinId = $(this).attr('data-id'); // 🔥 use attr (safer)
    console.log("Clicked:", coinId);
    $('#selectedCoin').text(coinId.toUpperCase());
      $('.coin-row').removeClass('active');
    $(this).addClass('active');
    loadChart(coinId);
});


// ✅ RUN EVERYTHING
$(document).ready(async function() {
    
    await initChart();       // wait for chart
    loadPrices();            // load table
   let currentCoin = "bitcoin";

setInterval(() => {
    loadChart(currentCoin);
}, 10000);  // ✅ now safe
});

// NEW CODE FOR CHAT






async function initChart() {
    const el = document.querySelector("#chart");

    chart = new ApexCharts(el, {
        chart: {
            type: 'candlestick',
            height: 400
        },
        series: [{ data: [] }],
        xaxis: { type: 'datetime' }
    });

    await chart.render();
}

function loadPrices() {
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/markets",
        method: "GET",
        data: {
            vs_currency: "usd",
            per_page: 20,
            order: "market_cap_desc",
            sparkline: false
        },
        success: function(data) {
            let html = "";
            data.forEach(coin => {
                html += `
                    <tr class="coin-row" data-id="${coin.id}">
                        <td>
                            <img src="${coin.image}" width="20" />
                            ${coin.name} (${coin.symbol.toUpperCase()})
                        </td>
                        <td>$${coin.current_price.toLocaleString()}</td>
                    </tr>
                `;
            });
            $('#cryptoTable').html(html);
        }
    });
}

// 🔥 BETTER MAPPING - covers TOP 20 coins
function getBinanceSymbol(coinId) {
    const map = {
        bitcoin: "BTCUSDT",
        ethereum: "ETHUSDT",
        bnb: "BNBUSDT",
        solana: "SOLUSDT",
        xrp: "XRPUSDT",
        "usd-coin": "USDCUSDT",
        cardano: "ADAUSDT",
        dogecoin: "DOGEUSDT",
        "avalanche-2": "AVAXUSDT",
        tron: "TRXUSDT",
        chainlink: "LINKUSDT",
        polkadot: "DOTUSDT",
        "bitcoin-cash": "BCHUSDT",
        near: "NEARUSDT",
        uniswap: "UNIUSDT",
        litecoin: "LTCUSDT",
        pepe: "PEPEUSDT",
        "internet-computer": "ICPUSDT",
        dai: "DAIUSDT"
        // ✅ Removed tether - USDTUSDT doesn't exist on Binance
    };
    
    return map[coinId] || null;
}
async function loadChart(coinId = "bitcoin") {
    console.log("🔄 Loading CoinGecko chart for:", coinId);

    try {
        // 🔥 CoinGecko OHLC - NO CORS PROBLEMS EVER!
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=1`;
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();

        if (!data || data.length === 0) {
            console.warn("❌ No data for:", coinId);
            document.querySelector("#chart").innerHTML = "<p>No chart data</p>";
            return;
        }

        // CoinGecko format: [timestamp, open, high, low, close]
        const formatted = data.map(candle => ({
            x: new Date(candle[0]),
            y: [candle[1], candle[2], candle[3], candle[4]]
        }));

        chart.updateSeries([{ data: formatted }]);
        console.log("✅ Chart loaded:", coinId, data.length, "candles");
        
    } catch (error) {
        console.error("❌ Chart error:", error.message);
        document.querySelector("#chart").innerHTML = `
            <div style="text-align:center; padding:20px; color:#666;">
                Chart unavailable<br><small>${error.message}</small>
            </div>
        `;
    }
}

$(document).on('click', '.coin-row', function() {
    const coinId = $(this).attr('data-id'); // CoinGecko ID
    
    console.log("🪙 Clicked:", coinId);
    
    currentCoin = coinId;
    
    $('#selectedCoin').text(coinId.toUpperCase());
    $('.coin-row').removeClass('active');
    $(this).addClass('active');

    loadChart(coinId); // Works for EVERY coin!
});
// ✅ INITIALIZATION
let chart, currentCoin = "bitcoin";

$(document).ready(async function() {
    await initChart();
    loadPrices();
    
    // Load initial Bitcoin chart
    loadChart("bitcoin");
    
    // Auto refresh every 30s
    setInterval(() => {
        if (currentCoin) loadChart(currentCoin);
    }, 30000);
});


// THIS IS THE 3RD MOST WORKING
async function initChart() {
    const el = document.querySelector("#chart");

    chart = new ApexCharts(el, {
        chart: {
            type: 'candlestick',
            height: 400
        },
        series: [{ data: [] }],
        xaxis: { type: 'datetime' }
    });

    await chart.render();
}

function loadPrices() {
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/markets",
        method: "GET",
        data: {
            vs_currency: "usd",
            per_page: 20,
            order: "market_cap_desc",
            sparkline: false
        },
        success: function(data) {
            let html = "";
            data.forEach(coin => {
                html += `
                    <tr class="coin-row" data-id="${coin.id}">
                        <td>
                            <img src="${coin.image}" width="20" />
                            ${coin.name} (${coin.symbol.toUpperCase()})
                        </td>
                        <td>$${coin.current_price.toLocaleString()}</td>
                    </tr>
                `;
            });
            $('#cryptoTable').html(html);
        }
    });
}

// 🔥 BETTER MAPPING - covers TOP 20 coins
function getBinanceSymbol(coinId) {
    const map = {
        bitcoin: "BTCUSDT",
        ethereum: "ETHUSDT",
        bnb: "BNBUSDT",
        solana: "SOLUSDT",
        xrp: "XRPUSDT",
        "usd-coin": "USDCUSDT",
        cardano: "ADAUSDT",
        dogecoin: "DOGEUSDT",
        "avalanche-2": "AVAXUSDT",
        tron: "TRXUSDT",
        chainlink: "LINKUSDT",
        polkadot: "DOTUSDT",
        "bitcoin-cash": "BCHUSDT",
        near: "NEARUSDT",
        uniswap: "UNIUSDT",
        litecoin: "LTCUSDT",
        pepe: "PEPEUSDT",
        "internet-computer": "ICPUSDT",
        dai: "DAIUSDT"
        // ✅ Removed tether - USDTUSDT doesn't exist on Binance
    };
    
    return map[coinId] || null;
}
async function loadChart(coinId = "bitcoin") {
    console.log("🔄 Loading CoinGecko chart for:", coinId);

    try {
        // 🔥 CoinGecko OHLC - NO CORS PROBLEMS EVER!
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=1`;
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();

        if (!data || data.length === 0) {
            console.warn("❌ No data for:", coinId);
            document.querySelector("#chart").innerHTML = "<p>No chart data</p>";
            return;
        }

        // CoinGecko format: [timestamp, open, high, low, close]
        const formatted = data.map(candle => ({
            x: new Date(candle[0]),
            y: [candle[1], candle[2], candle[3], candle[4]]
        }));

        chart.updateSeries([{ data: formatted }]);
        console.log("✅ Chart loaded:", coinId, data.length, "candles");
        
    } catch (error) {
        console.error("❌ Chart error:", error.message);
        document.querySelector("#chart").innerHTML = `
            <div style="text-align:center; padding:20px; color:#666;">
                Chart unavailable<br><small>${error.message}</small>
            </div>
        `;
    }
}

$(document).on('click', '.coin-row', function() {
    const coinId = $(this).attr('data-id'); // CoinGecko ID
    
    console.log("🪙 Clicked:", coinId);
    
    currentCoin = coinId;
    
    $('#selectedCoin').text(coinId.toUpperCase());
    $('.coin-row').removeClass('active');
    $(this).addClass('active');

    loadChart(coinId); // Works for EVERY coin!
});
// ✅ INITIALIZATION
let chart, currentCoin = "bitcoin";

$(document).ready(async function() {
    await initChart();
    loadPrices();
    
    // Load initial Bitcoin chart
    loadChart("bitcoin");
    
    // Auto refresh every 30s
    setInterval(() => {
        if (currentCoin) loadChart(currentCoin);
    }, 30000);
});