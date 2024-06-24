const Products = require('./models/products.model')
const User = require('./models/user.model')
const transporter = require('./nodemailer')

class ProductsDao {

    // async getAllProducts() {
    //     try {
    //       const products = await Products.find({})
    //       return products
    //     } catch (error) {
    //       console.error('Error obteniendo todos los productos:', error)
    //       throw new Error('Error interno del servidor')
    //     }
    //   }
    
    //   async getProductById(id) {
    //     try {
    //       const product = await Products.findById(id)
    //       return product
    //     } catch (error) {
    //       console.error(`Error obteniendo el producto con ID ${id}:`, error)
    //       throw new Error('Error interno del servidor')
    //     }
    //   }
    
    //   async addProduct(title, description, price, thumbnail, code, stock, ownerId = 'admin') {
    //     try {
    //       const product = new Product({
    //         title,
    //         description,
    //         price,
    //         thumbnail,
    //         code,
    //         stock,
    //         owner: ownerId,
    //       })
    //       await product.save()
    //       return product
    //     } catch (error) {
    //       console.error('Error creando el producto:', error)
    //       throw new Error('Error interno del servidor')
    //     }
    //   }
    
    //   async updateProduct(id, updateFields) {
    //     try {
    //       const updatedProduct = await Products.findByIdAndUpdate(id, updateFields, { new: true })
    //       if (!updatedProduct) {
    //         throw new Error('Producto no encontrado')
    //       }
    //       return updatedProduct
    //     } catch (error) {
    //       console.error(`Error actualizando el producto con ID ${id}:`, error)
    //       throw new Error('Error interno del servidor')
    //     }
    //   }
    
    //   async deleteProduct(id) {
    //     try {
    //       const deletedProduct = await Products.findByIdAndDelete(id)
    //       if (!deletedProduct) {
    //         throw new Error('Producto no encontrado')
    //       }
    //       return deletedProduct
    //     } catch (error) {
    //       console.error(`Error eliminando el producto con ID ${id}:`, error)
    //       throw new Error('Error interno del servidor')
    //     }
    //   }

    static async getAllProducts() {
        return Products.find()
    }
    static async postProduct(title, description, price, thumbnail, code, stock) {
        return new Products({ title, description, price, thumbnail, code, stock }).save()
    }
    static async updtProduct(id, data) {
        return Products.findOneAndUpdate({ _id: id }, data)
    }
    static async delProduct(id) {
        return Products.findByIdAndDelete(id)
    }
}

const deleteProduct = async (req, res) => {
    const { productId } = req.params
    try {
        const product = await Products.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        const ownerEmail = product.owner

        await Products.findByIdAndDelete(productId)

        if (ownerEmail && ownerEmail !== 'admin') {
            const owner = await User.findOne({ email: ownerEmail })
            if (owner && owner.role === 'premium') {
                
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: ownerEmail,
                    subject: 'Producto eliminado',
                    text: `Hola ${owner.first_name}, tu producto "${product.title}" ha sido eliminado.`,
                })
            }
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
        console.error('Error eliminando producto:', error)
        res.status(500).json({ message: 'Error interno del servidor', error })
    }
};

module.exports = { ProductsDao, deleteProduct}
