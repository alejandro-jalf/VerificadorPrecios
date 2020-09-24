var objectQuagga = {initQuagga: (any) => {console.log("init "+any);}};
var app = new Vue({
    el: "#app",
    data: {
        scannerVisible: false,
        name: "Nombre del producto",
        precio: "00.00",
        description: "Descripcion del producto",
        codigoActual: "34543543534543",
        productos: [
            {codigo: "3800065711135", name: "Pasta de dientes Colgate", precio: "19.90", descripcion: "Pasta dental triple accion"},
            {codigo: "9382298282288", name: "Cocacola", precio: "14.50", descripcion: "Refresco no retornable"}
        ],
        imageCode: false,
        urlApi: "https://.....",
        sucursalConnected: "ND",
        relationNamesSuc: {
            ZR: "Zaragoza",
            JL: "Jaltipan",
            OU: "Oluta",
            VC: "Victoria",
            BO: "Bodega",
            ND: "............."
        },
        password: "123456",
        textPass: "",
        sucursalSelected: 0
    },
    mounted: function() {
        $("#ConexionTo").html(`Conexion a ${this.relationNamesSuc[this.sucursalConnected]}`);
    },
    methods: {
        getSiglasById: function(id){
            if (id == 1) return "VC";
            if (id == 2) return "ZR";
            if (id == 3) return "OU";
            if (id == 4) return "BO";
            if (id == 5) return "JL";
        },
        verifyPassword: function (){
            if (this.sucursalSelected === 0) {
                alert("No selecciono una sucursal");
                return;
            }
            if(this.textPass !== this.password) {
                alert("Clave incorrecta");
                return;
            }
            const suc = this.getSiglasById(this.sucursalSelected);
            this.setConnection(suc);
        },
        setConnection: function(value) {
            this.sucursalConnected = value;
            $("#ConexionTo").html(`Conexion a ${this.relationNamesSuc[this.sucursalConnected]}`);
        },
        activateScanner: function() {
            this.scannerVisible = true;
            objectQuagga.initQuagga();
        },
        stopScanner: function() {
            Quagga.stop();
            this.scannerVisible = false;
        },
        setDatosActuales: function(codigo) {
            this.startLoading(500);
            const instancia = this;
            this.codigoActual = codigo;

            const uriComplete = `${this.urlApi}${codigo}/precios`;

            axios({
                method: 'get',
                url: uriComplete,
                data: {
                    sucursal: ''
                }
            })
            .then(function (response) {
                const respons = response.data.data;
                if (respons.length === 0) {
                    instancia.name = "Producto no encontrado";
                    instancia.precio = "00.00";
                    instancia.description = "Intente de nuevo";
                } else {
                    instancia.name = respons.nombre;
                    instancia.precio = respons.Precio1IVAUV;
                    instancia.description = respons.descripcion;
                }
                app.imageCode = true;
                instancia.stopLoading(500);
            })
            .catch(function (error) {
                instancia.name = "Fallo en la conexion";
                instancia.precio = "00.00";
                instancia.description = "Intente de nuevo";
                instancia.stopLoading(500);
                console.log('Error: ' + error);
            });
        },
        setScannerVisible: function(visible) {
            this.scannerVisible = visible;
        },
        startLoading: function(value) {
            $(".background").show(value);
        },
        stopLoading: function(value) {
            $(".background").hide(value);
        }
    }
});
