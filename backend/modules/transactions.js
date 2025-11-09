const express = require('express');
const router = express.Router();
const { query } = require('../utils/database');


//select all transactions

router.get("/", (req, res) => {

    query(`SELECT * FROM transactions`, [], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json(results)
    }, req);
})

//select transactions by walletId

router.get("/:walletId", (req, res) => {
    const walletId = req.params.walletId

    query(`SELECT * FROM transactions where walletID = ? `, [walletId], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json(results)
    }, req);
})

//select one transaction by walletId

router.get("/:walletId/:id", (req, res) => {
    const walletId = req.params.walletId
    const id = req.params.id

    query(`SELECT * FROM transactions where walletID = ? and ID = ? `, [walletId, id], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json(results)
    }, req);
})


//create a new transaction

router.post("/", (req, res) => {
    const { walletID, amount, categoryID, type } = req.body;
    query(`INSERT INTO transactions (walletID, amount, categoryID, type) VALUES (?,?,?,?)`,
        [walletID, amount, categoryID, type],
        (error, results) => {
            if (error) return res.status(400).json({ errno: error.errno, msg: "Hiba történt :(" });

            console.log(results);
            res.status(200).json("sikeres beszúrás");
        }, req);
})


router.delete("/:id", (req, res) => {
    const id = req.params.id;

    query(`DELETE FROM transactions WHERE ID = ?`, [id], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json({ msg: "Sikeres törlés", id });
    }, req);
})

router.patch("/:id", (req, res) => {
    const id = req.params.id;
    const { amount, categoryID, type } = req.body;

    query(`UPDATE transactions SET amount = ?, categoryID = ?, type = ? WHERE ID = ?`,
        [amount, categoryID, type, id],
        (error, results) => {
            if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

            res.status(200).json({ msg: "Sikeres frissítés", id, amount, categoryID, type });
        }, req);
})

module.exports = router;