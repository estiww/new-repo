const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require('./cronJobs');

const app = express();

const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');
const refreshTokenRoute = require('./routes/refreshTokenRoute');
const travelRequestsRoute = require('./routes/travelRequestsRoute');
const forgotPasswordRoute = require('./routes/forgotPasswordRoute')
const resetPasswordRoute = require('./routes/resetPasswordRoute');
const logoutRoute = require("./routes/logoutRoute");
const travelMatchesRoute = require('./routes/travelMatchesRoute');

const logger = require('./middleware/logger');
const verifyJWT = require('./middleware/verifyJWT');
const verifyPermissions = require('./middleware/verifyPermissions'); 


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(logger);

// Routes that don't need JWT verification
app.use("/logout", logoutRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/refreshTokenRoute', refreshTokenRoute);
app.use('/forgotPassword', forgotPasswordRoute);
app.use('/resetPassword', resetPasswordRoute);

// Routes that need JWT verification
app.use(verifyJWT);
app.use("/travelRequests", travelRequestsRoute);
app.use('/travelMatches', travelMatchesRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
