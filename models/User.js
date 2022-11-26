import {Schema, model} from 'mongoose'

const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [
        // ref - Ссылка на другую сущность в БД
        { type: String, ref: 'Role'}
    ]
})

module.exports = model('User', User)