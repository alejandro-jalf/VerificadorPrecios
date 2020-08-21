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
            sound.play();
            app.codigoActual = data.codeResult.code;
            app.setDatosActuales(data.codeResult.code);
            Quagga.stop();
            window.navigator.vibrate(500);
            app.setScannerVisible(false);
        });
    
    }
    objectQuagga.initQuagga = initLector;
});
