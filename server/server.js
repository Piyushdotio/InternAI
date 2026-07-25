import  "dotenv/config"
import app from "./src/app.js";
import connectDb from "./src/config/database.js";


const PORT = process.env.PORT || 5000;
connectDb();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})