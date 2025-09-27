const fs = require('fs');
const path = require('path');

/**
 * JSONLファイルを読み込んでTier Listデータを取得
 * @returns {Object} - Tierごとに分類されたデータ
 */
async function getDakimakuraContents() {
  try {
    const jsonlPath = path.join(__dirname, '../metadata/daki_tier.jsonl');
    const fileContent = fs.readFileSync(jsonlPath, 'utf8');
    
    // JSONLファイルをパース
    const lines = fileContent.trim().split('\n').filter(line => line.trim());
    const dakiData = lines.map(line => JSON.parse(line));
    
    // ローカル画像URLに変換
    const processedData = dakiData.map(item => ({
      name: item['キャラクター名'] || '',
      source: item['元ネタ'] || '',
      artist: item['絵師名'] || '',
      count: item['所持枚数'] || '1',
      tier: item['Tier'] || 'C',
      comment: item['コメント（あれば）'] || '',
      imageUrl: item['DIR'] ? item['DIR'].replace('./images/', '/images/') : '/images/default.jpg',
      originalPath: item['DIR']
    }));
    
    // Tierごとに分類
    const tierData = {
      S: processedData.filter(item => item.tier === 'S'),
      A: processedData.filter(item => item.tier === 'A'),
      B: processedData.filter(item => item.tier === 'B'),
      C: processedData.filter(item => item.tier === 'C')
    };
    
    return {
      success: true,
      data: tierData,
      total: processedData.length
    };
    
  } catch (error) {
    console.error('Error loading dakimakura contents:', error);
    return {
      success: false,
      error: error.message,
      data: { S: [], A: [], B: [], C: [] },
      total: 0
    };
  }
}

module.exports = getDakimakuraContents;