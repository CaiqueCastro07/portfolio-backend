
import { tasksRepository } from './repositories';
import { Task } from "../models/models";
import logger from "../util/logger"

const getTasksInDatabase = async (user: string): Promise<Task[] | false> => {

  if (!user || typeof user != 'string') return false

  user = user?.trim()

  try {
    const dbResult = await tasksRepository.find({ user })
    //@ts-ignore
    return dbResult?.[0]?.tasks

  } catch (err) {
    logger.error(`##getTasksInDatabase(${user}) Erro ao recuperar tarefas do usuário - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const deleteTaskInDatabase = async (id: string, user: string): Promise<boolean> => {

  if (!id || typeof id != 'string') return false;
  if (!user || typeof user != 'string') return false

  id = id?.trim()
  user = user?.trim()

  try {

    const dbResult = await tasksRepository.findOneAndUpdate(
      { "user": user },
      //@ts-ignore
      { "$pull": { tasks: { _id: [id] } } },
      { new: true, useFindAndModify: false })

    return true

  } catch (err) {
    logger.error(`##deleteTaskInDatabase(${id}, ${user}) - Erro ao deletar tarefa - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }

}

const createTaskInDatabase = async (newTask: string, user: string): Promise<boolean> => {

  if (!newTask || typeof newTask != 'string') return false
  if (!user || typeof user != 'string') return false

  newTask = newTask?.trim()
  user = user?.trim()

  try {

    const dbResult = await tasksRepository.updateOne({ user }, { $push: { tasks: { task: newTask, priority: 0, done: false } } })

    if (!dbResult?.modifiedCount && !dbResult?.nModified && !dbResult?.ok) {
      //@ts-ignore
          console.log(dbResult)
      logger.error(`##createTaskInDatabase(${newTask}, ${user}) Erro ao criar tarefa - message: ${dbResult?.message || dbResult?.errmsg || dbResult?.error} - code/ok: ${dbResult?.code || dbResult?.ok}`)
      return false
    }

    return true

  } catch (err) {
    console.log(err)
    logger.error(`##createTaskInDatabase(${newTask}, ${user}) Erro ao criar tarefa - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const updateTaskInDatabase = async (id: string, user: string, change: string | boolean): Promise<boolean> => {

  if (!id || typeof id != 'string') return false;
  if (!user || typeof user != 'string') return false

  id = id?.trim()
  user = user?.trim()

  //@ts-ignore
  const toChange: { done: Boolean, task: string } = {}

  if (typeof change == 'string') toChange.task = change;
  if (typeof change === 'boolean') toChange.done = change;
  if (!change && typeof change !== 'boolean') return false

  try {

    const dbResult = await tasksRepository.updateOne(
      { "user": user, "tasks._id": id },
      { "$set": { [`tasks.$.${toChange?.task ? "task" : "done"}`]: change } })

    if (!dbResult?.modifiedCount && !dbResult?.nModified && !dbResult?.ok) {
      //@ts-ignore
      logger.error(`##updateTaskInDatabase(${id}, ${user}, ${change}) Erro ao atualizar tarefa - message: ${dbResult?.message || dbResult?.errmsg} - code: ${dbResult?.code}`)
      return false
    }

    return true

  } catch (err) {
    logger.error(`##updateTaskInDatabase(${id}, ${user}, ${change}) Erro ao atualizar tarefa - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const deleteAllTasksByStatusInDatabase = async (done: boolean, user: string): Promise<boolean> => {

  if (typeof done !== 'boolean') return false;
  if (!user || typeof user != 'string') return false

  user = user?.trim()
  //@ts-ignore
  try {

    const dbResult = await tasksRepository.findOneAndUpdate(
      { "user": user },
      //@ts-ignore
      { "$pull": { tasks: { done } } },
      { new: true, useFindAndModify: false })

    return true

  } catch (err) {
    logger.error(`##deleteAllTasksByStatusInDatabase(${done}, ${user}) Erro ao deletar tarefas - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const createUserInDatabase = async (user: string, email: string, password: string): Promise<string | { error: string }> => {

  if (!user || typeof user != 'string') return { error: "User is not a string." }
  if (!email || typeof email != 'string') return { error: "Email is not a string." }
  if (!password || typeof password != 'string') return { error: "Password is not a string." }

  user = user?.trim()
  user = user?.toLowerCase()
  email = email?.trim()
  email = email?.toLowerCase()
  password = password?.trim()

  try {

    const dbResult = await tasksRepository.create({
      user,
      password,
      email,
      tasks: []
    })
      //@ts-ignore
    if (!dbResult?.user) {
      //@ts-ignore
      logger.error(`##createUserInDatabase(${user}, ${email}, 'hidden') - Erro ao criar usuário - message: ${dbResult?.message || dbResult}`)
      return { error: "Internal error, try again later" }
    }
      //@ts-ignore
    return dbResult.user

  } catch (err) {
    logger.error(`##createUserInDatabase(${user}, ${email}, 'hidden') Erro ao criar usuário - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    if (err?.message?.includes("duplicate")) {
      return { error: "Email or username already exists." }
    }
    return { error: "Internal error, try again later" }

  }
}

const verifyUserCredentials = async (user: string, password: string): Promise<true | { error: string }> => {

  if (!user || typeof user != 'string') return { error: "User is not a string." }
  if (!password || typeof password != 'string') return { error: "Password is not a string." }

  user = user?.trim()
  user = user.toLowerCase()
  password = password?.trim()

  try {

    const dbResult = await tasksRepository.find({ user })

    const data = dbResult?.[0]

    if (!data) return { error: "User not found" };
      //@ts-ignore
    if (data?.password !== password) return { error: "Invalid password" }

    return true

  } catch (err) {
    logger.error(`##verifyUserCredentials(${user}, 'hidden') Erro ao verificar credenciais do usuário - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return { error: "Internal error, try again later" }
  }

}

export {
  getTasksInDatabase,
  updateTaskInDatabase,
  createTaskInDatabase,
  deleteTaskInDatabase,
  deleteAllTasksByStatusInDatabase,
  createUserInDatabase,
  verifyUserCredentials
}