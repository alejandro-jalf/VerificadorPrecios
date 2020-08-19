document.addEventListener("DOMContentLoaded", () => {
    const $resultados = document.querySelector("#precio");
    const initLector = () => {
        console.log("entraaaa");
        Quagga.init({
            inputStream: {
                constraints: {
                    width: 500,
                    height: 500,
                },
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#lector'), // Pasar el elemento del DOM
            },
            decoder: {
                readers: ["ean_reader"]
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
            app.codigoActual = data.codeResult.code;
            app.setDatosActuales(data.codeResult.code);
            // Imprimimos todo el data para que puedas depurar
            // console.log(data);
            Quagga.stop();
            app.setScannerVisible(false);
            console.log("stoped", app.codigoActual);
        });
    
        // Quagga.onProcessed(function (result) {
        //     var drawingCtx = Quagga.canvas.ctx.overlay,
        //         drawingCanvas = Quagga.canvas.dom.overlay;
    
        //     if (result) {
        //         if (result.boxes) {
        //             drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
        //             result.boxes.filter(function (box) {
        //                 return box !== result.box;
        //             }).forEach(function (box) {
        //                 Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
        //             });
        //         }
    
        //         if (result.box) {
        //             Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        //         }
    
        //         if (result.codeResult && result.codeResult.code) {
        //             Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        //         }
        //     }
        // });
    }
    objectQuagga.initQuagga = initLector;
    // (any) => {
    //     console.log("Nuevo "+any);
    // };
    // console.log(initLector());
    // initQuagga(false);
});
