# ![Logo](.github/.assets/logo.png) History Modifier



## Who is?

**History Modifier** is a Chrome extension designed to manage and manipulate your browsing history. It allows users to exclude specific search engines from their history, modify existing history entries, and view statistics about their browsing habits.

## Features

- **Exclude Search Engines**: Add regular expressions to exclude specific domains from your history.
- **Modify History**: Batch modify history entries while preserving original timestamps and order.
- **View Statistics**: See unique sites visited and the top 5 most visited sites.
- **Omnibox Integration**: Provides autocomplete suggestions based on your browsing history directly in the Chrome address bar. [@hms]

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zcxw-code/history-modifier.git
   ```
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory where you cloned the repository.

## Usage

### Exclude Search Engines

1. Click on the extension icon in the Chrome toolbar.
2. Select "Options".
3. Add search engines (using regular expressions) to the exclusion list.
4. Click "Save".

### Modify History

1. Click on the extension icon in the Chrome toolbar.
2. In the popup, click "Modify History".
3. Confirm the action in the prompt.

### View Statistics

1. Click on the extension icon in the Chrome toolbar.
2. The popup will display the number of unique sites and the top 5 most visited sites.

### Omnibox Integration

1. In the Chrome address bar, type `search` followed by a space or Tab.
2. Enter your search query to see suggestions based on your history.

## Development

### File Structure

```plaintext
history-modifier/
├── background/
│   ├── background.js
├── content/
│   ├── content.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
├── options/
│   ├── options.html
│   ├── options.js
│   ├── options.css
├── popup/
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
├── README-EN.md
├── LICENSE
└── README.md
```

### Scripts

- **background.js**: Handles the core functionality of the extension, including history modification and omnibox suggestions.
- **content.js**: (Optional) If you need to manipulate content within web pages.
- **options.js**: Manages the options page where users can add/remove search engines from the exclusion list.
- **popup.js**: Controls the popup interface displayed when the extension icon is clicked.

## Permissions

- **history**: To access and modify the browsing history.
- **tabs**: To interact with the currently open tabs.
- **activeTab**: To interact with the content of the active tab.
- **storage**: To store user preferences and settings.

## Contribution

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code follows the existing style and conventions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [RegExp Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

---

**History Modifier** - Simplifying your browsing experience, one modification at a time.

