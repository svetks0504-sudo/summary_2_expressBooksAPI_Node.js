import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT || 3333;
const host = process.env.HOST || "127.0.0.1";

app.use(express.json());

let books = [
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
    result = filterByField(result, "genre", genre);
  }
  if (author) {
    result = filterByField(result, "author", author);
  }
  if (available) {
    const isAvailable = available === "true";

    result = result.filter((book) => {
      return book.isAvailable === isAvailable;
    });
  }

  const start = Number(offset) || 0;
  const end = limit ? start + Number(limit) : undefined;

  res.json(result.slice(start, end)); //передаем клиенту
});

app.get("/books/stats/genres", (req, res) => {
  const stats = books.reduce((acc, book) => {
    acc[book.genre] = acc[book.genre] ? acc[book.genre] + 1 : 1;
    return acc;
  }, {});
  res.json(stats);
});

app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const book = findId(books, id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
});

app.post("/books", (req, res) => {
  const { title, author, year, genre, isAvailable } = req.body;

  if (
    !title ||
    !author ||
    year === undefined ||
    !genre ||
    isAvailable === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (year < 1500 || year > 2025) {
    return res
      .status(400)
      .json({ message: "Year must be between 1500 and 2025" });
  }
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    year,
    genre,
    isAvailable,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const { title, author, year, genre, isAvailable } = req.body;
  const id = Number(req.params.id);

  const book = findId(books, id);
  if (!book) {
    return res.status(404).json({ message: "id not found" });
  }
  book.title = title;
  book.author = author;
  book.year = year;
  book.genre = genre;
  book.isAvailable = isAvailable;

  res.json(book);
});

app.patch("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = findId(books, id);

  if (!book) {
    return res.status(404).json({ message: "id not found" });
  }

  const { title, author, year, genre, isAvailable } = req.body;

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (year !== undefined) book.year = year;
  if (genre !== undefined) book.genre = genre;
  if (isAvailable !== undefined) book.isAvailable = isAvailable;

  res.json(book);
});

app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const book = findId(books, id);
  if (!book) {
    return res.status(404).json({ message: "id not found" });
  }
  books = books.filter((book) => book.id !== id);
  res.json({ message: "deleted" });
});

app.post("/books/:id/borrow", (req, res) => {
  const id = Number(req.params.id);
  const book = findId(books, id);
  if (!book) {
    return res.status(404).json({ message: "id not found" });
  }
  book.isAvailable = false;
  res.json(book);
});

app.post("/books/:id/return", (req, res) => {
  const id = Number(req.params.id);
  const book = findId(books, id);
  if (!book) {
    return res.status(404).json({ message: "id not found" });
  }
  book.isAvailable = true;
  res.json(book);
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

function filterByField(arr, key, value) {
  return arr.filter((item) => item[key] === value);
}
function findId(books, id) {
  const book = books.find((book) => book.id === id);
  return book;
}
