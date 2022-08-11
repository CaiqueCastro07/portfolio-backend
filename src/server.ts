import errorHandler from "errorhandler";
import app from "./app";
import logger from "./util/logger";

if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}

const server = app.listen(app.get("port"), () => {
    logger.info(`App is running at port ${app.get("port")} in ${app.get("env")} mode.`)  
});
export default server;
