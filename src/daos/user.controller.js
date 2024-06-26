const User = require('./models/user.model')
const transporter = require('./nodemailer')
const dayjs = require('dayjs')

const changeUserRole = async (req, res) => {
    const userId = req.params.uid

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.role === 'user') {
            const requiredDocuments = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta']
            const hasAllDocuments = requiredDocuments.every(doc =>
                user.documents.some(userDoc => userDoc.name === doc)
            )

            if (!hasAllDocuments) {
                return res.status(400).json({ message: 'User has not completed uploading all required documents' })
            }

            user.role = 'premium'
        } else if (user.role === 'premium') {
            user.role = 'user'
        }

        await user.save()
        res.status(200).json({ message: 'User role updated successfully', role: user.role })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}

const addDocument = async (req, res) => {
    const { uid } = req.params
    const { name, reference } = req.body

    try {
        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        user.documents.push({ name, reference })
        await user.save();
        res.json({ message: 'Document added', documents: user.documents })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

const deleteDocument = async (req, res) => {
    const { uid, docId } = req.params

    try {
        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        user.documents.id(docId).remove()
        await user.save()
        res.json({ message: 'Document deleted', documents: user.documents })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

const getDocuments = async (req, res) => {
    const { uid } = req.params

    try {
        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({ documents: user.documents })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

const uploadDocuments = async (req, res) => {
    const userId = req.params.uid
    const files = req.files

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' })
    }

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const uploadedDocuments = files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));

        user.documents.push(...uploadedDocuments)
        await user.save()

        res.status(200).json({ message: 'Documents uploaded successfully', documents: user.documents })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'first_name last_name email role')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error })
    }
}

const deleteInactiveUsers = async (req, res) => {
    try {
        const twoDaysAgo = dayjs().subtract(2, 'days').toDate()
        const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } })

        for (const user of inactiveUsers) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: `Hola ${user.first_name}, tu cuenta ha sido eliminada por inactividad de más de 2 días.`
            })
            await User.deleteOne({ _id: user._id })
        }

        res.status(200).json({ message: 'Usuarios inactivos eliminados correctamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error })
    }
}

const deleteUser = async (req, res) => {
    const { uid } = req.params
    try {
        const user = await User.findByIdAndDelete(uid);
        if (user) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Cuenta eliminada',
                text: `Hola ${user.first_name}, tu cuenta ha sido eliminada.`
            })
            res.status(200).json({ message: 'Usuario eliminado correctamente' })
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error })
    }
}

const updateUserRole = async (req, res) => {
    const { uid } = req.params
    const { role } = req.body
    try {
        const user = await User.findById(uid)
        if (user) {
            user.role = role
            await user.save()
            res.status(200).json({ message: 'Rol de usuario actualizado correctamente' })
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error })
    }
}

module.exports = { changeUserRole, addDocument, deleteDocument, getDocuments, uploadDocuments, getAllUsers, deleteInactiveUsers, deleteUser, updateUserRole }