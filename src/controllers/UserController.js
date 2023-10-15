const AppError = require("../utils/App.error")


class UserController {



    create(request, response) {
        const { name, email, password } = request.body

        if(!name) {
            throw new AppError("o nome é obrigatorio");
        }    

        response.status(201).json(  { name })
    } 
}


module.exports = UserController