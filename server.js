import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT || 3333;
const host = process.env.HOST || "127.0.0.1";

app.use(express.json());

const books = [
  /*{
  id: число (автоинкремент),
  title: строка,
  author: строка,
  year: число (год издания),
  genre: строка,
  isAvailable: boolean (доступна ли книга)
}*/
];

app.get("/books", (req, res) => {
  let result = [...books];

  const { genre, author, available, limit, offset } = req.query;

  if (genre) {
    result = filterByField(result,"genre", genre);
  }
  if (author) {
    result = filterByField(result, "author", author);
  }
  if (available) {
    const isAvailable = available === "true";

   result = result.filter((book) => {
       return book.isAvailable === isAvailable;
    })
  }

  const start = Number(offset) || 0;
  const end = limit ? start + Number(limit) : undefined;

  res.json(result.slice(start, end));//передаем клиенту
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

function filterByField(arr, key, value) {
 return arr.filter((item) => item[key] === value);
}
