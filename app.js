const express = require("express");
const { validateLogin } = require("./auth");

const app = express();

app.use(express.urlencoded({ extended: true }));

// ให้ Express เสิร์ฟไฟล์ใน public
app.use(express.static("public"));

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (validateLogin(email, password)) {
        return res.send("Login Success");
    }

    return res.status(400).send("Login Failed");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});