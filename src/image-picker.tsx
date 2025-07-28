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

async function fetchImagesFromDirectory(directory: string): Promise<ImageInfo[]> {
    try {
        if (!fs.existsSync(directory)) {
            throw new Error(`Directory does not exist: ${directory}`);
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

        return images;
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

    const loadImages = async () => {
        const toast = await showToast({
            style: Toast.Style.Animated,
            title: "Loading images...",
        });

        try {
            setIsLoading(true);
            const fetchedImages = await fetchImagesFromDirectory(preferences.imageDirectory);
            setImages(fetchedImages);

            toast.style = Toast.Style.Success;
            toast.title = "Images Loaded";
            toast.message = `Found ${fetchedImages.length} images in directory.`;

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
                                        onAction={loadImages}
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