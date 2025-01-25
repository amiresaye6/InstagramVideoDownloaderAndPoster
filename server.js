const express = require("express");
const loginRoutes = require("./routes/login.routes");
const reelsRoutes = require("./routes/reels.routes");

const app = express();

app.use(express.json());
app.set("view engine", 'ejs');
app.use(express.static('assets'));

app.use("/login", loginRoutes);
app.use("/reels", reelsRoutes);


const Port = process.env.PORT || 1234

app.listen(Port, () => {
    console.log(`Server listenning on http://localhost:${Port}`);
})