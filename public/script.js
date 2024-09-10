async function analyzeStock() {
    const stockName = document.getElementById('stockName').value;
    const market = document.getElementById('market').value;
    const resultArea = document.getElementById('result');

    

    if (!stockName) {
        alert('주식 이름을 입력해주세요.');
        return;
    }

    resultArea.innerHTML = '분석 중...';

    try {
        const response = await fetch('/.netlify/functions/analyze-stock', {
            method: 'POST',
            body: JSON.stringify({ stockName, market }),
        });

        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const data = await response.json();
        resultArea.innerHTML = data.analysis;
    } catch (error) {
        console.error('Error:', error);
        resultArea.innerHTML = '분석 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
}