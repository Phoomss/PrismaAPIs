const prisma = require('../DB/db.config');

const error500 = (res, error) => {
    console.error('Error:', error);
    return res.status(500).json({
        status: 500,
        msg: 'Internal Server Error'
    });
};

const createComment = async (req, res) => {
    try {
        const { user_id, post_id, comment } = req.body;

        // ตรวจสอบว่าโพสต์ที่มี post_id นั้นมีอยู่หรือไม่
        const postExists = await prisma.post.findUnique({
            where: {
                id: Number(post_id)
            }
        });

        if (!postExists) {
            return res.status(404).json({
                status: 404,
                msg: "Post not found."
            });
        }

        // อัปเดต comment_count ของโพสต์
        await prisma.post.update({
            where: {
                id: Number(post_id)
            },
            data: {
                comment_count: {
                    increment: 1
                }
            }
        });

        // สร้างคอมเมนต์ใหม่
        const newComment = await prisma.comment.create({
            data: {
                user_id: Number(user_id),
                post_id: Number(post_id),
                comment: comment
            }
        });

        return res.json({
            status: 201,
            msg: "Created Comment successfully.",
            data: newComment
        });
    } catch (error) {
        error500(res, error);
    }
};

const getAllComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            include: {
                user: true,
                post: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return res.json({
            status: 200,
            msg: "Get all Comments.",
            data: comments
        });
    } catch (error) {
        error500(res, error);
    }
};

const getCommentById = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        });

        if (!comment) {
            return res.status(404).json({
                status: 404,
                msg: "Comment not found."
            });
        }

        return res.json({
            status: 200,
            msg: "Get Comment by ID.",
            data: comment
        });
    } catch (error) {
        error500(res, error);
    }
};

const updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { comment } = req.body;

        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                comment: comment
            }
        });

        return res.json({
            status: 200,
            msg: "Updated Comment.",
            data: updatedComment,
        });
    } catch (error) {
        error500(res, error);
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;

        await prisma.comment.delete({
            where: {
                id: commentId
            }
        });

        return res.json({
            status: 200,
            msg: "Deleted Comment."
        });
    } catch (error) {
        error500(res, error);
    }
};

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment
};
