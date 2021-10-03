const express = require('express')
const get_info = require('./services/home_contents')
const get_contents = require('./services/contents')
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.static('public'))


// /infoへホームページコンテンツ用のpropertiesを飛ばす
app.get('/info', async(req, res) => {
  const info = await get_info()
  res.json(info)
})

// /contentsへlatest contents用のresultsを飛ばす
app.get('/contents', async(req, res) => {
  const contents = await get_contents()
  res.json(contents)
})

app.listen(PORT, console.log(`Server started on port ${PORT}`))

