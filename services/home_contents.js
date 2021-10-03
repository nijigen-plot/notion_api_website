const dotenv = require('dotenv').config()
const {Client} = require('@notionhq/client')


const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// pageのpropertiesを取得する
async function getinfo(pageid) {
  const res = await notion.pages.retrieve({
      page_id: pageid
  });
  // タイトルテキストを取得 properties.Name..title[0].plain_text
  // URLを取得 properties.url.rich_text[0].plain_text
  // 画像を取得 properties.Property.files[0].file.url
  // 一気に取得するならpropertiesを取得すればいい
  const url = res.properties
  return url
}

// databaseの中にあるpageのpropertiesを取得する
module.exports = async function get_database_info() {
  // ホームページコンテンツ用のdatabase
  const databaseID = 'bef3301a23f0402fa38e7c4ad634fd84';
  const res = await notion.databases.query({
      database_id: databaseID
  });
  // page_idを取得する
  const result = res.results
  pages = []
  for (let i = 0; i < result.length; i++) {
      pages.push(result[i].id)    
  }

  // page_idから必要なデータを取得する
  urls = []
  for (let i = 0; i < pages.length; i++){
      // urls.push(getinfo(pages[i]))
      await getinfo(pages[i])
          .then(res => {
              console.log('非同期処理成功')
              urls.push(res)
          }).catch(error => {
              console.log('非同期処理失敗', error)
              return null
          })
  }
  return urls
}