import express from "express";
import compression from "compression";  // compresses requests
import lusca from "lusca";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI } from "./util/secrets";
import logger from "./util/logger";
import getTasks from "./controllers/getTasks"
import updateTask from "./controllers/updateTask"
import createTask from "./controllers/createTask"
import deleteTask from "./controllers/deleteTask"
import cors from "cors"
// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    logger.error(`MongoDB connection error:cv${err}`)
});

app.use(cors());
app.set("port", process.env.PORT || 3001);

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use(compression());
app.use(lusca.xssProtection(true));

/*
app.use((req, res, next) => {
    //@ts-ignore
    const { authorization }: string = req?.headers || {};
    const apikey = authorization?.replace("Bearer ", "");
    if (apikey != process?.env?.APIKEY) return res.status(401).json({ status: 401, message: "Not authorized." });
    next();
});
*/

app.get("/", (_, res) => {
    return res.status(200).json({ status: 200, online: true, integration: "Portfolio Pessoal", time: Date.now() });
});

app.get('/tasks', getTasks)
app.put('/task/:id', updateTask)
app.post('/task', createTask)
app.delete('/task/:id', deleteTask)
export default app;
