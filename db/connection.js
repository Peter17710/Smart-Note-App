import mongoose from "mongoose"

const connection = mongoose.connect("mongodb://localhost:27017/SmartNoteApp")
    .then(() => {
        console.log("Successfully connected to DB");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });

export default connection;