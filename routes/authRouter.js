import Router from 'express'
import authController from '../controllers/authController.js'
import {check} from 'express-validator'
const router = new Router()
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'

router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть от 4 до 10 символов").isLength({min: 4, max: 10}),
], authController.registration)
router.post('/login', authController.login)
router.post('/role', authController.role)
router.get('/users', roleMiddleware(['ADMIN']), authController.getUsers)

module.exports = router
