const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const PORT = 8000;

let db,
  dbConnect = process.env.DB_CONNECT,
  dbName = "sample_mtflix",
  dbCollection;

MongoClient.connect(dbConnect).then((client) => {
  console.log(`Connected to database`);
  db = client.db(dbName);
  dbCollection = db.collection("movies");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.get("/search", async (req, res) => {
  try {
    let result = await dbCollection
      .aggregate([
        {
          $serch: {
            automatic: `${req.params.query}`,
            path: "title",
            fuzzy: {
              maxEdits: 2,
              prefixlength: 3,
            },
          },
        },
      ])
      .toAarray();
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
