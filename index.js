const express = require("express");
let app = express();
const cors = require("cors");
require("dotenv").config();

const Note = require("./models/note");

app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body); //this request can be done thanks to app.use(express.json())
  console.log("---");
  next();
};

app.use(express.static("build"));
app.use(express.json()); //this allows us to use request.body to obtain body data of POST method
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

let notes = [];

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  //using Mongoose's findById method
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.post("/api/notes", (request, response, next) => {
  const noteFromBody = request.body;

  if (noteFromBody.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const newNote = new Note({
    content: noteFromBody.content,
    important: noteFromBody.important || false,
  });

  newNote
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  // const note = {
  //   content: body.content,
  //   important: body.important,
  // };

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

//this has to be the last loaded middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
