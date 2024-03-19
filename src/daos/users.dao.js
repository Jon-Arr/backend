const Users = require('./models/usermodel')

class UsersDao{
    static async getUserByEmail(email){
        return await Users.findOne({email})
    }
    static async getUserByCreds(email, password){
        return await Users.findOne({email, password})
    }
    static async insert(firstName, lastName, age, email, password){
        return await new Users({firstName, lastName, age, email, password}).save()
    }
    static async getUserById(id){
        return Users.findOne({_id:id},{firstName:1, lastName:1, age:1, email:1}).lean()
    }
}

module.exports = UsersDao