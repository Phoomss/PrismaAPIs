const prisma = require('../DB/db.config');

const error500 = (res, error) => {
    console.error('Error:', error);
    return res.status(500).json({
        status: 500,
        msg: 'Internal Server Error'
    });
};

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const findUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (findUser) {
            return res.json({
                status: 400,
                msg: "Email already taken. Please use another email."
            });
        }

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        });

        return res.json({
            status: 201,
            msg: "Created user successfully.",
            data: newUser
        });
    } catch (error) {
        error500(res, error);  // Corrected here
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                post: {
                    select: {
                        title: true,
                        description: true,
                        comment_count: true
                    }
                }
            }
        });

        return res.json({
            status: 200,
            msg: "Get all users.",
            data: users
        });
    } catch (error) {
        error500(res, error);  // Corrected here
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });

        if (!user) {
            return res.status(404).json({
                status: 404,
                msg: "User not found."
            });
        }

        return res.json({
            status: 200,
            msg: "Get user by ID.",
            data: user
        });
    } catch (error) {
        error500(res, error);
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body;

        const update = await prisma.user.update({
            where: {
                id: Number(userId)
            },
            data: {
                name,
                email,
                password
            }
        });

        return res.json({
            status: 200,
            msg: "Updated user.",
            data: update,
        });
    } catch (error) {
        error500(res, error);  // Use error500 here as well for consistency
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id

        await prisma.user.delete({
            where: {
                id: Number(userId)
            }
        })

        return res.json({
            status: 200,
            msg: "Deleted user."
        })
    } catch (error) {
        error500(res, error)
    }
}
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
