const express = require("express");
const homeRoutes = require("./routes/homePage.routes");

const app = express();

app.use(express.json());
app.set("view engine", 'ejs');
app.use(express.static('assets'));

app.use("/", homeRoutes);


const Port = process.env.PORT || 1234

app.listen(Port, () => {
    console.log(`Server listenning on http://localhost:${Port}`);
})