import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import * as dotenv from 'dotenv';
import './db/db';
import * as auth from './middlewares/auth';
import router from './routes/router';
import { save,getAll,get,deleteItem ,update, deleteItemWinerieInventary} from "./controllers/winerie";
// import { save,getAll,get,deleteItem } from "./controllers/event";
// import { save,getAll,get,deleteItem } from "./controllers/item";

dotenv.config();
//APP
const app = express();

//CORS
const corsOptions = {
  origin: process.env.APP_ALLOWED_ORIGINS, //this needs to be changed on production
  optionsSuccessStatus: 200
};
app.use(cors());


app.use(logger(process.env.APP_LOG_LEVEL as string));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Check auth
app.use(auth.checkAuthToken);

// app.post("/e",save)
// app.get("/e",getAll)
// app.get("/e/:id",get)
// app.delete("/e/:id",deleteItem)

// app.post("/i",save)
// app.get("/i",getAll)
// app.get("/i/:id",get)
// app.delete("/i/:id",deleteItem)


app.post("/win",save)
app.get("/win",getAll)
app.get("/win/:id",get)
app.delete("/win/:id",deleteItem)
app.delete("/win/:idWinerie/:idItem",deleteItemWinerieInventary)
app.put("/win/:id",update)

// Routes 
app.use(router);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(req.url)
  res.status(404).send("404 NOT FOUND!!")
});

export default app;
