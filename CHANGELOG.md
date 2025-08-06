# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2025-08-06

### Added
- **Configurable cache toggle**: New preference to enable/disable image caching system
- **Cache control**: Users can now choose to always scan directories fresh or use caching for faster loading
- **Enhanced cache status feedback**: Toast messages now indicate cache status (enabled/disabled)

### Changed
- **Cache behavior**: Cache is now configurable and enabled by default via extension preferences
- **Improved user control**: Users have full control over caching behavior through settings
- **Better performance awareness**: Clear indication when cache is disabled vs enabled

### Technical
- Added `enableCache` preference with checkbox type and descriptive label
- Enhanced cache-related functions to accept `cacheEnabled` parameter
- Updated toast notifications to reflect current cache configuration

## [1.3.0] - 2025-08-05

### Added
- **Multiple directories support**: Configure up to 5 different directories in extension preferences
- **Directory selector dropdown**: Switch between directories or view all directories at once
- **Default directory preference**: Set which directory opens by default when launching the extension
- **"Next Directory" action**: Cycle through directories via action menu

### Changed
- **Preferences interface**: Replaced single directory field with 5 individual directory pickers using native directory picker
- **Improved thumbnails**: Fixed aspect ratio preservation to prevent image cropping (Grid.Fit.Contain)
- **Enhanced user feedback**: Toast notifications show which directory is currently active

### Fixed
- **Thumbnail cropping**: Images now display completely without being cut off
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