/**
 * Netlify Function - CORS Proxy for GAS API
 * Google Apps Script CORSの制限を回避するためのプロキシ関数
 */

const GAS_BASE_URL = 'https://script.google.com/macros/s/AKfycbwooCJeciyJfmWZ9BhN8gzsXsp6kYmd70R7_X8ghBj3tFMOKkn4cccG3ai_vjrz_ng1gw/exec';

// CORS ヘッダー設定
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

exports.handler = async (event, context) => {
  // CORS Preflightリクエストの処理
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  try {
    // パラメータを取得
    const queryParams = event.queryStringParameters || {};
    
    // GASにリクエストを転送
    const url = new URL(GAS_BASE_URL);
    Object.keys(queryParams).forEach(key => {
      url.searchParams.append(key, queryParams[key]);
    });

    console.log('Proxying request to:', url.toString());

    const response = await fetch(url.toString(), {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      ...(event.body && { body: event.body })
    });

    const data = await response.text();
    console.log('GAS response status:', response.status);
    console.log('GAS response data:', data.substring(0, 200));

    return {
      statusCode: response.status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json'
      },
      body: data
    };

  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};