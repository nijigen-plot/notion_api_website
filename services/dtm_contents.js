const dotenv = require('dotenv').config()
const {Client} = require('@notionhq/client')
const argsort = require('../function/sort')
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// teble_databaseの各行のデータを取得する(musicタグのみ)
module.exports = async function get_dtm_contents() {
    // latest contentsやその他ページ用のtable_database
    const databaseID = 'b23f38b5d4684d25b1e27ff3f8304336';
    const res = await notion.databases.query({
      database_id : databaseID
    })
    const result = res.results
    // page_idのTagを取得 res.results[i].properties.Tags.select.name
    const dtm_result = []
    result.forEach((res) => {
        if (res.properties.Tags.select.name === 'DTM'){
            dtm_result.push(res)
        }
    })
    // DTMだけのコンテンツに絞った後にargソートと情報を取り出す
    const dates = []
    dtm_result.forEach((res) => {
        dates.push(res.properties.Column.date.start)
    })
    const dates_sort = argsort(dates)
    // 配列の最初にdatabaseの記事一覧を、最後に記事ページに入力した日付のargsortを返す
    console.log('dtm')
    return [dtm_result, dates_sort]
  }