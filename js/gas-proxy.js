/**
 * Google Apps Script Proxy - CORS回避用
 * iframeを使ってGAS APIを呼び出す
 */

class GASProxy {
    constructor() {
        this.baseUrl = 'https://script.google.com/macros/s/AKfycbwooCJeciyJfmWZ9BhN8gzsXsp6kYmd70R7_X8ghBj3tFMOKkn4cccG3ai_vjrz_ng1gw/exec';
        this.iframe = null;
        this.callbacks = {};
        this.callbackId = 0;
    }

    /**
     * iframeを初期化
     */
    init() {
        if (this.iframe) return;
        
        this.iframe = document.createElement('iframe');
        this.iframe.style.display = 'none';
        this.iframe.src = 'about:blank';
        document.body.appendChild(this.iframe);
        
        // メッセージリスナー設定
        window.addEventListener('message', (event) => {
            if (event.data && event.data.callbackId && this.callbacks[event.data.callbackId]) {
                const callback = this.callbacks[event.data.callbackId];
                delete this.callbacks[event.data.callbackId];
                
                if (event.data.error) {
                    callback.reject(new Error(event.data.error));
                } else {
                    callback.resolve(event.data.result);
                }
            }
        });
    }

    /**
     * GAS APIを呼び出す
     */
    async call(params) {
        this.init();
        
        return new Promise((resolve, reject) => {
            const callbackId = ++this.callbackId;
            this.callbacks[callbackId] = { resolve, reject };
            
            // URLパラメータを構築
            const urlParams = new URLSearchParams(params);
            const url = `${this.baseUrl}?${urlParams.toString()}`;
            
            // iframe経由でリクエスト
            const script = `
                fetch('${url}')
                    .then(response => response.json())
                    .then(result => {
                        parent.postMessage({ callbackId: ${callbackId}, result }, '*');
                    })
                    .catch(error => {
                        parent.postMessage({ callbackId: ${callbackId}, error: error.message }, '*');
                    });
            `;
            
            this.iframe.contentWindow.eval(script);
            
            // タイムアウト設定
            setTimeout(() => {
                if (this.callbacks[callbackId]) {
                    delete this.callbacks[callbackId];
                    reject(new Error('Request timeout'));
                }
            }, 30000);
        });
    }
}

// グローバルに公開
window.GASProxy = new GASProxy();