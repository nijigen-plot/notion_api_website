# CLAUDE.md

このファイルは、このリポジトリで作業する際にClaude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

DTMプロデューサー「Quark」の個人サイト。Notionデータベースからコンテンツを取得して表示します。Express.jsバックエンドとバニラJavaScriptフロントエンドで構築されています。

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動 (ポート 5000)
node index.js
# または
npm start

# 環境設定
# .envファイルを作成して以下を記載: NOTION_API_KEY=your_key_here
```

## アーキテクチャ

### バックエンド構造
- **エントリーポイント**: `index.js` - 8つのAPIエンドポイントを持つExpressサーバー
- **サービス層**: `/services/*.js` - Notion API統合レイヤー
  - 各サービスは特定のNotionデータベースにクエリを実行し、タグでフィルタリング
  - パターン: `get_{category}_contents()` が `[articles, sorted_indices]` を返す
  - `@notionhq/client` v0.1.9 を使用

### 主要なNotionデータベースID
- **メインコンテンツ**: `b23f38b5d4684d25b1e27ff3f8304336` (タグ付き記事)
- **ホームコンテンツ**: `bef3301a23f0402fa38e7c4ad634fd84` (注目コンテンツ)

### フロントエンド構造
- **静的ファイル**: `/public/` ディレクトリがExpressで配信される
- **ページ**: メインページ (`index.html`) + `/public/pages/` 内のカテゴリページ
- **JavaScript**: 各ページに対応する `/public/js/` 内のJSファイル
- **パターン**: 各JSファイルがバックエンドAPIからフェッチ → DOM操作 → コンテンツ表示

### APIエンドポイント
```
/contents - 最新10件の記事（全カテゴリ）
/info - ホームページ用の注目コンテンツ
/music_contents - Music タグの記事
/programming_contents - Programming タグの記事
/dtm_contents - DTM タグの記事
/stats_contents - Statistics タグの記事
/other_contents - Other タグの記事
/daki_contents - 抱き枕カバーTierリスト（ローカルJSONLファイルベース）
```

## データフロー

### Notionベースのコンテンツ
Notionデータベース → バックエンドサービス → Express API → フロントエンドJavaScript → DOM

### 抱き枕カバーTierリスト
ローカルJSONLファイル (`metadata/daki_tier.jsonl`) → バックエンドサービス (`services/daki_contents.js`) → Express API (`/daki_contents`) → フロントエンドJavaScript (`public/js/daki.js`) → DOM

## コードパターン

### サービス層
- Notionベースのカテゴリサービスはすべて同一パターンに従う（コード重複あり）
- 日付ソート用にカスタム `sort.js` ユーティリティを使用
- Notionタグでフィルタリング: 'Music', 'Programming', 'DTM', 'Statistic', 'Other'
- `daki_contents.js` はNotionではなくローカルJSONLファイルを読み込む

### フロントエンドJavaScript
- Bootstrap 5.0.0-beta1 を使用したバニラJavaScript
- API呼び出しにasync/awaitパターンを使用
- アニメーションGIFでローディング状態を表示
- `createElement()` と `innerHTML` を使用した動的DOM操作

### Notionプロパティアクセスパターン
```javascript
// 記事プロパティ
res.properties.Name.title[0].plain_text    // タイトル
res.properties.URL.url                     // 外部リンク
res.properties.Tags.select.name           // カテゴリタグ
res.properties.Column.date.start          // 日付

// ホームコンテンツプロパティ
res.properties.Property.files[0].file.url // 画像URL
```

## 抱き枕カバーTierリスト管理

### データ構造
- **JSONLファイル**: `metadata/daki_tier.jsonl`
  - 各行が1つのキャラクターデータを含むJSONオブジェクト
  - フィールド: `キャラクター名`, `元ネタ`, `絵師名`, `所持枚数`, `Tier`, `コメント（あれば）`, `DIR`
  - `DIR`: 画像ファイルへの相対パス（例: `./images/PXL_20251019_021627030.jpg`）

### 画像管理
- **画像保存場所**: `public/images/` ディレクトリ
- **画像命名規則**: `PXL_YYYYMMdd_HHMMSS*.jpg` 形式（スマホ撮影の標準命名）
- **パス変換**: バックエンドで `./images/` → `/images/` に変換してWeb用URLに

### データ追加・更新手順（手動）
1. 抱き枕カバーの写真を `public/images/` に配置
2. `metadata/daki_tier.jsonl` に新しい行を追加
3. サーバーを再起動（JSONLファイルは起動時に読み込まれる）

### データ追加ワークフロー（Claude Codeによる対話的追加）

ユーザーから抱き枕カバーTierリストへの追加指示があった場合、以下の手順で実行してください：

1. **画像名の確認**
   - ユーザーに画像ファイル名を問う
   - `public/images/` ディレクトリ内に該当ファイルが存在するか確認
   - 存在しない場合はエラーメッセージを表示し、処理を中断

2. **重複チェック**
   - `metadata/daki_tier.jsonl` を読み込み、指定された画像名（DIR フィールド）が既に存在しないか確認
   - 既に存在する場合は、その旨をユーザーに通知し、更新するか問う

3. **データ入力**
   - AskUserQuestion ツールを使用して以下の情報を収集：
     - **キャラクター名** (必須)
     - **元ネタ** (必須)
     - **絵師名** (必須)
     - **所持枚数** (デフォルト: "1")
     - **Tier** (S/A/B/C から選択、必須)
     - **コメント** (オプション、空文字列可)

4. **JSONLへの追記**
   - 収集した情報を使って新しいJSON行を作成
   - フォーマット: `{"キャラクター名": "...", "元ネタ": "...", "絵師名": "...", "所持枚数": "...", "Tier": "...", "コメント（あれば）": "...", "DIR": "./images/画像名"}`
   - `metadata/daki_tier.jsonl` の最後に追記

5. **サーバーへの同期**
   - `scp` コマンドで本番サーバーに画像を転送
   - コマンド: `scp ./public/images/<画像名> mywebsite-server:/home/bitnami/notion_api_website/public/images/`
   - 転送成功を確認してユーザーに通知
   - **重要**: JSONLファイルの更新はGit経由でデプロイされるため、SCPでの転送は不要（画像ファイルのみ転送）

### バックエンド処理
- `services/daki_contents.js`: JSONLファイルを読み込み、パースしてTierごとに分類
- 画像パスを `/images/` プレフィックス付きのWeb用URLに変換
- 返却形式: `{ success: true, data: { S: [...], A: [...], B: [...], C: [...] }, total: N }`

### フロントエンド表示
- `public/pages/daki.html`: Tierリスト表示用のHTMLページ
- `public/js/daki.js`: APIからデータをフェッチし、Tierリストとして表示
- 各アイテムにマウスホバーでツールチップ表示（キャラ名、出展元、絵師、所持枚数、コメント）
- 画像の遅延読み込み（lazy loading）に対応

## 本番環境設定
- **ドメイン**: https://quark-hardcore.com
- **デプロイ**: ビルドプロセスなし、ファイル直接配信
- **環境**: ポート5000でNode.jsサーバー実行

## 重要な注意事項
- コードベースには日本語と英語のコメントが混在
- テストフレームワークやCI/CDパイプラインなし
- サービス層にカテゴリ間で重複したコードが多い
- フロントエンドはAPI呼び出しで本番ドメインをハードコード
