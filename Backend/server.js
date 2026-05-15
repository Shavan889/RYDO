require("dotenv").config();
const port = process.env.PORT || 3000;
const connectDB = require("./db/db");
const app = require("./app");
const { initializeSocket } = require("./socket");

connectDB();

const server = app.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});

initializeSocket(server);
