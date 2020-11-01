const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send('test');
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Your ap is lsitening on port " + listener.address().port);
    console.log(listener.address());
})