chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'modifyHistory') {
        const url = new URL(message.url)

        chrome.history.search({ text: '', maxResults: 1, startTime: 0 }, (results) => {
            if (results.length > 0) {
                chrome.history.deleteUrl({ url: message.url }, () => {
                    chrome.history.addUrl({ url: message.url }, () => {
                        sendResponse({ success: true })
                    })
                })
            } else {
                chrome.history.addUrl({ url: message.url }, () => {
                    sendResponse({ success: true })
                })
            }
        })
    } else if (message.action === 'getHistoryData') {
        chrome.storage.local.get(['searchEngines'], (result) => {
            const searchEngines = result.searchEngines || []
            const regexps = searchEngines.map(engine => new RegExp(engine.replace('*', '.*')))

            chrome.history.search({ text: '', startTime: 0, maxResults: 1000 }, (results) => {
                const siteCounts = {}

                results.forEach((item) => {
                    const url = new URL(item.url)
                    const domain = url.hostname
                    const shouldExclude = regexps.some(regex => regex.test(domain))
                    if (!shouldExclude) {
                        if (siteCounts[domain]) {
                            siteCounts[domain]++
                        } else {
                            siteCounts[domain] = 1
                        }
                    }
                })

                const uniqueSites = Object.keys(siteCounts).length
                const topSites = Object.entries(siteCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([domain, count]) => ({ domain, count }))

                sendResponse({ uniqueSites, topSites })
            })
        })

        return true // Will respond asynchronously.
    } else if (message.action === 'getAutocompleteSuggestions') {
        chrome.history.search({ text: message.query, maxResults: 100 }, (results) => {
            const suggestions = []
            results.forEach((item) => {
                const url = new URL(item.url)
                const domain = url.hostname
                if (!suggestions.includes(domain)) {
                    suggestions.push(domain)
                }
            })
            sendResponse({ suggestions })
        })
        return true // Will respond asynchronously.
    } else if (message.action === 'modifyHistoryBatch') {
        chrome.storage.local.get(['searchEngines'], (result) => {
            const searchEngines = result.searchEngines || []
            const regexps = searchEngines.map(engine => new RegExp(engine.replace('*', '.*')))
            const regexps_is_domain = new RegExp(/^(https?\:?\/?\/?)([a-zA-Z0-9\.]*)\/?\n?$/gm)

            chrome.history.search({ text: '', startTime: 0, maxResults: 1000000000 }, (results) => {
                const promises = []
                const historyItems = []
                console.log(results.length)
                results.forEach((item) => {
                    const url = new URL(item.url)
                    const domain = url.hostname

                    const shouldExclude = regexps.some(regex => regex.test(domain))
                    const isDomain = regexps_is_domain.test(item.url)
                    if (!shouldExclude && !isDomain) {
                        historyItems.push({ url: `${url.protocol}//${domain}`, lastVisitTime: item.lastVisitTime })
                        chrome.history.deleteUrl({ url: item.url })
                    }
                    
                })

                historyItems.sort((a, b) => a.lastVisitTime - b.lastVisitTime)

                historyItems.forEach((item) => {
                    promises.push(new Promise((resolve, reject) => {
                        chrome.history.deleteUrl({ url: item.url }, () => {
                            chrome.history.addUrl({ url: item.url }, () => {
                                resolve()
                            })
                        })
                    }))
                })

                Promise.all(promises).then(() => {
                    sendResponse({ success: true })
                }).catch(() => {
                    sendResponse({ success: false })
                })
            })
        })

        return true // Will respond asynchronously.
    }
})

// Handle omnibox input
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    chrome.storage.local.get(['searchEngines'], (result) => {
        const searchEngines = result.searchEngines || []
        const regexps = searchEngines.map(engine => new RegExp(engine.replace('*', '.*')))

        chrome.history.search({ text: text, startTime: 0, maxResults: 1000000000 }, (results) => {
            const suggestions = []
            const uniqueDomains = new Set()

            results.forEach((item) => {
                const url = new URL(item.url)
                const domain = url.hostname
                const shouldExclude = regexps.some(regex => regex.test(domain))
                if (!uniqueDomains.has(domain) && !shouldExclude) {
                    uniqueDomains.add(domain)
                    suggestions.push({ content: domain, description: domain })
                }
            })

            suggest(suggestions)
        })
    })
})

chrome.omnibox.onInputEntered.addListener((text) => {
    chrome.tabs.update({ url: `https://${text}` })
})
