import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from 'express';
import errorHandler from "errorhandler";

const app = express();

dotenv.config({ path: ".env" });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler());
app.use((req, res, next) => {
  console.log('here');
  next();
});

/*
export let getApi = (req: Request, res: Response) => {
  res.render("api/index", {
    title: "API Examples"
  });
};
*/

// Env vars
app.set("port", process.env.PORT || 3000);

// Routes
app.get('/hello/:name', function(req, res){
  res.send('hello ' + req.params.name);
});

app.listen(app.get("port"));
