// 共通機能モジュール

const Common = {
    // ページ遷移
    navigation: {
        // ページ遷移
        goToPage: function(page) {
            window.location.href = page;
        },
        
        // 前のページに戻る
        goBack: function() {
            window.history.back();
        },
        
        // ページリロード
        reload: function() {
            window.location.reload();
        }
    },
    
    // ローカルストレージ管理
    storage: {
        // データ保存
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        
        // データ取得
        get: function(key) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            } catch (e) {
                console.error('Storage get error:', e);
                return null;
            }
        },
        
        // データ削除
        remove: function(key) {
            localStorage.removeItem(key);
        },
        
        // 全データクリア
        clear: function() {
            localStorage.clear();
        }
    },
    
    // UI表示制御
    ui: {
        // 要素表示
        show: function(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.remove('hidden');
            }
        },
        
        // 要素非表示
        hide: function(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('hidden');
            }
        },
        
        // ローディング表示
        showLoading: function() {
            let overlay = document.querySelector('.loading-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'loading-overlay';
                overlay.innerHTML = '<div class="loading"></div>';
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'flex';
        },
        
        // ローディング非表示
        hideLoading: function() {
            const overlay = document.querySelector('.loading-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        },
        
        // アラート表示
        showAlert: function(message, type = 'info') {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.textContent = message;
            
            const container = document.querySelector('.main .container');
            if (container) {
                container.insertBefore(alertDiv, container.firstChild);
                
                // 5秒後に自動削除
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
            }
        }
    },
    
    // フォームバリデーション
    validation: {
        // Email検証
        isEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        // 電話番号検証
        isPhone: function(phone) {
            const re = /^[\d-]+$/;
            return re.test(phone) && phone.length >= 10;
        },
        
        // 必須項目チェック
        isRequired: function(value) {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        },
        
        // 文字数チェック
        checkLength: function(value, min, max) {
            const length = value.toString().length;
            return length >= min && length <= max;
        },
        
        // フォーム全体の検証
        validateForm: function(formSelector) {
            const form = document.querySelector(formSelector);
            if (!form) return false;
            
            let isValid = true;
            
            // 必須項目のチェック
            form.querySelectorAll('[required]').forEach(field => {
                const value = field.value.trim();
                const errorElement = field.parentElement.querySelector('.form-error');
                
                if (!value) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'この項目は必須です';
                    }
                } else {
                    field.classList.remove('error');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                }
            });
            
            // Email検証
            form.querySelectorAll('[type="email"]').forEach(field => {
                const value = field.value.trim();
                const errorElement = field.parentElement.querySelector('.form-error');
                
                if (value && !this.isEmail(value)) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = '有効なメールアドレスを入力してください';
                    }
                }
            });
            
            // 電話番号検証
            form.querySelectorAll('[type="tel"]').forEach(field => {
                const value = field.value.trim();
                const errorElement = field.parentElement.querySelector('.form-error');
                
                if (value && !this.isPhone(value)) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = '有効な電話番号を入力してください';
                    }
                }
            });
            
            return isValid;
        }
    },
    
    // 初期化
    init: function() {
        // ページ読み込み完了時の処理
        console.log('Common module initialized');
        
        // グローバルエラーハンドリング
        window.addEventListener('error', function(e) {
            console.error('Global error:', e);
        });
    }
};

// DOMContentLoaded時に初期化
document.addEventListener('DOMContentLoaded', function() {
    Common.init();
});

// グローバルに公開
window.Common = Common;