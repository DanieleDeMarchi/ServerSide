const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    ruolo: {
        type: String, 
        enum: ['cittadino', 'organizzazione', 'amministrativo', 'sindaco'], 
        required: true 
    }
})

/*rimuove password e token quando si restituisce l'oggetto user*/
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    return userObject
}


userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({ _id: user._id.toString(), exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.JWT_KEY)
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        return null
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return null
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
