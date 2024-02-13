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
    async addProductToCart(cartId, productId, quantity) {
        try {
            let data = await fs.promises.readFile('./Carts.json', 'utf-8')
            let carts = JSON.parse(data)
            const existingCartIndex = carts.find(cart => cart.id === cartId)

            if (!existingCartIndex) {
                console.log("Cart not found")
                return
            }
            const existingProduct = existingCartIndex.product.find(product => product.id === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {

                let newProduct = {
                    id: productId,
                    quantity: quantity
                }
                existingCartIndex.product.push(newProduct)
            }
                await fs.promises.writeFile('./Carts.json', JSON.stringify(carts))

                console.log("Product added to cart")
        } catch (error) {
            console.error("Error adding product:", error)
        }
    }
}

const carrito = new CartManager()

// carrito.addCart()

// const cartById = carrito.getCartById(0)

// carrito.addProductToCart(0, 1, 1)

module.exports = carrito