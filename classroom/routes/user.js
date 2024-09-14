const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
    res.send("GET for users");
})

router.get("/users/:id", (req, res) => {
    res.send("GET for user id");
})

router.post("/users", (req, res) => {
    res.send("POST for user id");
}) 

router.delete("/users/:id", (req, res) => {
    res.send("DELETE for users");
})

module.exports = router;