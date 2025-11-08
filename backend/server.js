const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db.js")

dotenv.config()

const app = express()

// middlewares
app.use(cors())
app.use(express.json())


// connect DB
connectDB();

app.use("/api/products", require("./routes/productRoutes.js"))
app.use("/api/cart", require("./routes/cartRoutes.js"))
app.use("/api/checkout", require("./routes/checkoutRoutes.js"))


app.listen(process.env.PORT, ()=>{
    console.log("server started");
    
})