// Add functionality for file upload
        const uploadSection = document.querySelector('.upload-section');
        const chooseBtn = document.querySelector('.choose-btn');
        const canvas = document.getElementById('screenshotCanvas');
        const ctx = canvas.getContext('2d');
        const previewContainer = document.querySelector('.preview-img');
        let previewImg = document.querySelector('.preview-img img')
        let tempFile;

        //padding slider
        const paddingSlider = document.getElementById('padding');
        const paddingValueDisplay = document.getElementById('paddingValue');
        //Border Radius slider
        const borderRadSlider = document.getElementById('radius');
        const borderRadValueDisplay = document.getElementById('radiusValue');
        //Shadow Slider
        const shadowSlider = document.getElementById('shadow');
        const shadowValueDisplay = document.getElementById('shadowValue');
        //PositionX Slider
        const posXSlider = document.getElementById('positionX');
        const posXValueDisplay = document.getElementById('positionXValue');
        //PositionY Slider
        const posYSlider = document.getElementById('positionY');
        const posYValueDisplay = document.getElementById('positionYValue');
        //for gradients
        let colorStop0 = '#8845e5';
        let colorStop1 = '#4c1c92';

        //Applying gradients to Gradient buttons
        const gradientButtons = document.querySelectorAll('.gradient-btn');
        const gradientContainer = document.querySelector('.gradient-background');

        gradientButtons.forEach(button => {
            const gradient = button.getAttribute('data-gradient');
            button.style.background = gradient;

            button.addEventListener('click', () => {
                colorStop0 = button.getAttribute('data-colorStop0');
                colorStop1 = button.getAttribute('data-colorStop1');
                if (tempFile) {
                    // console.log(`Inside grd-btn event lis:-- colorstop0: ${colorStop0}\ncolorstop1: ${colorStop1}`)
                    draw(tempFile, colorStop0, colorStop1, paddingSlider,
                        borderRadSlider, shadowSlider,
                        posXSlider, posYSlider);
                }
            });
        });

        //Padding slider Event listener
        paddingSlider.addEventListener('input', () => {
            padding = parseInt(paddingSlider.value);
            paddingValueDisplay.textContent = `${padding}px`;
            if (tempFile) {
                draw(tempFile, colorStop0, colorStop1, paddingSlider, borderRadSlider,
                    shadowSlider, posXSlider, posYSlider);
            }
        });

        //Border radius event listener
        borderRadSlider.addEventListener('input', () => {
            borderRad = parseInt(borderRadSlider.value);
            borderRadValueDisplay.textContent = `${borderRad}px`;
            if (tempFile) {
                draw(tempFile, colorStop0, colorStop1, paddingSlider,
                    borderRadSlider, shadowSlider, posXSlider, posYSlider);
            }
        });

        //Shadow Slider event Listener
        shadowSlider.addEventListener('input', () => {
            shadowIntensity = parseInt(shadowSlider.value);
            shadowValueDisplay.textContent = `${shadowIntensity}px`;
            if (tempFile) {
                draw(tempFile, colorStop0, colorStop1, paddingSlider,
                    borderRadSlider, shadowSlider, posXSlider, posYSlider);
            }
        });
        //PosX slider event listener
        posXSlider.addEventListener('input', () => {
            positionX = parseInt(posXSlider.value);
            posXValueDisplay.textContent = `${positionX}px`;

            if (tempFile) {
                draw(tempFile, colorStop0, colorStop1, paddingSlider,
                    borderRadSlider, shadowSlider, posXSlider, posYSlider);
            }
        });
        //PosY slider event listener
        posYSlider.addEventListener('input', () => {
            positionY = parseInt(posYSlider.value);
            posYValueDisplay.textContent = `${positionY}px`;
            if (tempFile) {
                draw(tempFile, colorStop0, colorStop1, paddingSlider,
                    borderRadSlider, shadowSlider, posXSlider, posYSlider);
            }
        });

        document.getElementById('aspectRatio').addEventListener('change', () => {
            if (tempFile) {
                draw(
                    tempFile, colorStop0, colorStop1, paddingSlider, borderRadSlider,
                    shadowSlider, posXSlider, posYSlider)
            };
        });
        //border style buttons
        let selectedBorderStyle = 'none';

        document.querySelectorAll('.border-style-button').forEach(button => {
            button.addEventListener('click', () => {
                selectedBorderStyle = button.getAttribute('data-style');

                // update button visuals
                document.querySelectorAll('.border-style-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                draw(tempFile, colorStop0, colorStop1, paddingSlider,
                    borderRadSlider, shadowSlider, posXSlider, posYSlider);
            });
        });
        //upload section
        uploadSection.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.click();

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    tempFile = e.target.files[0];
                    uploadSection.style.display = 'none';
                    // Show preview
                    previewContainer.style.display = 'flex';
                    draw(tempFile, '#8845e5', '#4c1c92', paddingSlider,
                        borderRadSlider, shadowSlider, posXSlider, posYSlider);

                }
            });
        });

        document.querySelectorAll('.btn-reset').forEach(button => {
            button.addEventListener('click', () => {
                const setting = button.closest('.setting');
                const input = setting.querySelector('input[type="range"]');
                const span = setting.querySelector('span');

                const defaultValue = input.getAttribute('value');
                input.value = defaultValue;

                // Trigger input event if you have listeners relying on it
                input.dispatchEvent(new Event('input'));
            });
        });


        function draw(imageFile, colorStop0, colorStop1, paddingSlider, borderRad, shadow_slider, xSlider, ySlider) {
            const padding = parseInt(paddingSlider.value);
            const borderRadius = parseInt(borderRadSlider.value);
            const shadowIntensity = parseInt(shadowSlider.value);
            const posX = parseInt(xSlider.value);
            const posY = parseInt(ySlider.value);

            // Create an object to store the original image dimensions and settings for downloading
            if (!window.originalImageData) {
                window.originalImageData = {};
            }

            const img = new Image();
            img.onload = () => {
                // Store original image for high-res export
                window.originalImageData = {
                    file: imageFile,
                    width: img.width,
                    height: img.height,
                    colorStop0: colorStop0,
                    colorStop1: colorStop1,
                    padding: padding,
                    borderRadius: borderRadius,
                    shadowIntensity: shadowIntensity,
                    posX: posX,
                    posY: posY,
                    borderStyle: selectedBorderStyle
                };

                // Calculate container dimensions
                const container = document.querySelector('.right-screenshot-preview');
                const containerWidth = container.clientWidth - 40; // Leave some margin
                const containerHeight = container.clientHeight - 100; // Leave space for the download button

                // Calculate scaling factor to fit within container
                const aspectRatio = document.getElementById('aspectRatio').value;
                let canvasWidth, canvasHeight;
                let scale = 1;
                let centerOffsetX = 0;
                let centerOffsetY = 0;

                if (aspectRatio === "original") {
                    // Use image's natural aspect ratio
                    const imageRatio = img.width / img.height;

                    // Calculate dimensions with padding
                    canvasWidth = img.width + (2 * padding);
                    canvasHeight = img.height + (2 * padding);

                    // Scale down if needed to fit container
                    if (canvasWidth > containerWidth || canvasHeight > containerHeight) {
                        const widthRatio = containerWidth / canvasWidth;
                        const heightRatio = containerHeight / canvasHeight;
                        scale = Math.min(widthRatio, heightRatio);

                        canvasWidth = Math.floor(canvasWidth * scale);
                        canvasHeight = Math.floor(canvasHeight * scale);
                    }
                } else {
                    // Use selected aspect ratio
                    const [w, h] = aspectRatio.split(":").map(Number);
                    const targetRatio = w / h;

                    // First, determine max size based on container
                    if (containerWidth / targetRatio <= containerHeight) {
                        // Width is the limiting factor
                        canvasWidth = containerWidth;
                        canvasHeight = containerWidth / targetRatio;
                    } else {
                        // Height is the limiting factor
                        canvasHeight = containerHeight;
                        canvasWidth = containerHeight * targetRatio;
                    }

                    // Calculate how to fit and center the image in the new aspect ratio
                    const imageAspectRatio = img.width / img.height;
                    const paddedImageWidth = img.width + (2 * padding);
                    const paddedImageHeight = img.height + (2 * padding);

                    // Calculate scale to fit the padded image within the canvas
                    const scaleByWidth = canvasWidth / paddedImageWidth;
                    const scaleByHeight = canvasHeight / paddedImageHeight;
                    scale = Math.min(scaleByWidth, scaleByHeight);

                    // Calculate the actual scaled dimensions
                    const scaledPaddedWidth = paddedImageWidth * scale;
                    const scaledPaddedHeight = paddedImageHeight * scale;

                    // Center the image within the canvas
                    centerOffsetX = (canvasWidth - scaledPaddedWidth) / 2;
                    centerOffsetY = (canvasHeight - scaledPaddedHeight) / 2;
                }

                // Set canvas display size
                canvas.style.width = canvasWidth + 'px';
                canvas.style.height = canvasHeight + 'px';

                // Set actual canvas dimensions (for crisp rendering)
                // Use 2x resolution for better display quality
                const pixelRatio = window.devicePixelRatio || 1;
                canvas.width = canvasWidth * pixelRatio;
                canvas.height = canvasHeight * pixelRatio;
                ctx.scale(pixelRatio, pixelRatio);

                // Calculate scaled image dimensions for display
                const scaledImgWidth = (img.width * scale);
                const scaledImgHeight = (img.height * scale);

                // Calculate scaled padding
                const scaledPadding = padding * scale;

                // Draw gradient background
                const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
                gradient.addColorStop(0, colorStop0);
                gradient.addColorStop(1, colorStop1);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // Position for the image - account for centering offsets
                const x = centerOffsetX + scaledPadding + (posX * scale);
                const y = centerOffsetY + scaledPadding + (posY * scale);

                // Draw shadow
                ctx.shadowBlur = shadowIntensity * scale;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 15 * scale;
                ctx.shadowColor = 'rgb(28,28,28)';

                // Apply border style
                let borderThickness = 0;
                let borderColor = '';

                // if (selectedBorderStyle === 'glass-light') {
                //     // borderThickness = 11;
                //     borderThickness = 18 * scale;
                //     // console.log(`glass light Scale: ${scale}`)
                //     // console.log(`Border thickness: ${borderThickness}`)
                //     borderColor = 'rgba(255, 255, 255, 0.3)';
                // } else if (selectedBorderStyle === 'glass-dark') {
                //     // borderThickness = 11;
                //     borderThickness = 18 * scale;
                //     // console.log(`Border thickness: ${borderThickness}`)
                //     borderColor = 'rgba(0, 0, 0, 0.3)';
                // }

                if (selectedBorderStyle === 'glass-light') {
                    // Use a base thickness that's relative to the canvas size, not the image scale
                    borderThickness = Math.max(8, (canvasWidth + canvasHeight) / 100);
                    borderColor = 'rgba(255, 255, 255, 0.3)';
                } else if (selectedBorderStyle === 'glass-dark') {
                    borderThickness = Math.max(8, (canvasWidth + canvasHeight) / 100);
                    borderColor = 'rgba(0, 0, 0, 0.3)';
                }


                // Draw border if applicable
                if (borderThickness > 0) {
                    ctx.lineWidth = borderThickness;
                    ctx.strokeStyle = borderColor;
                    ctx.beginPath();

                    const scaledRadius = borderRadius * scale;
                    roundedRect(ctx, x, y, scaledImgWidth, scaledImgHeight, scaledRadius);

                    ctx.stroke();
                }

                ctx.save(); // Save the context state

                // Begin rounded rectangle clipping path
                ctx.beginPath();
                roundedRect(ctx, x, y, scaledImgWidth, scaledImgHeight, borderRadius * scale);
                ctx.clip(); // Clip to rounded rectangle

                // Draw the image
                ctx.drawImage(img, x, y, scaledImgWidth, scaledImgHeight);
                ctx.restore(); // Restore context
            };

            img.src = URL.createObjectURL(imageFile);
        }

        // Helper function for drawing rounded rectangles
        function roundedRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

        // Modify the download function to create a high-resolution version
        document.getElementById('downloadBtn').addEventListener('click', () => {
            if (!window.originalImageData) return;

            // Create a new high-resolution canvas for export
            const exportCanvas = document.createElement('canvas');
            const exportCtx = exportCanvas.getContext('2d');

            const data = window.originalImageData;

            // Set aspect ratio
            const aspectRatio = document.getElementById('aspectRatio').value;
            let exportWidth, exportHeight;
            let centerOffsetX = 0;
            let centerOffsetY = 0;

            if (aspectRatio === "original") {
                // Use image's natural dimensions plus padding
                exportWidth = data.width + (2 * data.padding);
                exportHeight = data.height + (2 * data.padding);
            } else {
                // Use selected aspect ratio at original image resolution
                const [w, h] = aspectRatio.split(":").map(Number);
                const targetRatio = w / h;

                // Base the size on the largest dimension of the original image
                if (data.width >= data.height) {
                    exportWidth = data.width + (2 * data.padding);
                    exportHeight = exportWidth / targetRatio;
                } else {
                    exportHeight = data.height + (2 * data.padding);
                    exportWidth = exportHeight * targetRatio;
                }

                // Calculate centering offsets for non-original aspect ratios
                const paddedImageWidth = data.width + (2 * data.padding);
                const paddedImageHeight = data.height + (2 * data.padding);

                // Calculate scale to fit the padded image within the export canvas
                const scaleByWidth = exportWidth / paddedImageWidth;
                const scaleByHeight = exportHeight / paddedImageHeight;
                const scale = Math.min(scaleByWidth, scaleByHeight);

                // Calculate the actual scaled dimensions
                const scaledPaddedWidth = paddedImageWidth * scale;
                const scaledPaddedHeight = paddedImageHeight * scale;

                // Center the image within the export canvas
                centerOffsetX = (exportWidth - scaledPaddedWidth) / 2;
                centerOffsetY = (exportHeight - scaledPaddedHeight) / 2;

                // Update the actual image dimensions for drawing (scaled)
                const scaledImageWidth = data.width * scale;
                const scaledImageHeight = data.height * scale;
                const scaledPadding = data.padding * scale;
                const scaledPosX = data.posX * scale;
                const scaledPosY = data.posY * scale;
                const scaledBorderRadius = data.borderRadius * scale;
                const scaledShadowIntensity = data.shadowIntensity * scale;

                // Store scaled values for use in drawing
                data.scaledWidth = scaledImageWidth;
                data.scaledHeight = scaledImageHeight;
                data.scaledPadding = scaledPadding;
                data.scaledPosX = scaledPosX;
                data.scaledPosY = scaledPosY;
                data.scaledBorderRadius = scaledBorderRadius;
                data.scaledShadowIntensity = scaledShadowIntensity;
                data.scale = scale;
            }

            // Set canvas dimensions to the export size
            exportCanvas.width = exportWidth;
            exportCanvas.height = exportHeight;

            // Draw gradient background
            const gradient = exportCtx.createLinearGradient(0, 0, exportWidth, exportHeight);
            gradient.addColorStop(0, data.colorStop0);
            gradient.addColorStop(1, data.colorStop1);
            exportCtx.fillStyle = gradient;
            exportCtx.fillRect(0, 0, exportWidth, exportHeight);

            // Calculate position for the image (with centering)
            let x, y, imgWidth, imgHeight, borderRadius, shadowIntensity;

            if (aspectRatio === "original") {
                x = data.padding + data.posX;
                y = data.padding + data.posY;
                imgWidth = data.width;
                imgHeight = data.height;
                borderRadius = data.borderRadius;
                shadowIntensity = data.shadowIntensity;
            } else {
                x = centerOffsetX + data.scaledPadding + data.scaledPosX;
                y = centerOffsetY + data.scaledPadding + data.scaledPosY;
                imgWidth = data.scaledWidth;
                imgHeight = data.scaledHeight;
                borderRadius = data.scaledBorderRadius;
                shadowIntensity = data.scaledShadowIntensity;
            }

            // Draw shadow
            exportCtx.shadowBlur = shadowIntensity;
            exportCtx.shadowOffsetX = 0;
            exportCtx.shadowOffsetY = 15 * (aspectRatio === "original" ? 1 : data.scale);
            exportCtx.shadowColor = 'rgb(28,28,28)';

            // Apply border style
            let borderThickness = 0;
            let borderColor = '';

            if (data.borderStyle === 'glass-light') {
                borderThickness = 18 * (aspectRatio === "original" ? 1 : data.scale);
                // borderThickness = 11;
                borderColor = 'rgba(255, 255, 255, 0.3)';
            } else if (data.borderStyle === 'glass-dark') {
                borderThickness = 18 * (aspectRatio === "original" ? 1 : data.scale);
                // borderThickness = 11;
                borderColor = 'rgba(0, 0, 0, 0.3)';
            }

            // Draw border if applicable
            if (borderThickness > 0) {
                exportCtx.lineWidth = borderThickness;
                exportCtx.strokeStyle = borderColor;
                roundedRect(exportCtx, x, y, imgWidth, imgHeight, borderRadius);
                exportCtx.stroke();
            }

            exportCtx.save(); // Save the context state

            // Begin rounded rectangle clipping path
            exportCtx.beginPath();
            roundedRect(exportCtx, x, y, imgWidth, imgHeight, borderRadius);
            exportCtx.clip(); // Clip to rounded rectangle

            // Load the original image again for full quality
            const img = new Image();
            img.onload = () => {
                // Draw the image at the calculated position and size
                exportCtx.drawImage(img, x, y, imgWidth, imgHeight);
                exportCtx.restore();

                // Convert to data URL and trigger download
                const link = document.createElement("a");
                link.download = "screenshot-beautified.png";

                // Add a delay to ensure the canvas has finished rendering
                setTimeout(() => {
                    link.href = exportCanvas.toDataURL("image/png");
                    link.click();
                }, 100);
            };

            img.src = URL.createObjectURL(data.file);
        });
