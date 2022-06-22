const fs = require('fs');
const parse = require('csv-parser');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

const client = new MongoClient(url, {useUnifiedTopology: true});
client.connect();
const database = client.db("books");
const collection = database.collection("best_books")

let counter = 0

fs.createReadStream("./data/bestbooks.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        const book = {
            ...csvrow,
            author: csvrow.author.replace(/, /g, ',').split(","),
            genres: csvrow.genres.replace(/, /g, ',').split(","),
            characters: csvrow.characters.replace(/, /g, ',').split(","),
            awards: csvrow.awards.replace(/, /g, ',').split(","),
            setting: csvrow.setting.replace(/, /g, ',').split(",")
        }

        collection.insertOne(book)
        console.log(`${book.title} imported ...`)
        counter +=1
    }).on('end',function() {
        //do something with csvData
        console.log(`${counter} books imported`);
        process.exit()
    });
