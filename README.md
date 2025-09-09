# Logo Picker extension for Raycast for Windows

Browse, preview and paste logos from directories with a beautiful grid view interface.

## Features
- **Multiple directories support**: Configure up to 5 different logo directories
- **Directory selector**: Dropdown to switch between directories or view all at once
- **Default directory**: Set which directory opens by default
- **Directory navigation**: Use `Ctrl+P` to access directory dropdown via keyboard
- Grid view with 5 columns showing logo thumbnails (fixed aspect ratio)
- Support for PNG and SVG files
- **Smart caching system**: Configurable caching for faster loading with intelligent directory change detection
- **Enter**: Paste directly to focused app (default action)
- **Ctrl+C**: Copy to clipboard
- **Ctrl+O**: Show in File Explorer
- **Ctrl+R**: Refresh list (forces directory scan, bypassing cache)
- Search/filter logos by name
- Real-time cache status notifications

## How to install:
- Install Node JS (winget install -e --id OpenJS.NodeJS)
- Clone the repository
- Run: "npm ci" then "npm run dev", which adds it to Raycast

## Usage:
1. Configure your logo directories in extension preferences:
   - **Directory 1** (required): Your primary logos folder
   - **Directory 2-5** (optional): Additional logo folders
   - **Default Directory**: Choose which directory opens by default
   - **Enable Image Cache**: Toggle to enable/disable caching for faster loading
2. Launch "Search Logos" to browse logos in grid view
3. Use the dropdown to switch between directories or view "All Directories"
4. Select a logo and press Enter to paste directly, or use other shortcuts
5. Use `Ctrl+P` to access the directory dropdown via keyboard

## Changelog

### Version 1.4.3
- 🔧 **Fixed extension icon**: Resolved issue where extension icon wasn't appearing in Raycast interface
- 📂 **Icon path correction**: Moved icon from assets/ to root directory where Raycast expects to find it
- 🧹 **Project cleanup**: Removed duplicate icon files and improved project structure

### Version 1.4.2
- 🧹 **Code cleanup**: Removed non-functional "Next Directory" keyboard shortcut action that wasn't working properly
- ⌨️ **Improved keyboard navigation**: Users can now use the native Raycast shortcut `Ctrl+P` to access the directory dropdown
- 🔧 **Technical improvements**: Cleaned up unused functions, imports and simplified component structure for better maintainability
- 📚 **Documentation fixes**: Corrected keyboard shortcuts and removed references to obsolete features

### Version 1.4.1
- 🧹 **Asset organization**: Reorganized project assets and dependencies
- 📦 **Dependency cleanup**: Removed unused `@raycast/utils` dependency to reduce bundle size
- 🔧 **Technical improvements**: Better organized project structure and cleaner dependencies

### Version 1.4.0
- ⚙️ **Configurable cache toggle**: New preference to enable/disable the image caching system
- 🎛️ **Enhanced user control**: Users can now choose to always scan directories fresh or use caching for faster loading
- 💬 **Improved cache feedback**: Toast messages now clearly indicate cache status (enabled/disabled) and loading source
- 🔧 **Better performance control**: Cache is enabled by default but can be disabled via extension preferences for always-fresh scans

### Version 1.3.0
- 📁 **Multiple directories support**: Configure up to 5 different logo directories
- 🔽 **Directory selector dropdown**: Switch between directories or view all at once
- 🎯 **Default directory preference**: Set which directory opens by default when launching
- ⏭️ **Directory navigation**: "Next Directory" action to cycle through directories via action menu
- 🖼️ **Fixed thumbnails**: Improved aspect ratio preservation to prevent image cropping
- 🎛️ **Enhanced preferences**: Native directory pickers for easier configuration
- 💬 **Better feedback**: Toast notifications show which directory is currently active

### Version 1.2.0
- 🚀 **Smart caching system**: Added intelligent directory modification tracking for significantly improved performance
- ⚡ **Performance boost**: Extension now loads much faster on subsequent runs when directory hasn't changed
- 💬 **Cache status indicators**: Toast messages now clearly indicate whether images were loaded from cache or fresh directory scan
- 🔄 **Enhanced refresh functionality**: "Refresh List" action now properly forces directory scan, bypassing cache when needed
- 📊 **Real-time feedback**: Users always know the source of their data (cache vs. directory scan) and loading status

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