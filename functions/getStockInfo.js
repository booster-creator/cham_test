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

    const stockMap = {
      "삼성전자": "005930.KS",
      // 필요한 다른 한국 주식 심볼도 여기에 추가
    };

    const fullSymbol = stockMap[symbol] || `${symbol}.KS`;
    console.log("Fetching data for symbol:", fullSymbol);

    const quote = await yahooFinance.quote(fullSymbol);
    console.log("Received quote data:", JSON.stringify(quote, null, 2));

    if (!quote || !quote.regularMarketPrice) {
      console.error("Quote data is undefined. Possible issues: invalid symbol, API rate limiting, or network issues.");
      throw new Error("Unable to fetch stock data");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        symbol: quote.symbol,
        name: quote.longName || quote.shortName,
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

    let errorMessage = '주식 정보를 가져오는 데 실패했습니다.';
    if (error.response) {
      errorMessage += ` API 응답 오류: ${error.response.status} ${error.response.statusText}`;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage, details: error.message })
    };
  }
};
