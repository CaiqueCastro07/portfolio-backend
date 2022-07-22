import mongoose from "mongoose"

const tasksEntity = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    tasks: {
        type: [{
            task: String,
            done: Boolean,
            priority: Number
        }],
        default: [],
        required: false
    },
})

const tasksRepository = mongoose.model('tasks', tasksEntity)

export {
    tasksRepository
}




