const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0
    },
    profilePic:{
        type:String,
        default:null
    },
    Status:{
        type:String,
        default:"active"
    },
    createdBy:{
        type:String,
    },
    phone:{
        type:Number,
        default:null 
    }
}, {
    timestamps: true,
  })

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRATEKEY)
    this.token = token
    await this.save();
    return token
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = new mongoose.model("User", userSchema)
module.exports = User


