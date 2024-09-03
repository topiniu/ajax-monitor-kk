chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('import.js', request);
    if (request.action === "initializeImport") {
        // Instead of automatically clicking the file input, we'll just set up the onchange event
        const fileInput = document.getElementById('fileInput');

        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedRules = JSON.parse(e.target.result);
                        if (Array.isArray(importedRules)) {
                            chrome.storage.local.get(['ajaxInterceptor_rules'], (result) => {
                                const existingRules = result.ajaxInterceptor_rules || [];
                                const newRules = [...existingRules, ...importedRules.map(rule => ({
                                    ...rule,
                                    id: generateUniqueId(),
                                    key: buildUUID(),
                                    overrideTxt: typeof rule.overrideTxt === 'object' ? JSON.stringify(rule.overrideTxt) : rule.overrideTxt,
                                }))];
                                chrome.storage.local.set({ ajaxInterceptor_rules: newRules }, () => {
                                    sendResponse({ success: true, rules: newRules, importedCount: importedRules.length });
                                });
                            });
                        } else {
                            sendResponse({ success: false, error: 'Invalid file format. Expected an array of rules.' });
                        }
                    } catch (error) {
                        console.error('Error parsing imported rules:', error);
                        sendResponse({ success: false, error: 'Error importing rules. Please check the file format.' });
                    }
                };
                reader.readAsText(file);
            }
        };

        // Send a response to indicate that the import is ready
        sendResponse({ success: true, message: "Import initialized. Please select a file." });

        return true; // Indicates that the response will be sent asynchronously
    }

    if (request.action === "triggerFileInput") {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    }
});

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function buildUUID() {
    const dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}
