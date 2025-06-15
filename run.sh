#!/bin/bash

# DeepMatch - 自動セットアップ・起動スクリプト
# このスクリプトは、依存関係のインストールからアプリ起動まで全自動で実行します

set -e  # エラー時に停止

echo "🚀 DeepMatch アプリケーション自動セットアップを開始します..."

# プロジェクトディレクトリに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📂 作業ディレクトリ: $(pwd)"

# 1. Node.jsバージョン確認
echo "🔍 Node.jsバージョンを確認中..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません。Node.js 18以上をインストールしてください。"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18以上が必要です。現在のバージョン: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) を検出"

# 2. 依存関係をインストール
echo "📦 依存関係をインストール中..."
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ 依存関係のインストール完了"
else
    echo "✅ node_modules が既に存在します"
fi

# 3. データベースセットアップ
echo "🗄️ データベースをセットアップ中..."

# Prismaクライアント生成
echo "  - Prismaクライアントを生成中..."
npx prisma generate

# データベース作成・マイグレーション
echo "  - データベースとテーブルを作成中..."
npx prisma db push

# サンプルデータ投入
echo "  - サンプルデータを投入中..."
npm run db:seed

echo "✅ データベースセットアップ完了"

# 4. ビルド実行（任意）
echo "🔨 アプリケーションをビルド中..."
npm run build
echo "✅ ビルド完了"

# 5. 開発サーバー起動
echo "🌟 開発サーバーを起動中..."
echo ""
echo "==========================================="
echo "🎉 DeepMatch アプリケーション準備完了！"
echo "==========================================="
echo ""
echo "📱 ブラウザで以下のURLにアクセスしてください:"
echo "   http://localhost:3000"
echo ""
echo "💡 停止するには Ctrl+C を押してください"
echo ""
echo "🚀 サーバーを起動しています..."
echo ""

# 開発サーバー起動
npm run dev