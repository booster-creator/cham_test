async function getStockInfo(symbol) {
    try {
      console.log("Sending request for symbol:", symbol);
      const response = await fetch('/.netlify/functions/getStockInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Received stock data:", data);
      return data;
    } catch (error) {
      console.error('Error in getStockInfo:', error);
      throw error;
    }
  }
  
  async function analyzeStockWithGPT(stockInfo, market) {
    try {
      console.log("Sending request for GPT analysis");
      const response = await fetch('/.netlify/functions/analyze-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stockInfo, market })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from GPT analysis:", errorText);
        throw new Error(`GPT analysis failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Received GPT analysis:", data);
      return data.analysis;
    } catch (error) {
      console.error('Error in analyzeStockWithGPT:', error);
      throw error;
    }
  }
  
  async function analyzeStock() {
    const stockName = document.getElementById('stockName').value;
    const market = document.getElementById('market').value;
  
    try {
      // 주식 정보 가져오기
      const stockInfo = await getStockInfo(stockName);
  
      // GPT 분석 요청
      const gptAnalysis = await analyzeStockWithGPT(stockInfo, market);
  
      // 결과 표시
      document.getElementById('result').innerHTML = `
        <h2>실시간 주가 정보</h2>
        <p>회사명: ${stockInfo.name}</p>
        <p>현재가: ${stockInfo.price}</p>
        <p>변동: ${stockInfo.change} (${stockInfo.changePercent}%)</p>
        <p>거래량: ${stockInfo.volume}</p>
        <h2>AI 분석</h2>
        <p>${gptAnalysis}</p>
      `;
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = '분석 중 오류가 발생했습니다: ' + error.message;
    }
  }
  
  // Google 로그인 기능 (향후 구현 예정)
  document.getElementById('googleLogin').addEventListener('click', function() {
    alert('Google 로그인 기능은 아직 구현되지 않았습니다.');
  });