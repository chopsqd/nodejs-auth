import User from '../models/User.js'
import Role from '../models/Role.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {validationResult} from 'express-validator'
import {SECRET_KEY} from '../keys.js'

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, SECRET_KEY, {expiresIn: "24h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка при регистрации", errors
                })
            }

            const {username, password} = req.body
            // Поиск пользователя по username
            const candidate = await User.findOne({username})

            // Проверка на существование такого пользователя
            // Если уже есть - ошибка. Так как username должен быть уникальным
            if(candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует!"
                })
            }

            // .hashSync(пароль, степень хеширования)
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})

            await user.save()
            return res.json({
                message: "Пользователь успешно зарегестрирован!"
            })
        } catch(err) {
            console.log(err)
            res.status(500).json({
                message: 'Registration error'
            })
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})

            if(!user) {
                return res.status(400).json({
                    message: `Пользователь ${username} не найден`
                })
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if(!validPassword) {
                return res.status(400).json({
                    message: `Введен неверный пароль`
                })
            }

            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch(err) {
            console.log(err)
            res.status(500).json({
                message: 'Login error'
            })
        }
    }

    async role(req, res) {
        try {
            const user = new Role({value: req.body.value})
            await user.save()

            res.json('Role added successfully!')
        } catch(err) {
            res.status(500).json(err)
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch(err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new authController()