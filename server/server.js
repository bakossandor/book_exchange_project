const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")

const config = require("./config/config")
const routes = require("./routes/routes")

const app = express()
const corsOptions = {
    exposedHeaders: "Authorization"
}
app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(morgan("combined"))

routes(app)

mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true})
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected to mongodb database")
    app.listen(config.port, () => {
        console.log(`app is listening on port ${config.port}`)
    })
});

