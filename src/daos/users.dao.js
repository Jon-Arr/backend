const Users = require('./models/user.model')

class UsersDAO {

    async getUserByEmail(email) {
        try{
            return await Users.findOne({ email })
        }
        catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message)
        }
        
    }
    async getUserByCreds(email, password) {
        try{
            return await Users.findOne({ email, password })            
        }
        catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message)
        }        
    }
    async insert(firstName, lastName, age, email, password) {
        try{
            return await new Users({ firstName, lastName, age, email, password }).save()
        }
        catch (error) {
            throw new Error('Error al insertar nuevo usuario: ' + error.message)
        }          
    }
    
    async getAllUsers() {
        try {
            return await User.find({}, 'first_name last_name email role')
        } catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message)
        }
    }

    async getUserById(id) {
        try {
            return await User.findById(id)
        } catch (error) {
            throw new Error('Error al obtener el usuario: ' + error.message)
        }
    }

    async createUser(userData) {
        try {
            const user = new User(userData)
            return await user.save()
        } catch (error) {
            throw new Error('Error al crear el usuario: ' + error.message)
        }
    }

    async updateUser(id, userData) {
        try {
            return await User.findByIdAndUpdate(id, userData, { new: true })
        } catch (error) {
            throw new Error('Error al actualizar el usuario: ' + error.message)
        }
    }

    async deleteUser(id) {
        try {
            return await User.findByIdAndDelete(id)
        } catch (error) {
            throw new Error('Error al eliminar el usuario: ' + error.message)
        }
    }

    async changeUserRole(id, newRole) {
        try {
            const user = await this.getUserById(id)
            if (!user) {
                throw new Error('Usuario no encontrado')
            }
            user.role = newRole;
            return await user.save()
        } catch (error) {
            throw new Error('Error al cambiar el rol del usuario: ' + error.message)
        }
    }

    async updateUserDocuments(id, documents) {
        try {
            const user = await this.getUserById(id)
            if (!user) {
                throw new Error('Usuario no encontrado')
            }
            user.documents = documents;
            return await user.save()
        } catch (error) {
            throw new Error('Error al actualizar los documentos del usuario: ' + error.message)
        }
    }

    async updateLastConnection(id) {
        try {
            const user = await this.getUserById(id)
            if (!user) {
                throw new Error('Usuario no encontrado')
            }
            user.last_connection = new Date()
            return await user.save()
        } catch (error) {
            throw new Error('Error al actualizar la última conexión del usuario: ' + error.message)
        }
    }

    async deleteInactiveUsers(days) {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)

        try {
            const inactiveUsers = await User.find({ last_connection: { $lt: cutoffDate } })
            const inactiveUserIds = inactiveUsers.map(user => user._id)
            await User.deleteMany({ _id: { $in: inactiveUserIds } })

            return inactiveUserIds
        } catch (error) {
            throw new Error('Error al eliminar usuarios inactivos: ' + error.message)
        }
    }
}

// class UsersDao {
//     static async getUserByEmail(email) {
//         return await Users.findOne({ email })
//     }
//     static async getUserByCreds(email, password) {
//         return await Users.findOne({ email, password })
//     }
//     static async insert(firstName, lastName, age, email, password) {
//         return await new Users({ firstName, lastName, age, email, password }).save()
//     }
//     static async getUserById(id) {
//         return Users.findOne({ _id: id }, { firstName: 1, lastName: 1, age: 1, email: 1 }).lean()
//     }
// }

module.exports = new UsersDAO()