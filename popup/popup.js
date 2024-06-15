document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'getHistoryData' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError)
            return
        }

        if (!response) {
            console.error('No response received')
            return
        }

        document.getElementById('unique-sites').textContent = response.uniqueSites
        const topSitesList = document.getElementById('top-sites')
        topSitesList.innerHTML = ''
        response.topSites.forEach((site) => {
            const listItem = document.createElement('li')
            listItem.textContent = `${site.domain} (${site.count})`
            topSitesList.appendChild(listItem)
        })
    })

    const modifyHistoryButton = document.getElementById('modifyHistory')
    modifyHistoryButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to modify the history? This action cannot be undone.")) {
            chrome.runtime.sendMessage({ action: 'modifyHistoryBatch' }, (response) => {
                if (response && response.success) {
                    alert('History modified successfully.')
                } else {
                    alert('Failed to modify history.')
                }
            })
        }
    })
})
