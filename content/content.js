chrome.runtime.sendMessage({
    action: 'modifyHistory',
    url: window.location.href
})
