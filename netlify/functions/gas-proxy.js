/**
 * Netlify Functions - GAS API Proxy
 * CORS問題を解決するためのサーバーレス関数
 */

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwooCJeciyJfmWZ9BhN8gzsXsp6kYmd70R7_X8ghBj3tFMOKkn4cccG3ai_vjrz_ng1gw/exec';

exports.handler = async (event, context) => {
  console.log('GAS Proxy called:', event.httpMethod, event.queryStringParameters);

  // CORS ヘッダーを設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS リクエスト（プリフライト）への対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // クエリパラメータを取得
    const params = event.queryStringParameters || {};
    
    // GAS API URLを構築
    const urlParams = new URLSearchParams(params);
    const gasUrl = `${GAS_API_URL}?${urlParams.toString()}`;
    
    console.log('Forwarding to GAS:', gasUrl);

    // GAS APIを呼び出し
    const response = await fetch(gasUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Netlify-Functions-Proxy/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`GAS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('GAS API response:', data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Proxy server error',
        message: error.message
      })
    };
  }
};