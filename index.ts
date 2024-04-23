import express ,{Express,Request,Response} from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser';
import multer from "multer"

import methodOverride from "method-override";

import * as database from "./config/database";
import {systemConfig} from "./config/system";
import ClientRoute from "./routes/client/index.route";
import AdminRoute from "./routes/admin/index.route";

database.connect();

const app:Express = express();
const port:string | number = process.env.PORT || 3000

app.set("views", `${__dirname}/views`)
app.set('view engine', 'pug')


app.use(express.static(`${__dirname}/public`));
app.use(cookieParser("T~Smilling"));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(methodOverride('_method'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Route
ClientRoute(app);
AdminRoute(app);
//End Route

app.get("*",(req,res) => {
  res.render("client/pages/errors/404",{
    pageTitle:"404 Not Fount",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})