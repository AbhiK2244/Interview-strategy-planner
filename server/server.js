import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connectToDB();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Interview AI API",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});