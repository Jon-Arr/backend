const fs = require('fs')

class ProductManager {
    #products = []
    #id = 0
    // #thumbnail = []
    #status = true

    async addProduct(title, description, price, thumbnail, code, stock) {

        try {
            const data = await fs.promises.readFile('./Products.json', 'utf-8')
            this.#products = JSON.parse(data)
            const productoLeido = this.#products
            const maxId = Math.max(...productoLeido.map(productoLeido => productoLeido.id))
            if(maxId < 1){
                this.#id = 1
            }else{
                this.#id = maxId + 1
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error)
        }

        if (!title || !description || !price || !code || !stock) {
            console.log("Debe introducir todos los atributos para ingresar un producto:")
            // return
        }
        if (!title) {
            console.log("Falta titulo")
            return
        } if (!description) {
            console.log("Falta desciption")
            return
        }
        if (!price) {
            console.log("Falta price")
            return
        }
        if (!code) {
            console.log("Falta code")
            return
        }
        if (!stock) {
            console.log("Falta stock")
            return
        }

        const validarCode = this.#products.some(product => product.code === code)

        if (validarCode) {
            console.log("El codigo de producto ya existe")
            return
        }

        let product = {
            id: this.#id++,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            status: this.#status
        }
        this.#products.push(product)

        try {
            const stringProducts = JSON.stringify(this.#products);
            await fs.promises.writeFile('./Products.json', stringProducts)
            console.log("Producto añadido exitosamente")
        } catch (error) {
            console.error('Error al escribir el archivo de productos:', error)
        }
    }
    getProducts() {
        const leeProducts = async () => {
            let respProducts = await fs.promises.readFile('./Products.json', 'utf-8')
            let readProduct = (JSON.parse(respProducts))
            return readProduct
        }
        return leeProducts()
    }
    getProductById(id) {

        const leeUnProducts = async () => {
            let respProducts = await fs.promises.readFile('./Products.json', 'utf-8')
            const unProducto = JSON.parse(respProducts)
            const findProduct = unProducto.find(unProducto => unProducto.id == id)
            if (!findProduct) {
                console.log("Not Found")
            } else {
                return findProduct
            }
        }
        return leeUnProducts()
    }

    getProductLimit(limit) {
        const limitProducts = async () => {
            let respProducts = await fs.promises.readFile('./Products.json', 'utf-8')
            const limitProduct = JSON.parse(respProducts)
            const prodLimited = limitProduct.slice(0, limit)
            if (!prodLimited) {
                console.log("Not Found")
            } else {
                return prodLimited
            }
        }
        return limitProducts()
    }

    updateProduct(id, updtField) {
        fs.promises.readFile('./Products.json', 'utf-8')
            .then(data => {
                const products = JSON.parse(data)
                const findProduct = products.findIndex(product => product.id == id)

                if (!findProduct) {
                    console.log("Not Found")
                    return
                }
                Object.assign(products[findProduct], updtField)
                const updatedProducts = JSON.stringify(products)
                return fs.promises.writeFile('./Products.json', updatedProducts)
            })
            .then(() => console.log("El producto fue actualizado"))
            .catch(error => console.error("No se pudo actualizar el producto", error))
    }
    deleteProduct(id) {
        fs.promises.readFile('./Products.json', 'utf-8')
            .then(data => {
                const products = JSON.parse(data);
                const index = products.findIndex(product => product.id == id);

                if (index === -1) {
                    console.log("Producto no encontrado");
                    return;
                }

                products.splice(index, 1); // Elimina el producto del array

                const updatedProducts = JSON.stringify(products);

                return fs.promises.writeFile('./Products.json', updatedProducts);
            })
            .then(() => console.log("Producto eliminado exitosamente"))
            .catch(error => console.error("Error al eliminar producto:", error));
    }
}

const producto = new ProductManager()

//INSERTAR NUEVO PRODUCTO
// producto.addProduct("Pokeball", "Objeto de captura pokemon", 10, "pokeball.jpg","POKE00001", 20)
// producto.addProduct("Pocion", "Objeto para curar pokemon", 15, "pocion.jpg", "POKE00002", 20)
// producto.addProduct("MT1", "Movimiento pokemon", 100, "mt1.jpg", "POKE00003", 5)
// producto.addProduct("MT2", "Movimiento pokemon", 100, "mt2.jpg", "POKE00004", 5)

//EDITAR PRODUCTO
// producto.updateProduct(1, { title: "Pocion", thumbnail: "pocion.jpg" })

//CONSULTAR PRODUCTOS
// const productos = producto.getProducts()
// console.log(productos)

//CONSULTA POR ID
// const productById = producto.getProductById(2)
// console.log(productById)

//ELIMINAR PRODUCTO//////
// const delProduct = producto.deleteProduct(2)
// console.log(delProduct)

//LIMITAR PRODUCTOS
// const productLimit = producto.getProductLimit(2)
// console.log(productLimit)

//INSERTAR NUEVO USUARIO
// producto.crearUsuario("Eduardo", "Ortega", 21, "Backend")

//CONSULTA USUARIOS
// const productos = producto.consultarUsers()
// console.log(productos)

module.exports = producto