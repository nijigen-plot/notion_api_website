const AWS = require('aws-sdk');
require('dotenv').config();

// S3クライアントの設定
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * S3 URLから署名付きURLを生成する
 * @param {string} s3Url - S3 URL (s3://bucket/key format)
 * @returns {string} - 署名付きURL
 */
function generateSignedUrl(s3Url) {
  try {
    // s3://bucket/key から bucket と key を抽出
    const urlParts = s3Url.replace('s3://', '').split('/');
    const bucket = urlParts[0];
    const key = urlParts.slice(1).join('/');
    
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 3600 // 1時間有効
    };
    
    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
}

module.exports = {
  generateSignedUrl
};