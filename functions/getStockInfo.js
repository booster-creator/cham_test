const yahooFinance = require('yahoo-finance2').default;

exports.handler = async function(event, context) {
  const { symbol } = JSON.parse(event.body);
  
  const fullSymbol = symbol.includes('.') ? symbol : `${symbol}.KS`;

  try {
    const quote = await yahooFinance.quote(fullSymbol);
    
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
    console.error('Error fetching stock data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '주식 정보를 가져오는 데 실패했습니다.' })
    };
  }
};