document.addEventListener("DOMContentLoaded", () => {
    const initLector = () => {
        console.log("entraaaa");
        Quagga.init({
            inputStream: {
                constraints: {
                    width: 1920,
                    height: 1080,
                },
                name: "Live",
                type: "LiveStream",
                facingMode: "environment",
                target: document.querySelector('#lector'), // Pasar el elemento del DOM
                area: { // defines rectangle of the detection/localization area
                    top: "30%",    // top offset
                    right: "0%",  // right offset
                    left: "0%",   // left offset
                    bottom: "30%"  // bottom offset
                },
            },
            decoder: {
                readers: ["ean_reader"]
            },
            locator: {
                halfSample: true,
                patchSize: "medium" // x-small, small, medium, large, x-large
            }
        }, function (err) {
            if (err) {
                console.log(err);
                return
            }
            console.log("Iniciado correctamente");
            Quagga.start();
        });
    
        Quagga.onDetected((data) => {
            sound.play();
            app.codigoActual = data.codeResult.code;
            app.setDatosActuales(data.codeResult.code);
            Quagga.stop();
            window.navigator.vibrate(500);
            app.setScannerVisible(false);
        });
    
        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });
    }
    objectQuagga.initQuagga = initLector;
});
