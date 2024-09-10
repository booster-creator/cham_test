const yahooFinance = require('yahoo-finance2').default;

exports.handler = async function(event, context) {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { symbol } = JSON.parse(event.body);
    console.log("Parsed symbol:", symbol);

    if (!symbol) {
      throw new Error("Symbol is required");
    }

    const fullSymbol = symbol.includes('.') ? symbol : `${symbol}.KS`;
    console.log("Fetching data for symbol:", fullSymbol);

    const quote = await yahooFinance.quote(fullSymbol);
    console.log("Received quote data:", JSON.stringify(quote, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({
        symbol: quote.symbol,
        name: quote.longName,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        previousClose: quote.regularMarketPreviousClose,
        open: quote.regularMarketOpen,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        volume: quote.regularMarketVolume
      })
    };
  } catch (error) {
    console.error('Error in getStockInfo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '주식 정보를 가져오는 데 실패했습니다.', details: error.message })
    };
  }
};