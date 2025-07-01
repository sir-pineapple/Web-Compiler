const express = require('express');
const app = express();
app.use(express.json());

app.post("/compile", (req, res) => {
    const {language, code} = req.body;
    if (!code) {
        res.json({message: "Code must be provided"})
    }
})

app.listen(3000, () => {
    console.log("listening on port 3000");
})