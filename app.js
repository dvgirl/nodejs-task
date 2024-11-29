require('dotenv').config();
const express = require('express')
const app = express()
const { env } = require('process');
let cors = require('cors')
app.use(cors())
app.use(express.json())
require('./database/mongoose')

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const authRoute = require('./routes/auth-route')
app.use('/api/auth/' , authRoute)

const superAdminRoute = require('./routes/superadmin-route')
app.use('/api/superadmin/' , superAdminRoute)

const ProductRoute = require('./routes/product-route')
app.use('/api/admin/' , ProductRoute)

const userRoute = require('./routes/user-route')
app.use('/api/user/' , userRoute)



app.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);
  }); 