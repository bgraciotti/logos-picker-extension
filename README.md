# Logo Picker extension for Raycast for Windows

Browse, preview and paste logos from directories with a beautiful grid view interface.

## Features
- Grid view with 5 columns showing logo thumbnails
- Support for PNG and SVG files
- **Enter**: Paste directly to focused app (default action)
- **Ctrl+C**: Copy to clipboard
- **Ctrl+K**: Show in File Explorer
- **Ctrl+R**: Refresh list
- Configurable directory path
- Search/filter logos by name

## How to install:
- Install Node JS (winget install -e --id OpenJS.NodeJS)
- Clone the repository
- Run: "npm ci" then "npm run dev", which adds it to Raycast

## Usage:
1. Configure the logos directory in extension preferences
2. Launch "Search Logos" to browse logos in grid view
3. Select a logo and press Enter to paste directly, or use other shortcuts

## Changelog

### Version 1.1.2
- ⌨️ **Improved action menu UX**: Reordered actions with Copy to Clipboard first, then Paste to Focused App
- 📱 **Added visual dividers**: Actions are now grouped with clean separators for better organization
- 🔧 **Fixed Windows shortcuts**: All keyboard shortcuts now correctly use Ctrl instead of Cmd for Windows compatibility
- ✨ **Enhanced shortcuts display**: Keyboard shortcuts are now visible in the actions menu for better discoverability
- 📝 **Updated documentation**: README now accurately reflects Windows keyboard shortcuts

### Version 1.1.1
- 🎨 **Updated icon**: Improved visual appearance of the extension icon
- 🧹 **Asset cleanup**: Removed unnecessary demo.gif file

### Version 1.1.0
- 🎯 **Changed default behavior**: Enter now pastes directly to focused app (instead of copying to clipboard)
- 📁 **Added "Show in File Explorer"**: New Ctrl+K shortcut to reveal file location in Windows Explorer
- 🏷️ **Updated extension name**: Changed from "Image Browser" to "Logo Picker" 
- 🔍 **Updated command name**: Changed from "Browse Images" to "Search Logos"
- ✨ **Improved user experience**: More intuitive shortcuts and clearer naming

### Version 1.0.0
- Initial release
- Grid view with image thumbnails
- Copy to clipboard functionality
- Configurable directory path
- Search and filter capabilities