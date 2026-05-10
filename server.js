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

  const book = books.find((book) => book.id === id);

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

  const book = find.books((book) => book.id === id);
  if (!id) {
    return res.status(404).json({ message: "id not found" });
  }
  book.title = title;
  book.author = author;
  book.year = year;
  book.genre = genre;
  book.isAvailable = isAvailable;

  res.json(book);
});



app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

function filterByField(arr, key, value) {
  return arr.filter((item) => item[key] === value);
}
