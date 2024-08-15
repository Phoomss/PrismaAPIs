const router = require('express').Router()
const userRoutes = require('./userRoutes')
const postRouters = require('./postRoutes')
const commentRoutes = require('./commentRoutes')

router.use("/api/user", userRoutes)
router.use("/api/post", postRouters)
router.use('/api/comment', commentRoutes)

module.exports = router