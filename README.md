# Logo Picker extension for Raycast for Windows

Browse, preview and paste logos from directories with a beautiful grid view interface.

## Features
- Grid view with 5 columns showing logo thumbnails
- Support for PNG and SVG files
- **Enter**: Paste directly to focused app (default action)
- **Cmd+C**: Copy to clipboard
- **Ctrl+K**: Show in File Explorer
- **Cmd+R**: Refresh list
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