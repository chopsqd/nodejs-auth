import jwt from 'jsonwebtoken'
import {SECRET_KEY} from "../keys.js";

module.exports = (roles) => {
    return (req, res, next) => {
        if(req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]

            if(!token) {
                return res.status(403).json({
                    message: "Пользователь не авторизован"
                })
            }
            const {roles: userRoles} = jwt.verify(token, SECRET_KEY)
            let hasRole = false

            // Проверяем, содержит ли массив ролей пользователя хотя бы одну роль, которая разрешена для данной функции
            // Вкратце проверяем сходство переданной роли в = (roles) => {} с ролью пользователя взятой из token
            userRoles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true
                }
            })

            if(!hasRole) {
                return res.status(403).json({
                    message: "Нет доступа"
                })
            }
            next()
        } catch(err) {
            console.log(err)
            return res.status(403).json({
                message: "Пользователь не авторизован"
            })
        }
    }
}