const fs = require('fs')

class CartManager {
    #carts = []
    #id = 0
    #product = []

    addCart() {

        let cart = {
            id: this.#id,
            product: this.#product
        }
        this.#id = this.#id + 1        
        this.#carts.push(cart)

        let stringCarts = JSON.stringify(this.#carts)
        const insertCarts = async () => {
            await fs.promises.writeFile('./Carts.json', stringCarts)
        }
        insertCarts()
    }
    getCartById(id) {

        const readCart = async () => {
            let respCarts = await fs.promises.readFile('./Carts.json', 'utf-8')
            const unCarrito = JSON.parse(respCarts)
            const findCart = unCarrito.find(unCarrito => unCarrito.id == id)
            if (!findCart) {
                console.log("Not Found")
            } else {
                return findCart
            }
        }
        return readCart()
    }
    updateCart(id, product) {
        fs.promises.readFile('./Carts.json', 'utf-8')
            .then(data => {
                const carts = JSON.parse(data)
                const findCart = carts.findIndex(cart => cart.id == id)

                if (!findCart) {
                    console.log("Not Found")
                    return
                }
                Object.push(carts[findCart],product)
                const updatedcarts = JSON.stringify(carts)
                return fs.promises.writeFile('./Carts.json', updatedcarts)                
            })
            .then(() => console.log("El carrito fue actualizado"))
            .catch(error => console.error("No se pudo actualizar el carrito", error))
    }
}

const carrito = new CartManager()

// carrito.addCart({title:"pokepureba", desc:"esto es una prueba"})

// carrito.updateCart(0,{producto:2,quantity:1})

module.exports = carrito