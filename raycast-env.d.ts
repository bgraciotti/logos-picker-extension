/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Images Directory - Directory path containing images to browse (.png and .svg files) */
  "imageDirectory": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `image-picker` command */
  export type ImagePicker = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `image-picker` command */
  export type ImagePicker = {}
}

