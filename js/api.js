/**
 * Assessment Tool API クライアント - CORS修正版
 * Google Apps Script の CORS制限を回避するため、Netlify Functions使用
 * 
 * @version 4.2.0
 * @description Google Apps Script APIとの通信を管理（CORS対応）
 */

// API設定
const API_CONFIG = {
    // 環境判定（より確実な方法）
    IS_PRODUCTION: window.location.protocol === 'https:' && 
                   (window.location.hostname.includes('netlify.app') || 
                    window.location.hostname === 'haru-assessment.com' ||
                    window.location.hostname === 'www.haru-assessment.com'),
    
    // タイムアウト設定（ミリ秒）
    TIMEOUT: 30000,
    
    // リトライ設定
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000
};

// 本番環境のGAS URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwooCJeciyJfmWZ9BhN8gzsXsp6kYmd70R7_X8ghBj3tFMOKkn4cccG3ai_vjrz_ng1gw/exec';

// 本番環境設定
API_CONFIG.BASE_URL = GAS_URL;

/**
 * Assessment Tool API クライアントクラス
 */
class AssessmentAPI {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
        this.retryCount = API_CONFIG.RETRY_COUNT;
        this.retryDelay = API_CONFIG.RETRY_DELAY;
    }
    
    /**
     * HTTPリクエストを実行
     * @private
     */
    async makeRequest(path, params = {}) {
        const urlParams = new URLSearchParams();
        urlParams.append('path', path);
        
        // パラメータを追加
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                urlParams.append(key, typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]);
            }
        });
        
        const url = `${this.baseUrl}?${urlParams.toString()}`;
        
        console.log(`[API] Hostname: ${window.location.hostname}`);
        console.log(`[API] Protocol: ${window.location.protocol}`);
        console.log(`[API] IS_PRODUCTION: ${API_CONFIG.IS_PRODUCTION}`);
        console.log(`[API] BASE_URL: ${API_CONFIG.BASE_URL}`);
        console.log(`[API] ${API_CONFIG.IS_PRODUCTION ? 'PROD' : 'DEV'} Request to: ${url}`);
        
        // リトライ機能付きリクエスト
        let lastError;
        for (let i = 0; i < this.retryCount; i++) {
            try {
                const fetchOptions = { 
                    method: 'GET',
                    mode: 'cors',
                    headers: {}
                };
                
                const response = await this.fetchWithTimeout(url, fetchOptions);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // APIエラーのチェック
                if (result.status === 'error') {
                    throw new Error(result.error || 'Unknown API error');
                }
                
                console.log(`[API] Request successful on attempt ${i + 1}`);
                return result;
                
            } catch (error) {
                console.error(`[API] Request attempt ${i + 1} failed:`, error);
                lastError = error;
                
                // リトライ前に待機
                if (i < this.retryCount - 1) {
                    await this.sleep(this.retryDelay);
                }
            }
        }
        
        throw lastError;
    }
    
    /**
     * タイムアウト付きfetch
     * @private
     */
    async fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }
    
    /**
     * スリープ関数
     * @private
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // === パブリックAPIメソッド ===
    
    /**
     * ヘルスチェック
     */
    async healthCheck() {
        try {
            const result = await this.makeRequest('health');
            return result;
        } catch (error) {
            console.error('Health check failed:', error);
            throw new Error('APIとの接続に失敗しました');
        }
    }
    
    /**
     * サイト設定取得
     */
    async getConfig() {
        try {
            const result = await this.makeRequest('config');
            return result.data;
        } catch (error) {
            console.error('Failed to get config:', error);
            throw new Error('設定情報の取得に失敗しました');
        }
    }
    
    /**
     * 設問データ取得
     */
    async getQuestions() {
        try {
            const result = await this.makeRequest('questions');
            return result.data;
        } catch (error) {
            console.error('Failed to get questions:', error);
            throw new Error('設問データの取得に失敗しました');
        }
    }
    
    /**
     * ユーザー登録（GETパラメータで送信）
     */
    async registerUser(userData) {
        try {
            // バリデーション
            const required = ['last_name', 'first_name', 'email', 'company'];
            for (const field of required) {
                if (!userData[field]) {
                    throw new Error(`必須項目が入力されていません: ${field}`);
                }
            }
            
            // GETパラメータで送信（CORS回避）
            const result = await this.makeRequest('register', {
                action: 'register',
                last_name: userData.last_name,
                first_name: userData.first_name,
                email: userData.email,
                phone: userData.phone || '',
                company: userData.company,
                industry: userData.industry || '',
                position: userData.position || ''
            });
            
            return result.data;
        } catch (error) {
            console.error('Failed to register user:', error);
            throw new Error('ユーザー登録に失敗しました: ' + error.message);
        }
    }
    
    /**
     * 回答データ保存（GETパラメータで送信）
     */
    async saveAnswers(sessionId, answers) {
        try {
            if (!sessionId) {
                throw new Error('セッションIDが必要です');
            }
            
            if (!answers || Object.keys(answers).length === 0) {
                throw new Error('回答データが必要です');
            }
            
            // 回答データをJSON文字列化
            const result = await this.makeRequest('answers', {
                action: 'save_answers',
                session_id: sessionId,
                answers: JSON.stringify(answers)
            });
            
            return result.data;
        } catch (error) {
            console.error('Failed to save answers:', error);
            throw new Error('回答の保存に失敗しました: ' + error.message);
        }
    }
    
    /**
     * 診断結果取得
     */
    async getResult(sessionId) {
        try {
            if (!sessionId) {
                throw new Error('セッションIDが必要です');
            }
            
            const result = await this.makeRequest('result', {
                session_id: sessionId
            });
            
            return result.data;
        } catch (error) {
            console.error('Failed to get result:', error);
            throw new Error('診断結果の取得に失敗しました: ' + error.message);
        }
    }
    
    /**
     * テスト実行
     */
    async runTest(testType = 'connection') {
        try {
            const result = await this.makeRequest('test', {
                test_type: testType
            });
            return result;
        } catch (error) {
            console.error('Test failed:', error);
            throw new Error('テストの実行に失敗しました');
        }
    }
}

// APIインスタンスを作成してエクスポート
const API = new AssessmentAPI();

// グローバルに公開（ブラウザ環境）
if (typeof window !== 'undefined') {
    window.AssessmentAPI = API;
}

// モジュールエクスポート（Node.js環境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}


/**
 * ローディング表示ヘルパー
 */
class LoadingHelper {
    static show(message = 'Loading...') {
        // 既存のローディングを削除
        this.hide();
        
        // ローディング要素を作成
        const loading = document.createElement('div');
        loading.id = 'api-loading';
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;
        
        document.body.appendChild(loading);
    }
    
    static hide() {
        const loading = document.getElementById('api-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    static async withLoading(asyncFunction, message = 'Processing...') {
        try {
            this.show(message);
            const result = await asyncFunction();
            this.hide();
            return result;
        } catch (error) {
            this.hide();
            throw error;
        }
    }
}

// LoadingHelperをグローバルに公開
if (typeof window !== 'undefined') {
    window.LoadingHelper = LoadingHelper;
}