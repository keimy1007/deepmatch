# DeepMatch - マッチングアプリ

現代的なマッチングアプリのフルスタック実装です。Next.js、TypeScript、Prisma、SQLiteを使用して構築されています。

## 🚀 機能

- **プロフィール閲覧**: ユーザープロフィールをカード形式で表示
- **いいね機能**: ユーザーに「いいね」を送信
- **マッチング**: 相互に「いいね」した場合にマッチが成立
- **リアルタイムメッセージング**: マッチしたユーザー間でのチャット機能
- **レスポンシブデザイン**: モバイルファーストのデザイン
- **サンプルデータ**: リアルな日本語のプロフィールデータを含む

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: SQLite with Prisma ORM
- **アイコン**: Lucide React
- **開発ツール**: ESLint, TypeScript

## 📦 プロジェクト構造

```
deepmatch/
├── app/
│   ├── api/               # API routes
│   │   ├── like/         # いいね機能
│   │   ├── matches/      # マッチ取得
│   │   ├── messages/     # メッセージ機能
│   │   └── profiles/     # プロフィール取得
│   ├── matches/          # マッチ関連ページ
│   │   ├── [id]/        # 個別チャット
│   │   └── page.tsx     # マッチ一覧
│   ├── globals.css      # グローバルスタイル
│   ├── layout.tsx       # ルートレイアウト
│   └── page.tsx         # メインページ
├── prisma/
│   ├── schema.prisma    # データベーススキーマ
│   ├── seed.ts          # サンプルデータ
│   └── dev.db          # SQLiteデータベース
├── public/              # 静的ファイル
└── package.json         # 依存関係
```

## 🗄️ データベーススキーマ

### User (ユーザー)
- 基本情報 (ID, email, password, name)
- 作成日・更新日

### Profile (プロフィール)
- 詳細情報 (bio, age, location)
- 趣味・写真 (JSON形式)
- マッチング設定

### Match (マッチ)
- ユーザー間の関係
- マッチ状態 (PENDING, MATCHED, DECLINED, BLOCKED)

### Like (いいね)
- ユーザー間の「いいね」関係
- 一意制約で重複防止

### Message (メッセージ)
- マッチ内でのメッセージ
- 既読状態

## 🚀 セットアップ

### 必要条件
- Node.js 18+
- npm

### インストール手順

1. **リポジトリをクローン**
   ```bash
   git clone <your-repo-url>
   cd deepmatch
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **データベースをセットアップ**
   ```bash
   # データベースとテーブルを作成
   npx prisma db push
   
   # サンプルデータを投入
   npm run db:seed
   ```

4. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

5. **ブラウザでアクセス**
   http://localhost:3000

## 📱 使用方法

### メイン機能
1. **プロフィール閲覧**: メインページでユーザープロフィールを確認
2. **いいね**: ハートボタンでいいねを送信
3. **パス**: Xボタンでパス
4. **マッチ確認**: ヘッダーのメッセージアイコンからマッチ一覧へ
5. **チャット**: マッチしたユーザーとメッセージ交換

### デモデータ
- 10人の日本語プロフィール
- 事前設定されたマッチとメッセージ
- リアルな写真プレースホルダー

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクション起動
npm run start

# リンター実行
npm run lint

# データベースリセット
npm run db:reset

# サンプルデータ再投入
npm run db:seed
```

## 🌟 機能詳細

### マッチングアルゴリズム
- 相互いいねでマッチ成立
- リアルタイムマッチ通知
- マッチ履歴の管理

### メッセージング
- マッチしたユーザー間のみでチャット可能
- メッセージの送信時刻表示
- レスポンシブなチャットUI

### UI/UX
- モバイルファーストデザイン
- スワイプ風のカードインターフェース
- グラデーションとシャドウを活用したモダンデザイン

## 🔮 今後の拡張可能性

- **認証システム**: JWT/session based authentication
- **画像アップロード**: Cloudinary/S3 integration
- **位置情報**: GPS based matching
- **プッシュ通知**: Real-time notifications
- **ビデオ通話**: WebRTC integration
- **AI マッチング**: ML-based recommendation
- **ソーシャル機能**: Instagram integration

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを作成してください。

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

このプロジェクトはClaude (Anthropic)によって作成されました。

---

💕 Happy Matching with DeepMatch!
