const { hash, compare } = require('bcryptjs')
const AppError = require("../utils/App.error")

const sqliteConnection = require('../database/sqlite')

class UserController {



    async create(request, response) {
        const { name, email, password } = request.body

        const database = await sqliteConnection();
        const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExist) {
            throw new AppError("Este e-mail já está em uso.")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])

        return response.status(201).json()
    } 

    async update(request, response) {
        const { name, email, password, newPassword } = request.body
        const { id } = request.params
   
        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])
   
        if(!user) {
         throw new AppError("Usuário não encontrado")
        }

        if(!(await compare(password, user.password))) {
            throw new AppError("senha incorreta")
        }     
   
        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
   
        if(userWithUpdatedEmail) {
         throw new AppError("Este e-mail já está em uso.")
        }
   
        user.name = name
        user.email= email
        user.password = await hash(newPassword,8)
   
        await database.run(`
         UPDATE users SET
         name = ?,
         email = ?,
         password = ?,
         updated_at = ?
         WHERE id = ?`, 
         [user.name, user.email, user.password, new Date(), id]
       )

        return response.json()
    }
}


module.exports = UserController