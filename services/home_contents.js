const dotenv = require('dotenv').config()
const {Client} = require('@notionhq/client')


const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})


// タイトルテキストを取得 properties.Name..title[0].plain_text
// URLを取得 properties.url.rich_text[0].plain_text
// 画像を取得 properties.Property.files[0].file.url
module.exports = async function get_database_info() {
  // ホームページコンテンツ用のdatabase
  const databaseID = 'bef3301a23f0402fa38e7c4ad634fd84';
  const res = await notion.databases.query({
      database_id: databaseID
  });
  const result = res.results
  
  return result
}