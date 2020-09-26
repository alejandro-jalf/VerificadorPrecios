var objectQuagga = {initQuagga: (any) => {console.log("init "+any);}};
var app = new Vue({
    el: "#app",
    data: {
        scannerVisible: false,
        name: "Nombre del producto",
        precio: "00.00",
        description: "Descripcion del producto",
        codigoActual: "----------------",
        imageCode: false,
        urlApi: "http://........",
        sucursalConnected: localStorage.getItem("sucursalConnected") || "ND",
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
        sucursalSelected: 0,
        products: [],
        cardSeleccionado: "",
        textCardSelected: "",
        alertVisible: false,
        mssgAlert: "No se encontro ningun articulo"
    },
    mounted: function() {
        $("#ConexionTo").html(`Conexion a ${this.relationNamesSuc[this.sucursalConnected]}`);
        $("#abrirReg").hide();
    },
    methods: {
        setResponse: function(products, success = true) {
            $("#abrirReg").click();
            if (success === false) {
                this.mssgAlert = "Fallo la conexion con base de datos";
                this.alertVisible = true;
                return;
            }
            if (products.length === 0) {
                this.mssgAlert = "No se encontro ningun articulo";
                this.alertVisible = true;
            } else {
                this.alertVisible = false;
            }
        },
        searchProduct: function() {
            this.startLoading(500);
            const product = $("#search").val();
            const urlCompleted = `${this.urlApi}${product}`
            const sucursal = this.sucursalConnected;
            this.products = [];
            const instancia = this;
            axios({
                url: urlCompleted,
                method: "POST",
                data: {
                    sucursal: sucursal
                }
            }).then(function(response) {
                if (response.data.data === null) {
                    instancia.setResponse(instancia.products, false);
                    return;
                }
                instancia.products = response.data.data;
                instancia.setResponse(instancia.products);
                app.imageCode = true;
                instancia.stopLoading(500);
            }).catch(function(error) {
                console.log(error);
                instancia.setResponse(instancia.products, false);
                instancia.stopLoading(500);
            });
            $("#abrirReg").show();
        },
        loadProduct: function(articulo) {
            const product = this.products.filter((element) => element.Articulo == articulo);
            if (product.length === 0) {
                alert("Ocurrio un error, haga una nueva busqueda")
                return;
            }
            this.name = product[0].Nombre;
            this.description = product[0].Descripcion;
            this.codigoActual = product[0].CodigoBarras;
            this.precio = product[0].Precio;
        },
        selectCard: function(articulo, name) {
            this.cardSeleccionado = articulo;
            this.textCardSelected = name;
        },
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
            localStorage.setItem("sucursalConnected", value);
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
            const sucursal = this.sucursalConnected;
            axios({
                url: uriComplete,
                method: "POST",
                data: {
                    sucursal: sucursal
                }
            })
            .then(function (response) {
                const respons = response.data.data[0];
                if (response.data.data.length === 0) {
                    instancia.name = "Producto no encontrado";
                    instancia.precio = "00.00";
                    instancia.description = "Intente de nuevo";
                } else {
                    instancia.name = respons.Nombre;
                    instancia.precio = respons.Precio;
                    instancia.description = respons.Descripcion;
                }
                app.imageCode = true;
                instancia.stopLoading(500);
            })
            .catch(function (error) {
                instancia.name = "Fallo en la conexion";
                instancia.precio = "00.00";
                instancia.description = "Intente de nuevo";
                instancia.stopLoading(500);
                console.log(error);
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
