const express = require('express')
const get_info = require('./services/home_contents')
const get_contents = require('./services/contents')
const get_music_contents = require('./services/music_contents')
const get_dtm_contents = require('./services/dtm_contents')
const get_stats_contents = require('./services/statistic_contents')
const get_programming_contents = require('./services/programming_contents')
const get_other_contents = require('./services/other_contents')
const PORT = process.env.PORT || 80

const app = express()
app.use(express.static('public'))

// /Other_contentsへ統計コンテンツ用のpropertiesを飛ばす
app.get('/other_contents', async(req, res) => {
  const other_contents = await get_other_contents()
  res.json(other_contents)
})

// /programming_contentsへ統計コンテンツ用のpropertiesを飛ばす
app.get('/programming_contents', async(req, res) => {
  const programming_contents = await get_programming_contents()
  res.json(programming_contents)
})

// /stats_contentsへ統計コンテンツ用のpropertiesを飛ばす
app.get('/stats_contents', async(req, res) => {
  const stats_contents = await get_stats_contents()
  res.json(stats_contents)
})

// /music_contentへMusicコンテンツ用のpropertiesを飛ばす
app.get('/music_contents', async(req, res) => {
  const music_contents = await get_music_contents()
  res.json(music_contents)
})

// /dtm_contentへDTMコンテンツ用のpropertiesを飛ばす
app.get('/dtm_contents', async(req, res) => {
  const dtm_contents = await get_dtm_contents()
  res.json(dtm_contents)
})

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

