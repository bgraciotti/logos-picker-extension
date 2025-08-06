import {
    Action,
    ActionPanel,
    Icon,
    Grid,
    showToast,
    Toast,
    getPreferenceValues,
    Clipboard,
    showInFinder,
    Keyboard,
} from "@raycast/api"
import { useEffect, useState } from "react"
import * as fs from "fs"
import * as path from "path"

interface Preferences {
    directory1: string
    directory2?: string
    directory3?: string
    directory4?: string
    directory5?: string
    defaultDirectory?: string
    enableCache: boolean
}

interface ImageInfo {
    name: string
    path: string
    extension: string
    directory: string
    directoryName: string
}

interface CacheEntry {
    images: ImageInfo[]
    lastModified: number
    directoryPath: string
}

interface DirectoriesCache {
    [key: string]: CacheEntry
}

const directoriesCache: DirectoriesCache = {}

function getDirectoryLastModified(directory: string): number {
    try {
        const stats = fs.statSync(directory)
        return stats.mtime.getTime()
    } catch (error) {
        return 0
    }
}

function parseDirectories(preferences: Preferences): string[] {
    const directories = [
        preferences.directory1,
        preferences.directory2,
        preferences.directory3,
        preferences.directory4,
        preferences.directory5,
    ]

    return directories.filter(dir => dir && dir.trim().length > 0).map(dir => dir!.trim())
}

function getDirectoryDisplayName(directory: string): string {
    return path.basename(directory) || directory
}

async function fetchImagesFromDirectory(
    directory: string,
    forceRefresh: boolean = false,
    cacheEnabled: boolean = true,
): Promise<{ images: ImageInfo[]; fromCache: boolean }> {
    try {
        if (!fs.existsSync(directory)) {
            throw new Error(`Directory does not exist: ${directory}`)
        }

        const currentModified = getDirectoryLastModified(directory)
        const cacheKey = directory

        // Check if we have valid cache for this directory (unless forced refresh or cache disabled)
        if (
            cacheEnabled &&
            !forceRefresh &&
            directoriesCache[cacheKey] &&
            directoriesCache[cacheKey].lastModified === currentModified
        ) {
            return { images: directoriesCache[cacheKey].images, fromCache: true }
        }

        const files = fs.readdirSync(directory)
        const supportedExtensions = [".png", ".svg"]
        const directoryName = getDirectoryDisplayName(directory)

        const images: ImageInfo[] = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase()
                return supportedExtensions.includes(ext)
            })
            .map(file => ({
                name: path.basename(file, path.extname(file)),
                path: path.join(directory, file),
                extension: path.extname(file).toLowerCase(),
                directory: directory,
                directoryName: directoryName,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

        // Update cache only if cache is enabled
        if (cacheEnabled) {
            directoriesCache[cacheKey] = {
                images,
                lastModified: currentModified,
                directoryPath: directory,
            }
        }

        return { images, fromCache: false }
    } catch (error) {
        throw new Error(`Failed to read directory: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}

async function fetchImagesFromMultipleDirectories(
    directories: string[],
    forceRefresh: boolean = false,
    cacheEnabled: boolean = true,
): Promise<{ images: ImageInfo[]; fromCache: boolean }> {
    const results = await Promise.allSettled(
        directories.map(dir => fetchImagesFromDirectory(dir, forceRefresh, cacheEnabled)),
    )

    let allImages: ImageInfo[] = []
    let anyFromCache = false
    let anyFresh = false

    results.forEach(result => {
        if (result.status === "fulfilled") {
            allImages = allImages.concat(result.value.images)
            if (result.value.fromCache) anyFromCache = true
            else anyFresh = true
        }
    })

    // Sort all images by name
    allImages.sort((a, b) => a.name.localeCompare(b.name))

    return {
        images: allImages,
        fromCache: anyFromCache && !anyFresh,
    }
}

async function copyImageToClipboard(imagePath: string): Promise<void> {
    try {
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image file does not exist: ${imagePath}`)
        }

        await Clipboard.copy({ file: imagePath })
    } catch (error) {
        throw new Error(`Failed to copy image: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}

export default function Command() {
    const preferences = getPreferenceValues<Preferences>()
    const [images, setImages] = useState<ImageInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const getInitialDirectory = (): string => {
        const defaultDirPref = preferences.defaultDirectory || "all"
        if (defaultDirPref === "all") return "all"

        // Map the preference key to actual directory path for the dropdown
        const dirValue = preferences[defaultDirPref as keyof Preferences] as string
        if (dirValue && dirValue.trim()) {
            return dirValue.trim() // Return the actual directory path
        }

        return "all" // Fallback to all directories
    }

    const [selectedDirectory, setSelectedDirectory] = useState<string>(getInitialDirectory())

    const directories = parseDirectories(preferences)
    const directoryOptions = [
        { title: "All Directories", value: "all" },
        ...directories.map(dir => ({
            title: getDirectoryDisplayName(dir),
            value: dir,
        })),
    ]

    const cycleToNextDirectory = () => {
        const allOptions = directoryOptions.map(opt => opt.value)
        const currentIndex = allOptions.indexOf(selectedDirectory)
        const nextIndex = (currentIndex + 1) % allOptions.length
        const nextDirectory = allOptions[nextIndex]
        setSelectedDirectory(nextDirectory)

        // Show toast to indicate directory change
        showToast({
            style: Toast.Style.Success,
            title: "Switched to:",
            message: nextDirectory === "all" ? "All Directories" : getDirectoryDisplayName(nextDirectory),
        })
    }

    const loadImages = async (forceRefresh: boolean = false) => {
        const toast = await showToast({
            style: Toast.Style.Animated,
            title: forceRefresh ? "Refreshing images..." : "Loading images...",
        })

        try {
            setIsLoading(true)
            let result

            if (selectedDirectory === "all") {
                result = await fetchImagesFromMultipleDirectories(directories, forceRefresh, preferences.enableCache)
            } else {
                result = await fetchImagesFromDirectory(selectedDirectory, forceRefresh, preferences.enableCache)
            }

            setImages(result.images)

            toast.style = Toast.Style.Success
            const dirInfo = selectedDirectory === "all" ? "all directories" : getDirectoryDisplayName(selectedDirectory)

            if (forceRefresh) {
                toast.title = "Images Refreshed"
                toast.message = `Found ${result.images.length} images from ${dirInfo} (forced refresh).`
            } else if (result.fromCache && preferences.enableCache) {
                toast.title = "Images Loaded from Cache"
                toast.message = `Found ${result.images.length} images from ${dirInfo} (cached).`
            } else {
                toast.title = "Images Loaded from Directory"
                const cacheStatus = preferences.enableCache ? "(scanned)" : "(cache disabled)"
                toast.message = `Found ${result.images.length} images from ${dirInfo} ${cacheStatus}.`
            }
        } catch (error) {
            toast.style = Toast.Style.Failure
            toast.title = "Error Loading Images"
            toast.message = error instanceof Error ? error.message : "An unknown error occurred"
            setImages([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadImages()
    }, [selectedDirectory])

    // Set initial directory based on preference when component mounts
    useEffect(() => {
        const initialDir = getInitialDirectory()
        setSelectedDirectory(initialDir)
    }, [])

    const handleCopyImage = async (image: ImageInfo) => {
        try {
            await copyImageToClipboard(image.path)
            await showToast({
                style: Toast.Style.Success,
                title: "Image Copied",
                message: `${image.name}${image.extension} copied to clipboard`,
            })
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Error Copying Image",
                message: `Failed to copy ${image.name}${image.extension}`,
            })
        }
    }

    const handlePasteToFocusedApp = async (image: ImageInfo) => {
        try {
            await copyImageToClipboard(image.path)
            await Clipboard.paste({ file: image.path })
            await showToast({
                style: Toast.Style.Success,
                title: "Image Pasted",
                message: `${image.name}${image.extension} pasted to focused app`,
            })
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Error Pasting Image",
                message: `Failed to paste ${image.name}${image.extension}`,
            })
        }
    }

    const handleShowInFileExplorer = async (image: ImageInfo) => {
        try {
            await showInFinder(image.path)
            await showToast({
                style: Toast.Style.Success,
                title: "File Revealed",
                message: `Revealed ${image.name}${image.extension} in File Explorer`,
            })
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Error Opening File Explorer",
                message: `Failed to reveal ${image.name}${image.extension}`,
            })
        }
    }

    return (
        <Grid
            isLoading={isLoading}
            searchBarPlaceholder="Filter images..."
            searchBarAccessory={
                <Grid.Dropdown tooltip="Select Directory" onChange={setSelectedDirectory} value={selectedDirectory}>
                    {directoryOptions.map(option => (
                        <Grid.Dropdown.Item key={option.value} title={option.title} value={option.value} />
                    ))}
                </Grid.Dropdown>
            }
            columns={5}
            fit={Grid.Fit.Contain}
            inset={Grid.Inset.Medium}
        >
            {images.length > 0 ? (
                images.map(image => (
                    <Grid.Item
                        key={image.path}
                        title={image.name}
                        subtitle={`${image.extension.toUpperCase()} • ${image.directoryName}`}
                        content={{
                            source: image.path,
                        }}
                        actions={
                            <ActionPanel>
                                <ActionPanel.Section>
                                    <Action
                                        title="Paste to Focused App"
                                        icon={Icon.Download}
                                        onAction={() => handlePasteToFocusedApp(image)}
                                    />
                                    <Action
                                        title="Copy to Clipboard"
                                        icon={Icon.Clipboard}
                                        onAction={() => handleCopyImage(image)}
                                        shortcut={Keyboard.Shortcut.Common.Copy}
                                    />
                                </ActionPanel.Section>

                                <ActionPanel.Section>
                                    <Action
                                        title="Show in File Explorer"
                                        icon={Icon.Folder}
                                        onAction={() => handleShowInFileExplorer(image)}
                                        shortcut={Keyboard.Shortcut.Common.Open}
                                    />
                                </ActionPanel.Section>

                                <ActionPanel.Section>
                                    <Action
                                        title="Refresh List"
                                        icon={Icon.ArrowClockwise}
                                        onAction={() => loadImages(true)}
                                        shortcut={Keyboard.Shortcut.Common.Refresh}
                                    />
                                </ActionPanel.Section>

                                <ActionPanel.Section>
                                    <Action
                                        title="Next Directory"
                                        icon={Icon.ArrowRight}
                                        onAction={cycleToNextDirectory}
                                        shortcut={{ modifiers: ["ctrl"], key: "j" }}
                                    />
                                </ActionPanel.Section>
                            </ActionPanel>
                        }
                    />
                ))
            ) : (
                <Grid.EmptyView
                    title={isLoading ? "Loading Images..." : "No Images Found"}
                    description={
                        isLoading
                            ? "Please wait..."
                            : selectedDirectory === "all"
                              ? `No .png or .svg files found in any configured directory`
                              : `No .png or .svg files found in: ${getDirectoryDisplayName(selectedDirectory)}`
                    }
                    icon={Icon.Image}
                />
            )}
        </Grid>
    )
}
