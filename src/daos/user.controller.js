const User = require('./models/usermodel')

const changeUserRole = async (req, res) => {
    const { uid } = req.params
    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        user.role = user.role === 'user' ? 'premium' : 'user'
        await user.save()
        res.json({ message: `User role updated to ${user.role}` })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
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

module.exports = { changeUserRole, addDocument, deleteDocument, getDocuments, uploadDocuments }