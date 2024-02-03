const routeRouter = require("./routes/index.js");
const cors = require('cors');
const express = require("express");

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/v1', routeRouter);

app.listen(3000, function () {
    console.log("Port 3000 is running")
})


