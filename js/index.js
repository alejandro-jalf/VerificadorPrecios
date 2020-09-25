var objectQuagga = {initQuagga: (any) => {console.log("init "+any);}};
var app = new Vue({
    el: "#app",
    data: {
        scannerVisible: false,
        name: "Nombre del producto",
        precio: "00.00",
        description: "Descripcion del producto",
        codigoActual: "34543543534543",
        imageCode: false,
        urlApi: "http://..........",
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
        products: [
            {Articulo: "0127166", CodigoBarras: "7501026001150", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 18.99},
            {Articulo: "0127167", CodigoBarras: "7501026001151", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 19.99},
            {Articulo: "0127168", CodigoBarras: "7501026001152", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 10.99},
            {Articulo: "0127169", CodigoBarras: "7501026001153", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 11.99},
            {Articulo: "0127160", CodigoBarras: "7501026001154", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 12.99},
            {Articulo: "0127161", CodigoBarras: "7501026001155", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 13.99},
            {Articulo: "0127162", CodigoBarras: "7501026001156", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 14.99},
            {Articulo: "0127163", CodigoBarras: "7501026001157", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 15.99},
            {Articulo: "0127164", CodigoBarras: "7501026001158", Nombre: "Sha. Fructis Oil Repair3 Cab Seco 650ml", Descripcion: "Jab. Tepeyac Lila 200gr", Precio1IVAUV: 16.99}
        ],
        cardSeleccionado: "",
        textCardSelected: "",
        alertVisible: false
    },
    mounted: function() {
        $("#ConexionTo").html(`Conexion a ${this.relationNamesSuc[this.sucursalConnected]}`);
        $("#abrirReg").hide();
    },
    methods: {
        searchProduct: function() {
            this.startLoading(500);
            const product = $("#search").val();
            console.log(product);
            const instancia = this;
            axios({
                url: "",
                method: "POST",
                data: {
                    sucursal: sucursal
                }
            }).then(function(response) {
                instancia.products = response.data.data;
                instancia.stopLoading(500);
            }).catch(function(error) {
                console.log(error);
                instancia.products = [];
                instancia.stopLoading(500);
                instancia.alertVisible = true;
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
            this.precio = product[0].Precio1IVAUV;
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
            console.log("Codigo: "+codigo);
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
                    instancia.precio = respons.Precio1IVAUV;
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
