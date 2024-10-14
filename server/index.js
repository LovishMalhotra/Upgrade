const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// const authRoutes = require("./components/User")
// const skillRoutes = require("./components/Skill")
const userRoutes = require("./controller/User")
const trainingRoutes = require("./controller/Training")

const app = express();

dotenv.config();


app.use(bodyParser.json());
app.use(cors());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/users', userRoutes);
app.use('/training', trainingRoutes);

//Database connection
main().catch((err) => console.log(`Unable to connect ${err}`));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database Connected");
}
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
