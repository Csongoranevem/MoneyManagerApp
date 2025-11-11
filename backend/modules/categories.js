const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');


//select all categories
router.get("/", (req, res) => {

    query(`SELECT * FROM categories`, [], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });
        res.status(200).json(results);
    }, req);
})

router.get("/:id", (req, res) => {
    const categoryID = req.params.id;

    query(`SELECT * FROM categories WHERE id = ?`, [categoryID], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json(results);
    }, req);
});

//insert new category
router.post("/", (req, res) => {
    const { name } = req.body;

    query(`INSERT INTO categories (name) VALUES (?)`, [name], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json({ msg: "Kategória hozzáadva", id: results.insertId });
    }, req);
});

router.delete("/:id", (req, res) => {
    const categoryID = req.params.id;

    query(`DELETE FROM categories WHERE id = ?`, [categoryID], (error, _results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json({ msg: "Kategória törölve" });
    }, req);
});

module.exports = router;