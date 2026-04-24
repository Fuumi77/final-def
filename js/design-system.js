/* 
   ROLAND'S STEAKHOUSE - DESIGN SYSTEM JS
   Centralized Logic for Premium Modals and Console Branding
*/

(function() {
    // 1. Stylized Console Greeting
    const consoleStyle = 'background: #1b5e20; color: white; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 8px; border: 2px solid #10b981;';
    const subStyle = 'color: #1b5e20; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; font-weight: bold;';
    
    console.log('%c🏛️ ROLAND\'S STEAKHOUSE SYSTEMS ', consoleStyle);
    console.log('%c» Digital Infrastructure Initialized Successfully.', subStyle);

    // 2. Super Modal System
    window.superModal = function ({ 
        title = 'Notice', 
        message = '', 
        type = 'alert', 
        confirmText = 'Confirm', 
        cancelText = 'Cancel',
        showInput = false,
        placeholder = '',
        inputType = 'text'
    }) {
        return new Promise((resolve) => {
            // Ensure root exists
            let root = document.getElementById('super-modal-root');
            if (!root) {
                root = document.createElement('div');
                root.id = 'super-modal-root';
                document.body.appendChild(root);
            }

            const html = `
                <div class="super-modal-overlay">
                    <div class="super-modal-box">
                        <div class="super-modal-header">
                            <h3>${title}</h3>
                        </div>
                        <div class="super-modal-body">
                            <p>${message}</p>
                            ${showInput ? `<div style="margin-top:15px;"><input type="${inputType}" id="ds-modal-input" class="super-modal-input" placeholder="${placeholder}" autocomplete="off"></div>` : ''}
                        </div>
                        <div class="super-modal-footer">
                            ${(type === 'confirm' || showInput) ? `<button class="super-modal-btn cancel" id="ds-modal-cancel">${cancelText}</button>` : ''}
                            <button class="super-modal-btn confirm" id="ds-modal-confirm">${confirmText}</button>
                        </div>
                    </div>
                </div>
            `;
            root.innerHTML = html;

            const confirmBtn = document.getElementById('ds-modal-confirm');
            const cancelBtn = document.getElementById('ds-modal-cancel');
            const inputEl = document.getElementById('ds-modal-input');

            if (inputEl) {
                inputEl.focus();
                inputEl.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') confirmBtn.click();
                });
            }

            // Handle Clicks
            confirmBtn.onclick = () => {
                const val = inputEl ? inputEl.value : true;
                root.innerHTML = '';
                resolve(val);
            };
            
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    root.innerHTML = '';
                    resolve(showInput ? null : false);
                };
            }
        });
    };

    // 3. Fallback for alert/confirm (Optional: could override native if desired)
    // window.alert = (msg) => window.superModal({ message: msg });
    
    console.log('%c» SuperModal System: Active', 'color: #10b981; font-weight: bold; font-size: 10px;');
})();
