const prisma = require('../DB/db.config');

const error500 = (res, error) => {
    console.error('Error:', error);
    return res.status(500).json({
        status: 500,
        msg: 'Internal Server Error'
    });
};

const createPost = async (req, res) => {
    try {
        const { user_id, title, description } = req.body;

        const newPost = await prisma.post.create({
            data: {
                user_id: Number(user_id),
                title: title,
                description: description
            }
        });

        return res.json({
            status: 201,
            msg: "Created Post successfully.",
            data: newPost
        });
    } catch (error) {
        error500(res, error);
    }
};

const getAllPosts = async (req, res) => {
    try {
        const Posts = await prisma.post.findMany({
            include: {
                Comment: {
                    select: {
                        comment: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            // orderBy: {
            //     id: "asc"
            // },
            // where: {
            //     title: {
            //         contains: "Thailand",  // ใช้ contains แทน startsWith
            //         mode: "insensitive"   // ใช้สำหรับค้นหาแบบไม่คำนึงถึงตัวพิมพ์ใหญ่/เล็ก
            //     }
            // }
        });

        return res.json({
            status: 200,
            msg: "Get all Posts.",
            data: Posts
        });
    } catch (error) {
        error500(res, error);
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = Number(req.params.id);

        if (isNaN(postId)) {
            return res.status(400).json({
                status: 400,
                msg: "Invalid post ID format."
            });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if (!post) {
            return res.status(404).json({
                status: 404,
                msg: "Post not found."
            });
        }

        console.log(post)
        return res.json({
            status: 200,
            msg: "Get Post by ID.",
            data: post
        });
    } catch (error) {
        error500(res, error);
    }
};

const searchPost = async (req, res) => {
    try {
        const query = req.query.q;

        const posts = await prisma.post.findMany({
            where: {
                description: {
                    contains: query,  // ใช้ contains สำหรับค้นหาในคำอธิบาย
                    mode: "insensitive"  // ใช้สำหรับค้นหาแบบไม่คำนึงถึงตัวพิมพ์ใหญ่/เล็ก
                }
            }
        });

        return res.json({
            status: 200,
            msg: "Search post.",
            data: posts
        });
    } catch (error) {
        error500(res, error);
    }
};

const updatePost = async (req, res) => {
    try {
        const postId = Number(req.params.id);
        const { title, description } = req.body;

        const update = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                title,
                description
            }
        });

        return res.json({
            status: 200,
            msg: "Updated Post.",
            data: update
        });
    } catch (error) {
        error500(res, error);
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = Number(req.params.id);

        await prisma.post.delete({
            where: {
                id: postId
            }
        });

        return res.json({
            status: 200,
            msg: "Deleted Post."
        });
    } catch (error) {
        error500(res, error);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    searchPost,
    updatePost,
    deletePost
};
