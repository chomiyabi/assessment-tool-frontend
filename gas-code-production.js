/**
 * 生成AI活用 業務効率化アセスメントツール - Google Apps Script API
 * Production Version - P-05スペック準拠
 * 
 * @version 4.0.0
 * @description P-05_DEVELOPMENT_SPEC.md準拠の本番環境用API実装
 */

// === 設定 ===
const CONFIG = {
  SPREADSHEET_ID: '1tDDgfZGH4W9YyOAKCVSZyRu2CtHa7UYJ9bsIh5UZvdk',
  SHEET_NAMES: {
    CONFIG: 'Config',
    QUESTIONS: 'Questions', 
    RESPONSES: 'Responses',
    RESULT_LOGIC: 'ResultLogic'
  },
  API_VERSION: '4.0.0',
  CORS_ORIGINS: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'https://chomiyabi.github.io',
    'https://haru-assessment.com',
    'https://www.haru-assessment.com'
  ]
};

// === メインエントリーポイント ===

/**
 * HTTP GET リクエストハンドラー
 */
function doGet(e) {
  try {
    const response = handleRequest('GET', e);
    return createCORSResponse(response);
  } catch (error) {
    Logger.log('doGet Error: ' + error.toString());
    return createErrorResponse(error);
  }
}

/**
 * HTTP POST リクエストハンドラー
 */
function doPost(e) {
  try {
    const response = handleRequest('POST', e);
    return createCORSResponse(response);
  } catch (error) {
    Logger.log('doPost Error: ' + error.toString());
    return createErrorResponse(error);
  }
}

/**
 * リクエスト処理のメインルーター
 */
function handleRequest(method, e) {
  const path = e.parameter.path || e.pathInfo || '';
  const query = e.parameter;
  
  // POSTデータの取得
  let body = {};
  if (method === 'POST' && e.postData) {
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseError) {
      throw new Error('Invalid JSON format: ' + parseError.toString());
    }
  }
  
  // ルーティング
  switch (method) {
    case 'GET':
      return handleGetRequest(path, query);
    case 'POST':
      return handlePostRequest(path, body);
    default:
      throw new Error('Method not allowed: ' + method);
  }
}

/**
 * GET リクエストルーター
 */
function handleGetRequest(path, query) {
  switch (path) {
    case '':
    case 'health':
      return getHealthCheck();
    case 'config':
      return getConfig();
    case 'questions':
      return getQuestions();
    case 'result':
      const sessionId = query.session_id;
      if (!sessionId) {
        throw new Error('session_id parameter is required');
      }
      return getResult(sessionId);
    case 'register':
      return getRegister(query);
    case 'answers':
      return getAnswers(query);
    case 'test':
      return getTest(query);
    default:
      throw new Error('Not found: ' + path);
  }
}

/**
 * POST リクエストルーター
 */
function handlePostRequest(path, body) {
  switch (path) {
    case 'register':
      return postRegister(body);
    case 'answers':
      return postAnswers(body);
    case 'test':
      return postTest(body);
    default:
      throw new Error('Not found: ' + path);
  }
}

// === API エンドポイント実装 ===

/**
 * ヘルスチェック
 */
function getHealthCheck() {
  return {
    status: 'success',
    message: 'Assessment Tool API is running',
    version: CONFIG.API_VERSION,
    timestamp: new Date().toISOString(),
    spreadsheetId: CONFIG.SPREADSHEET_ID
  };
}

/**
 * 設定情報取得 GET /config
 */
function getConfig() {
  try {
    const sheet = getSheet(CONFIG.SHEET_NAMES.CONFIG);
    const data = sheet.getDataRange().getValues();
    
    const config = {};
    
    // A列: キー, B列: 値の形式で取得
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] && data[i][1] !== undefined) {
        config[data[i][0]] = data[i][1];
      }
    }
    
    return {
      status: 'success',
      data: {
        site_title: config.site_title || '生成AI活用 業務効率化アセスメントツール',
        site_description: config.site_description || '',
        privacy_policy: config.privacy_policy || '',
        questions_per_page: parseInt(config.questions_per_page) || 5
      }
    };
  } catch (error) {
    throw new Error('Failed to get config: ' + error.toString());
  }
}

/**
 * 設問データ取得 GET /questions
 * スプレッドシートから12問の質問データを取得（P-05スペック準拠）
 */
function getQuestions() {
  try {
    const sheet = getSheet(CONFIG.SHEET_NAMES.QUESTIONS);
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) {
      throw new Error('No question data found');
    }
    
    const headers = data[0];
    const questions = [];
    
    // ヘッダー行を除いてデータを処理
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (!row[0]) continue; // question_idが空の場合はスキップ
      
      const question = {
        question_id: row[0],
        category: row[1] || '',
        question_text: row[2] || '',
        // P-05スペック準拠：スコアフィールドを追加
        option_1: row[3] || '',
        option_1_score: parseFloat(row[4]) || 0,
        option_2: row[5] || '',
        option_2_score: parseFloat(row[6]) || 1,
        option_3: row[7] || '',
        option_3_score: parseFloat(row[8]) || 2,
        option_4: row[9] || '',
        option_4_score: parseFloat(row[10]) || 3,
        // 互換性のためのoptions配列も維持
        options: []
      };
      
      // オプションを処理（4つ固定：P-05スペック準拠）
      if (row[3]) question.options.push({ value: 1, text: row[3], score: parseFloat(row[4]) || 0 });
      if (row[5]) question.options.push({ value: 2, text: row[5], score: parseFloat(row[6]) || 1 });
      if (row[7]) question.options.push({ value: 3, text: row[7], score: parseFloat(row[8]) || 2 });
      if (row[9]) question.options.push({ value: 4, text: row[9], score: parseFloat(row[10]) || 3 });
      
      questions.push(question);
    }
    
    return {
      status: 'success',
      data: {
        questions: questions,
        total_questions: questions.length
      }
    };
  } catch (error) {
    throw new Error('Failed to get questions: ' + error.toString());
  }
}

/**
 * 個人情報登録 POST /register
 */
function postRegister(body) {
  try {
    // バリデーション
    const required = ['last_name', 'first_name', 'email', 'company'];
    for (const field of required) {
      if (!body[field]) {
        throw new Error(`Required field missing: ${field}`);
      }
    }
    
    // セッションID生成
    const sessionId = generateSessionId();
    const timestamp = new Date();
    
    // レスポンスシートに保存
    const sheet = getSheet(CONFIG.SHEET_NAMES.RESPONSES);
    
    // ヘッダー行が存在しない場合は作成
    if (sheet.getLastRow() === 0) {
      const headers = [
        'timestamp', 'session_id', 'last_name', 'first_name', 'email', 
        'phone', 'company', 'industry', 'position', 'total_score', 'maturity_level'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // データ行を追加
    const rowData = [
      timestamp,
      sessionId,
      body.last_name,
      body.first_name,
      body.email,
      body.phone || '',
      body.company,
      body.industry || '',
      body.position || '',
      null, // total_score (後で更新)
      null  // maturity_level (後で更新)
    ];
    
    sheet.appendRow(rowData);
    
    return {
      status: 'success',
      data: {
        session_id: sessionId,
        message: 'Registration successful'
      }
    };
  } catch (error) {
    throw new Error('Failed to register: ' + error.toString());
  }
}

/**
 * 回答データ保存 POST /answers
 * P-05スペック準拠：12問、各0-3点、最大36点
 */
function postAnswers(body) {
  try {
    // バリデーション
    if (!body.session_id) {
      throw new Error('session_id is required');
    }
    if (!body.answers || typeof body.answers !== 'object') {
      throw new Error('answers object is required');
    }
    
    const sessionId = body.session_id;
    const answers = body.answers;
    
    // セッション存在確認と行取得
    const sheet = getSheet(CONFIG.SHEET_NAMES.RESPONSES);
    const sessionRow = findSessionRow(sheet, sessionId);
    
    if (!sessionRow) {
      throw new Error('Session not found: ' + sessionId);
    }
    
    // 設問データ取得
    const questionsResponse = getQuestions();
    const questions = questionsResponse.data.questions;
    
    // 回答データを行に追加/更新
    let totalScore = 0;
    let answeredCount = 0;
    const categoryScores = {};
    
    // 回答データの開始列は常に12列目から（固定）
    const answerStartCol = 12;
    
    // 回答データのヘッダーが存在しない場合は追加（初回のみ）
    const currentCols = sheet.getLastColumn();
    if (currentCols < answerStartCol) {
      const answerHeaders = [];
      questions.forEach(q => {
        answerHeaders.push(q.question_id + '_answer');
        answerHeaders.push(q.question_id + '_score');
      });
      
      // ヘッダー行に追加
      if (answerHeaders.length > 0) {
        sheet.getRange(1, answerStartCol, 1, answerHeaders.length)
             .setValues([answerHeaders]);
      }
    }
    
    // 回答データを設定（質問順序で配列作成）
    const answerData = [];
    
    // 質問を質問IDでソート（順序を保証）
    const sortedQuestions = questions.sort((a, b) => a.question_id.localeCompare(b.question_id));
    
    sortedQuestions.forEach(question => {
      const questionId = question.question_id;
      const answerIndex = answers[questionId];
      const category = question.category;
      
      if (answerIndex !== null && answerIndex !== undefined) {
        const selectedOption = question.options[answerIndex];
        if (selectedOption) {
          const score = selectedOption.score;
          answerData.push(answerIndex);  // 回答インデックス
          answerData.push(score);        // スコア
          
          // 総合スコア計算
          totalScore += score;
          answeredCount++;
          
          // カテゴリ別スコア計算
          if (!categoryScores[category]) {
            categoryScores[category] = { total: 0, count: 0 };
          }
          categoryScores[category].total += score;
          categoryScores[category].count += 1;
        } else {
          answerData.push(null, null);
        }
      } else {
        answerData.push(null, null);
      }
    });
    
    // 回答データを行に設定
    if (answerData.length > 0) {
      sheet.getRange(sessionRow.rowIndex, answerStartCol, 1, answerData.length)
           .setValues([answerData]);
    }
    
    // P-05スペック準拠：レベル判定
    const maturityLevel = calculateMaturityLevelP05(totalScore);
    
    // 総合スコアと成熟度を更新
    sheet.getRange(sessionRow.rowIndex, 10, 1, 2)
         .setValues([[totalScore, maturityLevel]]);
    
    return {
      status: 'success',
      data: {
        session_id: sessionId,
        total_score: totalScore,
        maturity_level: maturityLevel,
        category_scores: calculateCategoryScores(categoryScores),
        answered_questions: answeredCount,
        questions_by_category: getQuestionsByCategory(categoryScores),
        message: 'Answers saved successfully'
      }
    };
  } catch (error) {
    throw new Error('Failed to save answers: ' + error.toString());
  }
}

/**
 * 診断結果取得 GET /result?session_id=xxx
 * P-05スペック準拠の結果を返す
 */
function getResult(sessionId) {
  try {
    const sheet = getSheet(CONFIG.SHEET_NAMES.RESPONSES);
    const sessionRow = findSessionRow(sheet, sessionId);
    
    if (!sessionRow) {
      throw new Error('Session not found: ' + sessionId);
    }
    
    // データの再取得（最新データを確実に取得）
    const freshRow = sheet.getRange(sessionRow.rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // 基本情報取得
    const totalScore = freshRow[9] || 0;
    const result = {
      session_id: sessionId,
      timestamp: freshRow[0],
      user_info: {
        last_name: freshRow[2],
        first_name: freshRow[3],
        email: freshRow[4],
        company: freshRow[6]
      },
      total_score: totalScore,
      maturity_level: calculateMaturityLevelP05(totalScore), // P-05スペック準拠レベル名
      category_scores: {},
      questions_by_category: {}
    };
    
    // カテゴリ別スコア計算
    const questionsResponse = getQuestions();
    const questions = questionsResponse.data.questions;
    const sortedQuestions = questions.sort((a, b) => a.question_id.localeCompare(b.question_id));
    
    // カテゴリごとにスコアを集計
    const categoryData = {};
    
    sortedQuestions.forEach((question, index) => {
      const category = question.category;
      const scoreCol = 12 + (index * 2) + 1;  // スコア列
      const scoreValue = freshRow[scoreCol - 1];  // 1-basedなので-1
      
      if (scoreValue !== undefined && scoreValue !== null && scoreValue !== '') {
        if (!categoryData[category]) {
          categoryData[category] = { total: 0, count: 0 };
        }
        const score = parseFloat(scoreValue);
        if (!isNaN(score)) {
          categoryData[category].total += score;
          categoryData[category].count += 1;
        }
      }
    });
    
    // カテゴリスコア（実際の合計値）と質問数を設定
    Object.keys(categoryData).forEach(category => {
      const data = categoryData[category];
      result.category_scores[category] = data.total; // 合計スコア（最大各カテゴリ12点）
      result.questions_by_category[category] = data.count;
    });
    
    return {
      status: 'success',
      data: result
    };
  } catch (error) {
    throw new Error('Failed to get result: ' + error.toString());
  }
}

/**
 * テスト機能 POST /test
 */
function postTest(body) {
  try {
    const testType = body.test_type || 'connection';
    
    switch (testType) {
      case 'connection':
        return testConnection();
      case 'questions':
        return getQuestions();
      case 'config':
        return getConfig();
      default:
        throw new Error('Unknown test type: ' + testType);
    }
  } catch (error) {
    throw new Error('Test failed: ' + error.toString());
  }
}

// === ユーティリティ関数 ===

/**
 * スプレッドシート取得
 */
function getSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet not found: ${sheetName}`);
    }
    
    return sheet;
  } catch (error) {
    throw new Error(`Failed to access sheet ${sheetName}: ${error.toString()}`);
  }
}

/**
 * セッションID生成
 */
function generateSessionId() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2);
  return `sess_${timestamp}_${random}`;
}

/**
 * セッション行検索
 */
function findSessionRow(sheet, sessionId) {
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) { // ヘッダー行をスキップ
    if (data[i][1] === sessionId) { // session_id列
      return {
        rowIndex: i + 1, // 1-based index
        data: data[i]
      };
    }
  }
  
  return null;
}

/**
 * P-05スペック準拠：成熟度レベル計算
 * 12問×最大3点 = 最大36点
 * レベル1: 0～11点, レベル2: 12～23点, レベル3: 24～32点, レベル4: 33～36点
 */
function calculateMaturityLevelP05(totalScore) {
  if (totalScore <= 11) return '業務改善 黎明期';
  if (totalScore <= 23) return '業務改善 試行期';
  if (totalScore <= 32) return '業務改善 展開期';
  return '業務改善 先進期';
}

/**
 * カテゴリスコア計算（P-05スペック準拠）
 */
function calculateCategoryScores(categoryScores) {
  const result = {};
  Object.keys(categoryScores).forEach(category => {
    const data = categoryScores[category];
    result[category] = data.total; // 合計スコア（最大各カテゴリ12点）
  });
  return result;
}

/**
 * カテゴリ別質問数取得
 */
function getQuestionsByCategory(categoryScores) {
  const result = {};
  Object.keys(categoryScores).forEach(category => {
    const data = categoryScores[category];
    result[category] = data.count;
  });
  return result;
}

/**
 * 接続テスト
 */
function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheets = spreadsheet.getSheets();
    
    return {
      status: 'success',
      message: 'Spreadsheet connection successful',
      spreadsheet_name: spreadsheet.getName(),
      sheet_names: sheets.map(sheet => sheet.getName()),
      total_sheets: sheets.length
    };
  } catch (error) {
    throw new Error('Connection test failed: ' + error.toString());
  }
}

/**
 * CORS対応レスポンス作成
 */
function createCORSResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
    
  return output;
}

/**
 * エラーレスポンス作成
 */
function createErrorResponse(error) {
  const errorResponse = {
    status: 'error',
    error: error.message || error.toString(),
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(errorResponse))
    .setMimeType(ContentService.MimeType.JSON);
}

// === CORS対応のGET版エンドポイント ===

/**
 * ユーザー登録（GET版）
 */
function getRegister(query) {
  try {
    // バリデーション
    const required = ['last_name', 'first_name', 'email', 'company'];
    for (const field of required) {
      if (!query[field]) {
        throw new Error(`Required field missing: ${field}`);
      }
    }
    
    // セッションID生成
    const sessionId = generateSessionId();
    const timestamp = new Date();
    
    // レスポンスシートに保存
    const sheet = getSheet(CONFIG.SHEET_NAMES.RESPONSES);
    
    // ヘッダー行が存在しない場合は作成
    if (sheet.getLastRow() === 0) {
      const headers = [
        'timestamp', 'session_id', 'last_name', 'first_name', 'email', 
        'phone', 'company', 'industry', 'position', 'total_score', 'maturity_level'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // データ行を追加
    const rowData = [
      timestamp,
      sessionId,
      query.last_name,
      query.first_name,
      query.email,
      query.phone || '',
      query.company,
      query.industry || '',
      query.position || '',
      null, // total_score (後で更新)
      null  // maturity_level (後で更新)
    ];
    
    sheet.appendRow(rowData);
    
    return {
      status: 'success',
      data: {
        session_id: sessionId,
        message: 'Registration successful'
      }
    };
  } catch (error) {
    throw new Error('Failed to register: ' + error.toString());
  }
}

/**
 * 回答保存（GET版）
 */
function getAnswers(query) {
  try {
    // バリデーション
    if (!query.session_id) {
      throw new Error('session_id is required');
    }
    if (!query.answers) {
      throw new Error('answers parameter is required');
    }
    
    const sessionId = query.session_id;
    const answers = JSON.parse(query.answers);
    
    // 既存のpostAnswers関数の処理をそのまま使用
    return postAnswers({
      session_id: sessionId,
      answers: answers
    });
  } catch (error) {
    throw new Error('Failed to save answers: ' + error.toString());
  }
}

/**
 * テスト（GET版）
 */
function getTest(query) {
  try {
    const testType = query.test_type || 'connection';
    
    switch (testType) {
      case 'connection':
        return testConnection();
      case 'questions':
        return getQuestions();
      case 'config':
        return getConfig();
      default:
        throw new Error('Unknown test type: ' + testType);
    }
  } catch (error) {
    throw new Error('Test failed: ' + error.toString());
  }
}

// === テスト用関数 ===

/**
 * スクリプトエディタから実行するテスト関数
 */
function runTests() {
  console.log('=== Assessment Tool API Tests (P-05 Production) ===');
  
  try {
    // 1. 接続テスト
    console.log('1. Connection Test:');
    const connectionResult = testConnection();
    console.log(JSON.stringify(connectionResult, null, 2));
    
    // 2. 設定取得テスト
    console.log('\n2. Config Test:');
    const configResult = getConfig();
    console.log(JSON.stringify(configResult, null, 2));
    
    // 3. 質問取得テスト
    console.log('\n3. Questions Test:');
    const questionsResult = getQuestions();
    console.log(`Questions loaded: ${questionsResult.data.questions.length}`);
    
    // 4. レベル判定テスト
    console.log('\n4. Level Calculation Test:');
    const testScores = [5, 15, 28, 35];
    testScores.forEach(score => {
      const level = calculateMaturityLevelP05(score);
      console.log(`Score ${score}: ${level}`);
    });
    
    console.log('\n=== All Tests Completed Successfully ===');
    return 'All tests passed';
    
  } catch (error) {
    console.error('Test failed:', error.toString());
    return 'Tests failed: ' + error.toString();
  }
}