const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./models/user.model')

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
}

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
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
  
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
  
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
  
      user.last_connection = new Date()
      await user.save()
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
      res.cookie('token', token, { httpOnly: true })
  
      res.json({ message: 'Login successful', token })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
  
  const logoutUser = async (req, res) => {
    try {
      const token = req.cookies.token
      if (!token) {
        return res.status(401).json({ message: 'No token provided' })
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' })
      }
  
      user.last_connection = new Date()
      await user.save()
  
      res.clearCookie('token')
      res.json({ message: 'Logout successful' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }


exports.profile = (req, res) => {
    res.render('profile', { user: req.session.user })
}

module.exports = {loginUser, logoutUser}