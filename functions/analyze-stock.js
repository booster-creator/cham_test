const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { stockName, market, stockInfo } = JSON.parse(event.body);

    const prompt = `
    당신은 전문적인 주식 분석가입니다. ${market}의 ${stockName} 주식에 대한 상세한 분석을 제공해주세요. 다음 실시간 정보를 바탕으로 분석해주세요:

    현재가: ${stockInfo.price}
    변동: ${stockInfo.change} (${stockInfo.changePercent}%)
    거래량: ${stockInfo.volume}

    1. 회사 개요: ${stockName}의 주요 사업 영역과 시장에서의 위치
    2. 현재 주가 동향 분석
    3. 최근 주요 뉴스 및 이벤트: 주가에 영향을 줄 수 있는 최근의 중요한 뉴스나 사건
    4. 기술적 분석: 현재 주가 수준의 의미
    5. 향후 전망: 단기 및 중장기 전망
    6. 투자자들이 주목해야 할 주요 지표나 이벤트

    마지막으로, 위의 분석을 바탕으로 간단한 주식 financial report을 작성해주세요.

    (마크다운으로 정리 , 마크는 이모티콘을 사용  )

    참고: 이 분석은 AI에 의해 생성된 것이며, 투자 결정의 근거로 사용해서는 안 됩니다.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: completion.data.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '내부 서버 오류가 발생했습니다.' }),
    };
  }
};