# Changelog

All notable changes to this project will be documented in this file.

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