const express = require('express');
const app = express();
app.use(express.json());

const { langRouter } = require("./routeLang");

app.use("/compile", langRouter);

app.listen(3000, () => {
    console.log("listening on port 3000");
})