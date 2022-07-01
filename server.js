const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const PORT = 8000;
const path = require("path");

let db,
  dbConnect = process.env.DB_CONNECT,
  dbName = "sample_mflix",
  dbCollection;

MongoClient.connect(dbConnect).then((client) => {
  console.log(`Connected to database`);
  db = client.db(dbName);
  dbCollection = db.collection("movies");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./index.html"));
});

app.get("/search", async (req, res) => {
  try {
    let result = await dbCollection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.query}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 3,
              },
            },
          },
        },
      ])
      .toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/get/:id", async (req, res) => {
  try {
    let result = await dbCollection.findOne({ _id: ObjectId(req.params.id) });
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: error.message });
  }
});
app.listen(process.env.PORT || PORT, () => console.log("Connected to port"));
