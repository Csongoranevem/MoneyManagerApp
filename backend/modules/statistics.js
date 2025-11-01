const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');

const stat = `SELECT
    w.id AS wallet_id,
    w.name AS wallet_name,
    w.userID AS user_id,
    
    -- total money spent
    SUM(CASE WHEN t.type = 'kiadás' THEN t.amount ELSE 0 END) AS total_spent,
    
    -- total money received
    SUM(CASE WHEN t.type = 'bevétel' THEN t.amount ELSE 0 END) AS total_received,
    
    -- total number of transactions
    COUNT(t.id) AS total_transactions,
    
    -- current balance from Wallets table
    w.balance AS current_balance

FROM Wallets w
INNER JOIN Transactions t ON w.id = t.walletID

-- only wallets that belong to exactly one user
WHERE w.userID IS NOT NULL
  AND w.userID IN (
      SELECT userID
      FROM Wallets
      GROUP BY userID
      HAVING COUNT(DISTINCT id) >= 1
  )

GROUP BY w.id, w.name, w.userID, w.balance
ORDER BY w.name;
`

router.get("/", (req, res)=>{
    query(stat, [], (error, results) => {
        if (error) return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });

        res.status(200).json(results[0])
    }, req);
})

module.exports = router;