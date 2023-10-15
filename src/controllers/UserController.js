class UserController {
    create(request, response) {
        const { name, email, password } = request.body

        response.status(201).json(  { name })
    } 
}


module.exports = UserController