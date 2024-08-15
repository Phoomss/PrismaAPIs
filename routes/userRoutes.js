const userRoutes = require('express').Router()
const userController = require('../controllers/userController')

userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', userController.getUserById)

userRoutes.post("/", userController.createUser)

userRoutes.put('/:id', userController.updateUser)

userRoutes.delete('/:id', userController.deleteUser)

module.exports = userRoutes