document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchEnginesForm')
    const searchEnginesList = document.getElementById('searchEnginesList')
    const addEngineButton = document.getElementById('addEngine')
    const modifyHistoryButton = document.getElementById('modifyHistory')

    // Load saved search engines from storage
    chrome.storage.local.get(['searchEngines'], (result) => {
        if (result.searchEngines) {
            searchEnginesList.innerHTML = ''
            result.searchEngines.forEach(engine => {
                addSearchEngineInput(engine)
            })
        }
    })

    // Add a new search engine input field
    addEngineButton.addEventListener('click', () => {
        addSearchEngineInput('')
    })

    // Save the search engines to storage
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const searchEngines = []
        form.querySelectorAll('input[name="searchEngine"]').forEach(input => {
            if (input.value.trim()) {
                searchEngines.push(input.value.trim())
            }
        })
        chrome.storage.local.set({ searchEngines }, () => {
            alert('Search engines saved.')
        })
    })

    // Handle Modify History button click
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

// Add a search engine input field
function addSearchEngineInput(value) {
    const div = document.createElement('div')
    div.className = 'engine-input'
    div.innerHTML = `<input type="text" name="searchEngine" value="${value}">
                   <button type="button" onclick="removeEngine(this)">Remove</button>`
    document.getElementById('searchEnginesList').appendChild(div)
}

// Remove a search engine input field
function removeEngine(button) {
    button.parentElement.remove()
}
