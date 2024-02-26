const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const mongoose = require('mongoose');
const { MONGODB_URL } = require('./config');
const bodyParser = require('body-parser');


mongoose.connect(MONGODB_URL);
mongoose.connection.on("connected", () => {
    console.log("Mongo DB Connected");
});
mongoose.connection.on("error", (error) => {
    console.log("Some error while connecting to database.....");
});

app.use(cors());
app.use(express.json());

require('./model/user_model');
require('./model/addsale_model');

app.use(require('./routes/user_route'));
app.use(require('./routes/addsale_route'));


app.listen(port, () => {
    console.log(`Server started on ${port}.....!`);
});