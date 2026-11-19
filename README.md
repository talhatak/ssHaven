# ScreenshotHaven

A free, browser-based tool for turning screenshots into polished images for social media. Built with plain HTML, CSS, and JavaScript, with no build step or runtime dependencies.

## Features

- Upload an image from your device.
- Choose from gradient background presets.
- Adjust padding, rounded corners, shadow intensity, and image position.
- Apply light or dark glass borders.
- Keep the original aspect ratio or use presets for posts, portraits, and stories.
- Download the result as a high-resolution PNG.

Image processing happens locally in your browser; the app does not upload your images to a server. No account is required.

## Run locally

Clone the repository and start a static server from its root:

```sh
git clone https://github.com/talhatak/ssHaven.git
cd ssHaven
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000) in your browser. Python is only used to serve the files; any static web server will work.

Click **Choose File**, select a screenshot, adjust its appearance, and click **Download Image** to export it.

## Project structure

```text
ssHaven/
├── index.html        # Page structure and content
├── css/
│   └── styles.css    # Styles and responsive layout
├── js/
│   └── app.js        # Editor controls, canvas rendering, and PNG export
├── assets/           # Branding, app icons, and web manifest
├── default.png       # Border style thumbnail
├── glass-light.png   # Light glass border thumbnail
├── glass-dark.png    # Dark glass border thumbnail
├── favicon.ico
├── README.md
└── LICENSE
```

## Development

Edit `index.html` for markup, `css/styles.css` for presentation, and `js/app.js` for behavior. Refresh the browser to see changes. No package installation or compilation is required.

Before submitting changes, check the layout at desktop and mobile widths and manually verify image upload, editor controls, and PNG export. JavaScript syntax can also be checked with Node.js:

```sh
node --check js/app.js
```

To deploy, serve the repository root with a static hosting provider. Keep the file structure intact so stylesheet, script, and asset paths resolve correctly.

## Contributing

Issues and pull requests are welcome. Describe the problem or proposed improvement and keep changes focused. Preserve existing attribution comments when editing third-party snippets.

## Credits

The animated header button is attributed in the source to **Ashon-G on Uiverse.io**.

## License

This project is licensed under the [MIT License](LICENSE).
