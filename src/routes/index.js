import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";

export const routes = (app, apiKey) => {
    app.use(`${apiKey}/auth`, authRoute)
    app.use(`${apiKey}/user`, userRoute)
}

// http://localhost:5006/AuthenticationService/api/v1/auth
// http://localhost:5006/AuthenticationService/api/v1/user
