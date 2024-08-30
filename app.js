/////// app.js

const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require('path')
const LocalStrategy = require('passport-local').Strategy;


require('dotenv').config()

const pool = new Pool({
  host: "localhost", // or wherever the db is hosted
  user: process.env.DB_USER,
  database: "username_auth",
  password: process.env.DB_PASSWORD,
  port: 5432 // 
});

const app = express();

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => res.render("index"));

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", async (req, res, next) => {
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      req.body.password,
    ]);
    res.redirect("/");
  } catch(err) {
    return next(err);
  }
});

app.listen(3000, () => console.log("app listening on port 3000!"));
