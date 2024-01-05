const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes.js");
const database = require("./config/database.js");
const { auth } = require("./middlewares/auth.js");
const initializePassport = require("./passport-config");
const router = express.Router();

// configurations
dotenv.config();
const port = process.env.PORT || 4000;
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.Router());
initializePassport(passport);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Auth routes
app.use("/api/auth", authRoutes);

// notes routes
app.use("/api", notesRoutes);

// default route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "sever running",
  });
});

database();

app.listen(port, () => console.log(`server started ${port}`));

