const commentRoutes = require('express').Router()
const commentController = require('../controllers/commentController')

commentRoutes.get('/', commentController.getAllComments)
commentRoutes.get('/:id', commentController.getCommentById)

commentRoutes.post("/", commentController.createComment)

commentRoutes.put('/:id', commentController.updateComment)

commentRoutes.delete('/:id', commentController.deleteComment)

module.exports = commentRoutes