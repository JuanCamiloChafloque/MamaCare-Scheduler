const express = require("express");
const cors = require("cors");
const route = require("./routes/scheduler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Scheduler ready..." });
});
app.use("/", route);

app.listen(PORT, () => {
  console.log("Started server on port ", PORT);
});
