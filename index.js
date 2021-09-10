const express = require('express')
const getVideos = require('./services/notion')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static('public'))

app.get('/videos', async(req, res) => {
  const videos = await getVideos()
  res.json(videos)
})

app.listen(PORT, console.log(`Server started on port ${PORT}`))

// どういうやつかよくわからん
// ;(async () => {
//   const nVideos = await getVideos()
//   console.log(nVideos)
// })()



// pageの情報が返ってくる
// const getVideos = async () => {
//   const payload = {
//     path: `databases/${database_id}/query`,
//     method: 'POST',
//   }

//   const {results} = await notion.request(payload)

// pageの詳細が返ってくる page.properties.... で更に詳細が取得できるみたい
//   const videos = results.map( (page) => {
//     console.log(page.properties.Name.title[0])
//   })
// }
// getVideos()

// 10分くらい databaseの情報が返ってくる
// https://www.youtube.com/watch?v=9JdP-S3crt8
// const listDatabases = async () => {
//   const res = await notion.databases.list()
//   console.log(res)
// }
// listDatabases()