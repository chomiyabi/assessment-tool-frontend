/**
 * JSONP方式でGAS APIを呼び出すクライアント
 * CORS制限を完全に回避
 */

class JSONPAPIClient {
    constructor() {
        this.baseUrl = 'https://script.google.com/macros/s/AKfycbwooCJeciyJfmWZ9BhN8gzsXsp6kYmd70R7_X8ghBj3tFMOKkn4cccG3ai_vjrz_ng1gw/exec';
        this.callbackCounter = 0;
    }

    /**
     * JSONP リクエストを実行
     */
    async makeJSONPRequest(params) {
        return new Promise((resolve, reject) => {
            const callbackName = `jsonp_callback_${++this.callbackCounter}`;
            const timeout = 30000; // 30秒

            // グローバルコールバック関数を作成
            window[callbackName] = (data) => {
                // クリーンアップ
                delete window[callbackName];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                clearTimeout(timeoutId);
                resolve(data);
            };

            // URLパラメータを構築
            const urlParams = new URLSearchParams(params);
            urlParams.append('callback', callbackName);
            const url = `${this.baseUrl}?${urlParams.toString()}`;

            // スクリプトタグを作成
            const script = document.createElement('script');
            script.src = url;
            script.onerror = () => {
                delete window[callbackName];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                clearTimeout(timeoutId);
                reject(new Error('JSONP request failed'));
            };

            // タイムアウト設定
            const timeoutId = setTimeout(() => {
                delete window[callbackName];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                reject(new Error('Request timeout'));
            }, timeout);

            // スクリプトを追加してリクエスト実行
            document.head.appendChild(script);
        });
    }

    /**
     * ユーザー登録
     */
    async registerUser(userData) {
        try {
            const params = {
                path: 'register',
                action: 'register',
                last_name: userData.last_name,
                first_name: userData.first_name,
                email: userData.email,
                phone: userData.phone || '',
                company: userData.company,
                industry: userData.industry || '',
                position: userData.position || ''
            };

            const result = await this.makeJSONPRequest(params);
            return result;
        } catch (error) {
            throw new Error('ユーザー登録に失敗しました: ' + error.message);
        }
    }

    /**
     * 設問データ取得
     */
    async getQuestions() {
        try {
            const result = await this.makeJSONPRequest({ path: 'questions' });
            return result;
        } catch (error) {
            throw new Error('設問データの取得に失敗しました: ' + error.message);
        }
    }

    /**
     * ヘルスチェック
     */
    async healthCheck() {
        try {
            const result = await this.makeJSONPRequest({ path: 'health' });
            return result;
        } catch (error) {
            throw new Error('APIとの接続に失敗しました: ' + error.message);
        }
    }
}

// グローバルに公開
window.JSONPAPIClient = new JSONPAPIClient();