const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const { response, request } = require("express");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://kushwah007-as:Test123@cluster0.bulpo.mongodb.net/wikiDB",
  { useNewUrlParser: true }
);

const articleSchema = {
  title: String,
  content: String,
};
const ArticleModal = mongoose.model("Article", articleSchema);

//////////////////////////// retreving, adding and deleting all data from  db ///////////////////
app
  .route("/")
  .get(async (request, response) => {
    const result = await ArticleModal.find({});
    try {
      response.send(result);
    } catch (error) {
      response.send(error).status(500);
    }
  })
  .post(async function (request, response) {
    //   console.log(request.body.title);
    //   console.log(request.body.content);
    const addData = new ArticleModal(request.body);
    try {
      await addData.save();
      response.send(addData);
    } catch (error) {
      response.status(500).send(error);
    }
  })
  .delete(async (request, response) => {
    try {
      await ArticleModal.deleteMany({});
      await ArticleModal.save();
      response.send("/");
    } catch (error) {
      response.status(300).send(error);
    }
  });

// app.post("/", async (request, response) => {
//   const addData = new ArticleModal(request.body);
//   try {
//     await addData.save();
//     response.send(addData);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

//////////////////////////// query for manuplation of a particulat field of data from  db ///////////////////
// fetching full info by name or id etc
app
  .route("/desiredData/:articleTitle")
  .get(async (request, response) => {
    const result = await ArticleModal.findOne({
      title: request.params.articleTitle,
    });
    try {
      response.send(result);
    } catch (error) {
      response.send(error).status(500);
    }
  })
  .put(function (request, response) {
    ArticleModal.updateOne(
      { title: request.params.articleTitle },
      { $set: request.body },

      function (error) {
        if (!error) {
          response.send("done");
        }
      }
    );
  })
  .patch(async (request, response) => {
    try {
      await ArticleModal.updateOne(
        { title: request.params.articleTitle },
        { $set: request.body }
      );
      await ArticleModal.save();
      //  response.send("/");
    } catch (error) {
      response.status(500).send(error);
    }
  })
  .delete(async (request, response) => {
    try {
      await ArticleModal.deleteOne({ title: request.params.articleTitle });
      await ArticleModal.save();
    } catch (error) {
      response.status(400).send(error);
    }
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("we are live on the server");
});

//"mongodb+srv://kushwah007-as:Test123@cluster0.bulpo.mongodb.net/wikiDB",
