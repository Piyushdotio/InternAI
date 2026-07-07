import app from "./src/app.js";
import connectDb from "./src/config/database.js";
import dotenv from "dotenv"


dotenv.config()
const PORT = process.env.PORT || 5000;
connectDb();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})