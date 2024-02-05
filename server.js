import mongoose from "mongoose";
import 'dotenv/config';
import { app } from "./app.js";

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.connect(DB_HOST)
    .then(() => {
        app.listen(PORT);
        console.log("Database connection successful");
    })
    .catch((err) => {
        console.log(err.message);
        process.exit(1);

    })