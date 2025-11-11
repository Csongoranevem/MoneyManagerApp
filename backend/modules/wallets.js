const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');



router.get("/", (req, res)=>{
    
    query(`SELECT * FROM wallets` ,[], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})

router.get('/balance/:walletId', (req, res) => {
    const walletID = req.params.walletId;

    //get balance using transaction history
    query(`SELECT SUM(amount) as balance FROM transactions WHERE walletID = ?`, [walletID], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json(results);
    });
});

router.get("/:userId", (req, res)=>{
    const userId = req.params.userId
    
    query(`SELECT * FROM wallets where userID = ? ` ,[userId], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})

router.get("/:userId/id", (req, res)=>{
    const userId = req.params.userId
    const id = req.params.id
    
    query(`SELECT * FROM wallets where userID = ? and ID = ? ` ,[userId, id], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})



router.post("/", (req, res)=>{
    const {userID, name, balance} = req.body;
    query(`INSERT INTO wallets (userID, name, balance) VALUES (?,?,?)`,
    [userID, name, balance],
    (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;

        res.status(200).json({id: results.insertId, userID, name, balance});
    },req);
})


router.delete("/:id", (req, res)=>{
    const id = req.params.id;

    query(`DELETE FROM wallets WHERE ID = ?`, [id], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;

        res.status(200).json({msg: "Sikeres törlés", id});
    },req);
})

router.patch("/:id", (req, res)=>{
    const id = req.params.id;
    const {name, balance} = req.body;

    query(`UPDATE wallets SET name = ?, balance = ? WHERE ID = ?`,
    [name, balance, id],
    (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;

        res.status(200).json({msg: "Sikeres frissítés", id, name, balance});
    },req);
})

module.exports = router;