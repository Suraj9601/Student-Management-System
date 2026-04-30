const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// HOME
app.get("/", (req, res) => {
    res.render("home");
});

// VIEW
app.get("/view-students", (req, res) => {
    db.query("SELECT * FROM student", (err, result) => {
        if (err) throw err;
        res.render("view", { students: result, mode: "view" });
    });
});

// UPDATE LIST
app.get("/update-students", (req, res) => {
    db.query("SELECT * FROM student", (err, result) => {
        if (err) throw err;
        res.render("view", { students: result, mode: "update" });
    });
});

// DELETE LIST
app.get("/delete-students", (req, res) => {
    db.query("SELECT * FROM student", (err, result) => {
        if (err) throw err;
        res.render("view", { students: result, mode: "delete" });
    });
});

// ADD PAGE
app.get("/add-student", (req, res) => {
    res.render("add");
});

// ADD
app.post("/add-student", (req, res) => {
    const data = req.body;

    if (!data.date_of_birth) data.date_of_birth = null;
    if (!data.admission_date) data.admission_date = null;

    db.query("INSERT INTO student SET ?", data, (err) => {
        if (err) throw err;
        res.redirect("/view-students");
    });
});

// EDIT PAGE
app.get("/update-student/:id", (req, res) => {
    db.query("SELECT * FROM student WHERE id=?", [req.params.id], (err, result) => {
        if (err) throw err;
        res.render("edit", { student: result[0] });
    });
});

// UPDATE
app.post("/update-student/:id", (req, res) => {
    const data = req.body;

    if (!data.date_of_birth) data.date_of_birth = null;
    if (!data.admission_date) data.admission_date = null;

    db.query("UPDATE student SET ? WHERE id=?", [data, req.params.id], (err) => {
        if (err) throw err;
        res.redirect("/update-students");
    });
});

// DELETE
app.get("/delete-student/:id", (req, res) => {
    db.query("DELETE FROM student WHERE id=?", [req.params.id], (err) => {
        if (err) throw err;
        res.redirect("/delete-students");
    });
});

// SEARCH BY ID
app.get("/search-student", (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.render("search", { student: null });
    }

    db.query("SELECT * FROM student WHERE id = ?", [id], (err, result) => {
        if (err) throw err;

        // send single student
        res.render("search", { student: result[0] || null });
    });
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});