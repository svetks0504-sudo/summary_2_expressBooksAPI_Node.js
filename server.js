import express from "express";
import dotenv from "dotenv";


const app = express();
dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});