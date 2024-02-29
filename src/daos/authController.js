const User = require('../daos/models/usermodel')

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, age, password } = req.body
        const newUser = new User({ firstName, lastName, email, age, password })
        await newUser.save()
        res.redirect('/login')
    } catch (error) {
        console.error(error)
        res.status(500).send('Error registering user')
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email, password })
        if (user) {
            req.session.user = user
            res.redirect('/profile')
        } else {
            res.render('login', { error: 'Invalid email or password' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error logging in')
    }
};

exports.profile = (req, res) => {
    res.render('profile', { user: req.session.user })
};