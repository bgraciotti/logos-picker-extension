import { Action, ActionPanel, Icon, Grid, showToast, Toast, getPreferenceValues, Clipboard, showInFinder, Keyboard } from "@raycast/api";
import { useEffect, useState } from "react";
import * as fs from "fs";
import * as path from "path";

interface Preferences {
    imageDirectory: string;
}

interface ImageInfo {
    name: string;
    path: string;
    extension: string;
}

interface CacheEntry {
    images: ImageInfo[];
    lastModified: number;
    directoryPath: string;
}

let imageCache: CacheEntry | null = null;

function getDirectoryLastModified(directory: string): number {
    try {
        const stats = fs.statSync(directory);
        return stats.mtime.getTime();
    } catch (error) {
        return 0;
    }
}

async function fetchImagesFromDirectory(directory: string, forceRefresh: boolean = false): Promise<{images: ImageInfo[], fromCache: boolean}> {
    try {
        if (!fs.existsSync(directory)) {
            throw new Error(`Directory does not exist: ${directory}`);
        }

        const currentModified = getDirectoryLastModified(directory);
        
        // Check if we have valid cache for this directory (unless forced refresh)
        if (!forceRefresh && imageCache && 
            imageCache.directoryPath === directory && 
            imageCache.lastModified === currentModified) {
            return { images: imageCache.images, fromCache: true };
        }

        const files = fs.readdirSync(directory);
        const supportedExtensions = ['.png', '.svg'];
        
        const images: ImageInfo[] = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return supportedExtensions.includes(ext);
            })
            .map(file => ({
                name: path.basename(file, path.extname(file)),
                path: path.join(directory, file),
                extension: path.extname(file).toLowerCase()
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Update cache
        imageCache = {
            images,
            lastModified: currentModified,
            directoryPath: directory
        };

        return { images, fromCache: false };
    } catch (error) {
        throw new Error(`Failed to read directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

async function copyImageToClipboard(imagePath: string): Promise<void> {
    try {
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image file does not exist: ${imagePath}`);
        }

        await Clipboard.copy({ file: imagePath });
    } catch (error) {
        throw new Error(`Failed to copy image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export default function Command() {
    const preferences = getPreferenceValues<Preferences>();
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadImages = async (forceRefresh: boolean = false) => {
        const toast = await showToast({
            style: Toast.Style.Animated,
            title: forceRefresh ? "Refreshing images..." : "Loading images...",
        });

        try {
            setIsLoading(true);
            const result = await fetchImagesFromDirectory(preferences.imageDirectory, forceRefresh);
            setImages(result.images);

            toast.style = Toast.Style.Success;
            if (forceRefresh) {
                toast.title = "Images Refreshed";
                toast.message = `Found ${result.images.length} images (forced directory refresh).`;
            } else if (result.fromCache) {
                toast.title = "Images Loaded from Cache";
                toast.message = `Found ${result.images.length} images (cached - no directory changes detected).`;
            } else {
                toast.title = "Images Loaded from Directory";
                toast.message = `Found ${result.images.length} images (directory scanned for changes).`;
            }

        } catch (error) {
            toast.style = Toast.Style.Failure;
            toast.title = "Error Loading Images";
            toast.message = error instanceof Error ? error.message : "An unknown error occurred";
            setImages([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, []);

    const handleCopyImage = async (image: ImageInfo) => {
        try {
            await copyImageToClipboard(image.path);
            await showToast({
                style: Toast.Style.Success,
                title: "Image Copied",
                message: `${image.name}${image.extension} copied to clipboard`,
            });
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Error Copying Image",
                message: `Failed to copy ${image.name}${image.extension}`,
            });
        }
    };

    const handlePasteToFocusedApp = async (image: ImageInfo) => {
        try {
            await copyImageToClipboard(image.path);
            await Clipboard.paste({ file: image.path });
            await showToast({
                style: Toast.Style.Success,
                title: "Image Pasted",
                message: `${image.name}${image.extension} pasted to focused app`,
            });
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Error Pasting Image",
                message: `Failed to paste ${image.name}${image.extension}`,
            });
        }
    };

    const handleShowInFileExplorer = async (image: ImageInfo) => {
        try {
            await showInFinder(image.path);
            await showToast({
                style: Toast.Style.Success,
                title: "File Revealed",
                message: `Revealed ${image.name}${image.extension} in File Explorer`,
            });
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Error Opening File Explorer",
                message: `Failed to reveal ${image.name}${image.extension}`,
            });
        }
    };

    const getIconForExtension = (extension: string): Icon => {
        switch (extension) {
            case '.png':
                return Icon.Image;
            case '.svg':
                return Icon.Brush;
            default:
                return Icon.Document;
        }
    };

    return (
        <Grid 
            isLoading={isLoading} 
            searchBarPlaceholder="Filter images..."
            columns={5}
            fit={Grid.Fit.Adaptive}
            inset={Grid.Inset.Medium}
        >
            {images.length > 0 ? (
                images.map((image) => (
                    <Grid.Item
                        key={image.path}
                        title={image.name}
                        subtitle={image.extension.toUpperCase()}
                        content={{ 
                            source: image.path
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
                            : `No .png or .svg files found in: ${preferences.imageDirectory}`
                    }
                    icon={Icon.Image}
                />
            )}
        </Grid>
    );
}