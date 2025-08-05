# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2025-08-05

### Added
- **Multiple directories support**: Configure up to 5 different directories in extension preferences
- **Directory selector dropdown**: Switch between directories or view all directories at once
- **Default directory preference**: Set which directory opens by default when launching the extension
- **Directory navigation**: "Next Directory" action with keyboard shortcut (Ctrl+J) to cycle through directories
- **Enhanced directory management**: Each directory shows as a separate option with proper naming

### Changed
- **Preferences interface**: Replaced single directory field with 5 individual directory pickers
- **Improved thumbnails**: Fixed aspect ratio preservation to prevent image cropping (Grid.Fit.Contain)
- **Better user feedback**: Toast notifications show which directory is currently active
- **Cleaner action menu**: Removed unnecessary section titles for streamlined interface

### Fixed
- **Thumbnail cropping**: Images now display completely without being cut off
- **Directory synchronization**: Dropdown properly reflects current directory selection
- **Default directory logic**: Extension now correctly opens in configured default directory

## [1.2.0] - 2025-07-28

### Added
- **Smart caching system**: Images are now cached in memory with directory modification time tracking
- **Performance boost**: Extension loads much faster on subsequent runs when directory hasn't changed
- **Cache status indicators**: Toast messages now indicate whether images were loaded from cache or directory
- **Force refresh functionality**: "Refresh List" action now properly forces directory scan, bypassing cache

### Changed
- Improved loading messages to distinguish between cached and fresh directory scans
- Enhanced user feedback with detailed toast notifications about cache status

### Performance
- Significantly reduced loading times for unchanged directories
- Eliminated unnecessary file system scans when no changes are detected

## [1.1.2] - Previous Release
- Enhanced UX and Windows compatibility

## [1.1.1] - Previous Release  
- Updated assets and improved functionality

## [1.1.0] - Previous Release
- Enhanced Logo Picker with improved UX

## [1.0.0] - Initial Release
- Basic logo picker functionality
- Grid view for browsing images
- Copy to clipboard and paste to focused app
- Support for PNG and SVG files