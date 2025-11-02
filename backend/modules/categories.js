const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');


//select all categories
router.get("/", (req, res) => {

    query(`SELECT * FROM categories`, [], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json(results)
    }, req);
})


module.exports = router;