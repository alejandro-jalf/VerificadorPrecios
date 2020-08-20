var objectQuagga = {initQuagga: (any) => {console.log("init "+any);}};
var app = new Vue({
    el: "#app",
    data: {
        scannerVisible: false,
        name: "Nombre del producto",
        precio: "00.00",
        description: "Descripcion del preoducto",
        codigoActual: "34543543534543",
        productos: [
            {codigo: "3800065711135", name: "Pasta de dientes Colgate", precio: "19.90", descripcion: "Pasta dental triple accion"},
            {codigo: "9382298282288", name: "Cocacola", precio: "14.50", descripcion: "Refresco no retornable"}
        ],
        imageCode: false
    },
    methods: {
        activateScanner: function() {
            this.scannerVisible = true;
            objectQuagga.initQuagga();
        },
        stopScanner: function() {
            Quagga.stop();
            this.scannerVisible = false;
        },
        setDatosActuales: function(codigo) {
            this.codigoActual = codigo;
            const productFind = this.productos.filter((producto) => producto.codigo == codigo);
            if (productFind.length === 0) {
                this.name = "Producto no encontrado";
                this.precio = "00.00";
                this.description = "Intente de nuevo";
            } else {
                this.name = productFind[0].name;
                this.precio = productFind[0].precio;
                this.description = productFind[0].descripcion;
            }
            app.imageCode = true;
        },
        setScannerVisible: function(visible) {
            this.scannerVisible = visible;
        }
    }
});
