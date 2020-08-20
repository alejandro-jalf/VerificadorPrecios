document.addEventListener("DOMContentLoaded", () => {
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
            sound.play();
            app.codigoActual = data.codeResult.code;
            app.setDatosActuales(data.codeResult.code);
            Quagga.stop();
            window.navigator.vibrate(200);
            app.setScannerVisible(false);
        });
    
    }
    objectQuagga.initQuagga = initLector;
});
