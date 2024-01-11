const fs = require('fs')

class ProductManager {
    #products = []
    #users = []
    #id = 0

    addProduct(title, description, price, thumbnail, code, stock) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Debe introducir todos los atributos para ingresar un producto!")
            return
        }

        const validarCode = this.#products.some(product => product.code === code)

        if (validarCode) {
            console.log("El codigo de producto ya existe")
            return
        }

        let product = {
            id: this.#id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }
        this.#id = this.#id + 1
        this.#products.push(product)

        let stringProducts = JSON.stringify(this.#products)
        const ingresarProducts = async () => {
            await fs.promises.writeFile('./Products.json', stringProducts)
        }
        ingresarProducts()
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

    getProductLimit(limit){
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
        fs.promises.readFile('./Products.js', 'utf-8')
            .then(data => {
                const products = JSON.parse(data)
                const findProduct = products.findIndex(product => product.id === id)

                if (!findProduct) {
                    console.log("Not Found")
                    return
                }
                Object.assign(products[findProduct], updtField)
                const updatedProducts = JSON.stringify(products)
                return fs.promises.writeFile('./Products.js', updatedProducts)
            })
            .then(() => console.log("El producto fue actualizado"))
            .catch(error => console.error("No se pudo actualizar el producto", error))
    }
    deleteProduct(id) {
        fs.promises.readFile('./Products.js', 'utf-8')
            .then(data => {
                const products = JSON.parse(data)
                const findProduct = products.findIndex(product => product.id === id)

                if (!findProduct) {
                    console.log("Not Found")
                    return
                }
                products.splice(findProduct,1)
                const deletedProducts = JSON.stringify(products)
                
                return fs.promises.writeFile('./Products.js', deletedProducts)
            })
            .then(() => console.log("El producto fue eliminado"))
            .catch(error => console.error("No se pudo eliminar el producto", error))
    }
    crearUsuario(nombre, apellido, edad, curso) {

        if (!nombre || !apellido || !edad || !curso) {
            console.log("Debe introducir todos los atributos para ingresar un usuario!")
            return
        }

        let user = {
            nombre: nombre,
            apellido: apellido,
            edad: edad,
            curso: curso
        }
        this.#users.push(user)

        let stringUsers = JSON.stringify(this.#users)
        const ingresarUsuario = async () => {
            await fs.promises.writeFile('./Usuarios.js', stringUsers)
        }
        ingresarUsuario()
    }
    consultarUsers() {
        const leeUsuarios = async () => {
            let respUsers = await fs.promises.readFile('./Usuarios.js', 'utf-8')
            console.log(JSON.parse(respUsers))
        }
        leeUsuarios()
    }


}

const producto = new ProductManager()

//INSERTAR NUEVO PRODUCTO
// producto.addProduct("Pokeball", "Objeto de captura pokemon", 10, "pokeball.jpg","POKE00001", 20)
// producto.addProduct("Pocion", "Objeto para curar pokemon", 15, "pocion.jpg", "POKE00002", 20)
// producto.addProduct("MT1", "Movimiento pokemon", 100, "mt1.jpg", "POKE00003", 5)
// producto.addProduct("MT2", "Movimiento pokemon", 100, "mt2.jpg", "POKE00004", 5)

//EDITAR PRODUCTO
// producto.updateProduct(2, { title: "MT2", thumbnail: "mt2.jpg" })

//CONSULTAR PRODUCTOS
// const productos = producto.getProducts()
// console.log(productos)

//CONSULTA POR ID
// const productById = producto.getProductById(2)
// console.log(productById)

//ELIMINAR PRODUCTO//////
// const delProduct = producto.deleteProduct(1)
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