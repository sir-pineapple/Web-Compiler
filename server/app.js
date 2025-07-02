const express = require('express');
const app = express();
app.use(express.json());

const { compileRouter } = require("compile");

app.use("/compile", compileRouter);

app.listen(3000, () => {
    console.log("listening on port 3000");
})