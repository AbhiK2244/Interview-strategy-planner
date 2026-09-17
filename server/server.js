require("dotenv").config();
const app = require("./src/app");
// const PORT = process.env.PORT || 3000;
const connectToDB = require("./src/config/database");

connectToDB();

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to the Interview AI API" });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port http://localhost:${PORT}`);
// });
