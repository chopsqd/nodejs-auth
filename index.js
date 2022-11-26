import express from 'express'
import mongoose from 'mongoose'
import {DB_URL} from './keys.js'
import authRouter from './routes/authRouter.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}...`))
    } catch(e) {
        console.log(e)
    }
}

start()