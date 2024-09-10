async function getStockInfo(symbol) {
    try {
      const response = await fetch('/.netlify/functions/getStockInfo', {
        method: 'POST',
        body: JSON.stringify({ symbol })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  async function analyzeStock() {
    const stockName = document.getElementById('stockName').value;
    const market = document.getElementById('market').value;
  
    try {
      // 주식 정보 가져오기
      const stockInfo = await getStockInfo(stockName);
  
      // GPT 분석 (기존 코드 유지)
      const analysisResponse = await fetch('/.netlify/functions/analyze-stock', {
        method: 'POST',
        body: JSON.stringify({ stockName, market, stockInfo })
      });
      const analysis = await analysisResponse.json();
  
      // 결과 표시
      document.getElementById('result').innerHTML = `
        <h2>실시간 주가 정보</h2>
        <p>회사명: ${stockInfo.name}</p>
        <p>현재가: ${stockInfo.price}</p>
        <p>변동: ${stockInfo.change} (${stockInfo.changePercent}%)</p>
        <p>거래량: ${stockInfo.volume}</p>
        <h2>AI 분석</h2>
        <p>${analysis.analysis}</p>
      `;
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = '분석 중 오류가 발생했습니다.';
    }
  }