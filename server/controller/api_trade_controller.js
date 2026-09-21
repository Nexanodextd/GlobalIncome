const tradeTrasnaction = require('../models/trading_transaction_model');
const Wallet = require('../models/wallet');
const Holding = require('../models/holding_model');
const holding_model = require('../models/holding_model');
const getCurrentPrice = require('../utils/priceService');

exports.buy = async (req, res) => {

      const id = req.user.id;
      const { selectedCoin, amount, coin_price } = req.body;

      const numericAmount = Number(amount);
      const numericPrice = Number(coin_price);
      if (!selectedCoin || numericAmount <= 0 || numericPrice <= 0) {
            return res.status(400).json({ success: false, message: "invalid trade" });

      }

      const wallet = await Wallet.findOne({ user: id });
      if (!wallet) {
            console.log("Wallet not found");
            return res.status(400).json({ success: "false", message: "wallet not found" });
      }

      if (wallet.balance < numericAmount) {
            console.log("Inssuficient Balance")
            return res.status(400).json({ success: "false", message: "Insufficient balance" });

      }
      const quantity = numericAmount / numericPrice;
      const holding = await Holding.findOne({ user: id, symbol: selectedCoin.toUpperCase() });
      let newQuantity = 0;
      let newAveragePrice = 0;
      if (holding) {

            const oldValue = holding.quantity * holding.averageBuyPrice;
            const newValue = numericAmount;

            newQuantity = holding.quantity + quantity;

            newAveragePrice = (oldValue + newValue) / newQuantity;

            holding.quantity = newQuantity;
            holding.averageBuyPrice = newAveragePrice;
            await holding.save();
      } else {
            newQuantity = quantity;

            await Holding.create({
                  user: id,
                  symbol: selectedCoin.toUpperCase(),
                  quantity,
                  averageBuyPrice: numericPrice
            });
      }
      wallet.balance -= numericAmount;
      await wallet.save();
      await tradeTrasnaction.create({
            user: id,
            type: "BUY",
            symbol: selectedCoin.toUpperCase(),
            quantity,
            price: numericPrice,
            total: numericAmount
      }).then(() => {
            res.json({
                  success: true,
                  message: "Buy order successful",
                  quantity,
                  balance: wallet.balance
            });
      }).catch(error => {
            console.log(error);

            res.status(500).json({
                  success: false,
                  message: error.message
            });
      })

}

exports.sell = async (req, res) => {

      try {

            const userid = req.user.id;
            const { selectedCoin, quantity, coin_price } = req.body;
            console.log(req.body);
            const sellQuantity = Number(quantity);
            const sellPrice = Number(coin_price);
            const symbol = selectedCoin;
            if (!symbol || sellQuantity <= 0 || sellPrice <= 0) {

                  console.log("Invalid sell order")

                  return res.status(400).json({
                        success: false,
                        message: "Invalid sell order"
                  });
                  

            }

            const holding = await Holding.findOne({
                  user: userid,
                  symbol: symbol.toUpperCase()
            });

            if (!holding || holding.quantity < sellQuantity) {
                   console.log("Insufficient crypto balance")
                  return res.status(400).json({
                        success: false,
                        message: "Insufficient crypto balance"
                  });

            }

            const saleTotal =
                  sellQuantity * sellPrice;

            const wallet = await Wallet.findOne({
                  user: userid
            });

            if (!wallet) {
                   console.log("wallet not found")
                  return res.status(404).json({
                        success: false,
                        message: "Wallet not found"
                  });

            }

            // Remove sold crypto
            holding.quantity -= sellQuantity;

            await holding.save();

            // Add money to wallet
            wallet.balance += saleTotal;

            await wallet.save();

            // Save transaction
            await tradeTrasnaction.create({
                  user: userid,
                  type: "SELL",
                  symbol: symbol.toUpperCase(),
                  quantity: sellQuantity,
                  price: sellPrice,
                  total: saleTotal
            });
             console.log("Sell  order successfull")
            res.json({
                  success: true,
                  message: "Sell order successful",
                  balance: wallet.balance
            });

      } catch (err) {
            console.log(err.message)
            res.status(500).json({
                  success: false,
                  message: err.message
            });
      }
}

exports.portfolio = async (req, res) => {
      try {

            const userID = req.user.id;
            const holdings = await holding_model.find({ user: userID, quantity: { $gt: 0 } });

            const portfolio = [];
            let totalInvested = 0;
            let totalCurrentValue = 0;
            for (const holding of holdings) {

                  const currentPrice = await getCurrentPrice(holding.symbol);
                  const investedValue = holding.quantity * holding.averageBuyPrice;

                  const currentvalue = holding.quantity * currentPrice;
                  const profitLoss = currentvalue - investedValue;
                  const profitLossPercentage = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;
                  totalInvested += investedValue;
                  totalCurrentValue += currentvalue;
                  portfolio.push({
                        symbol: holding.symbol,
                        quantity: holding.quantity,
                        averageBuyPrice: holding.averageBuyPrice,
                        currentPrice,

                        investedValue,

                        currentvalue,

                        profitLoss,

                        profitLossPercentage
                  });

            }
            const totalProfitLoss =
                  totalCurrentValue - totalInvested;

            const totalProfitLossPercentage =
                  totalInvested > 0
                        ? (totalProfitLoss / totalInvested) * 100
                        : 0;
            console.log(totalProfitLossPercentage);
            res.json({

                  success: true,

                  portfolio,

                  summary: {

                        totalInvested,

                        totalCurrentValue,

                        totalProfitLoss,

                        totalProfitLossPercentage

                  }

            });

      } catch (err) {
            console.log(err);

            res.status(500).json({

                  success: false,

                  message: "Unable to calculate portfolio"

            });

      }
}

