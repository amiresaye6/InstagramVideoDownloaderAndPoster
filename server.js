const express = require("express");
const loginRoutes = require("./routes/login.routes");
const reelsRoutes = require("./routes/reels.routes");

const app = express();

app.use(express.json());
app.set("view engine", 'ejs');
app.use(express.static('assets'));

app.use("/login", loginRoutes);
app.use("/reels", reelsRoutes);

app.get("/", (req, res) => {
    res.status(200).json(
        {
            about: "This is an API that scrapes Instagram reels and returns the total views of the reels.",
            endpoints: [
                {
                    method: "POST",
                    url: "/login",
                    description: "Logs in to Instagram and saves the cookies to a file."
                },
                {
                    method: "POST",
                    url: "/reels",
                    description: "Scrapes Instagram reels and returns the total views of the reels."
                }
            ]
        }
    )
})


const Port = process.env.PORT || 1234

app.listen(Port, () => {
    console.log(`Server listenning on http://localhost:${Port}`);
})