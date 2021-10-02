const express = require('express')
const get_info = require('./services/notion')
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.static('public'))


// /infoへホームページコンテンツ用のpropertiesを飛ばす
app.get('/info', async(req, res) => {
  const info = await get_info()
  res.json(info)
})

app.listen(PORT, console.log(`Server started on port ${PORT}`))

