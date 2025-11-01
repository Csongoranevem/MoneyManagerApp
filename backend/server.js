const express = require('express');
var cors = require('cors');
const app = express();
const logger = require("./utils/logger")

const users = require('./modules/users');
const categories = require('./modules/categories');
const statistics = require('./modules/statistics');
const transactions = require('./modules/transactions');
const wallets = require('./modules/wallets');



// Middleware-ek
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', users);
app.use('/categories', categories);
app.use('/statistics', statistics);
app.use('/transactions', transactions);
app.use('/wallets', wallets);



app.listen(process.env.PORT, () => {
    
    logger.info(`Server listening on ${process.env.PORT}`);//${process.env.PORT}
});
