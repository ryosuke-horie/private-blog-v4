# React + React Router を使用した Markdown ブログ実装調査

## Markdown 表示ライブラリの選定

現在 (2025年4月時点) でメンテナンスが継続されている主要な React Markdown 表示ライブラリは以下の通りです：

1. **react-markdown** - シンプルで使いやすい、最も人気のあるMarkdownレンダラー
2. **markdown-to-jsx** - カスタマイズ性が高く、パフォーマンスに優れている
3. **MDX** - JSXとMarkdownを組み合わせられる拡張Markdown
4. **remark** - プラグインエコシステムが豊富な強力なMarkdownプロセッサ

## 主要ライブラリ比較

### MDX
- **最大の特徴**: React コンポーネントを Markdown 内で直接使用可能
- **フロントマター**: 標準でサポート
- **セットアップ**: ビルド時に処理するためのセットアップが必要（webpack/rollup/vite などとの統合）
- **学習曲線**: やや高め
- **適したユースケース**: 大規模なドキュメントサイトやインタラクティブな要素が多いブログ

### remark
- **特徴**: プラグインが豊富で拡張性が高い
- **API**: 低レベルな API で細かいカスタマイズが可能
- **フロントマター**: 対応プラグイン (remark-frontmatter) あり
- **強み**: 独自の構文拡張やカスタム処理を行いたい場合
- **ノート**: 単体ではなく、react-markdown の基盤として使われることも多い

### react-markdown
- **特徴**: 最もシンプルで導入が容易
- **ベース**: remark ベースだが API が簡素化されている
- **フロントマター**: 標準ではサポートしていないが、gray-matter と組み合わせることで対応可能
- **カスタマイズ**: 可能だがやや制限がある

## 選定結果

**react-markdown + gray-matter** の組み合わせを選定。理由：
- シンプルな導入が可能
- React Router との統合が容易
- フロントマターによるメタデータ管理が可能
- 必要十分な機能を備えている

## メタデータ管理手法

### フロントマターで一般的に使用されるメタデータ

```markdown
---
title: 記事のタイトル
date: 2025-04-16
updated: 2025-04-16
tags: [React, JavaScript, Markdown]
categories: [プログラミング, Web開発]
author: 著者名
excerpt: 記事の抜粋やサマリー
thumbnail: /images/thumbnail.jpg
draft: false
---
```

### 実装アプローチ: ビルド時生成パターン

最もパフォーマンスが良く、SEOにも有利な方法。

1. **プロジェクト構成**:
```
my-blog/
├── public/
│   └── posts-data.json (生成されるファイル)
├── posts/
│   ├── hello-world.md
│   ├── react-router.md
│   └── ...
├── scripts/
│   └── generate-posts-data.js
├── src/
│   ├── components/
│   │   ├── BlogList.js
│   │   ├── BlogPost.js
│   │   └── ...
│   ├── App.js
│   └── ...
├── package.json
└── ...
```

2. **メタデータ生成スクリプト**:

```javascript
// scripts/generate-posts-data.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const outputFile = path.join(process.cwd(), 'public', 'posts-data.json');

// 全ての記事のメタデータを抽出
function generatePostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // ファイル名からslugを取得
      const slug = fileName.replace(/\.md$/, '');
      
      // マークダウンファイルを文字列として読み取る
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // gray-matterでメタデータをパース
      const { data } = matter(fileContents);
      
      // 日付とslugと一緒にデータを返す
      return {
        slug,
        ...data,
      };
    })
    // 日付でソート
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // JSONファイルに書き出し
  fs.writeFileSync(outputFile, JSON.stringify(allPostsData));
  console.log('Posts data generated successfully!');
}

generatePostsData();
```

3. **package.json のスクリプト設定**:

```json
{
  "scripts": {
    "prebuild": "node scripts/generate-posts-data.js",
    "build": "react-scripts build",
    "start": "react-scripts start",
    "prestart": "node scripts/generate-posts-data.js"
  }
}
```

## 主要コンポーネントの実装

### ブログ記事表示コンポーネント

```javascript
import React from 'react';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// rehypeプラグイン（オプション）
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
// remarkプラグイン（オプション - GFMはテーブルなどGitHub Flavored Markdownをサポート）
import remarkGfm from 'remark-gfm';

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState({ content: '', data: {} });
  
  useEffect(() => {
    // Markdownファイルを取得
    fetch(`/posts/${slug}.md`)
      .then(res => res.text())
      .then(text => {
        // gray-matterでフロントマターとコンテンツを分離
        const { content, data } = matter(text);
        setPost({ content, data });
      })
      .catch(err => console.error(err));
  }, [slug]);

  return (
    <div className="blog-post">
      <h1>{post.data.title}</h1>
      {post.data.date && (
        <p className="post-date">{new Date(post.data.date).toLocaleDateString()}</p>
      )}
      {post.data.tags && (
        <div className="tags">
          {post.data.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
      <div className="post-content">
        <ReactMarkdown 
          children={post.content}
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        />
      </div>
    </div>
  );
}
```

### ブログ記事一覧コンポーネント（フィルタリング機能付き）

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  
  useEffect(() => {
    // 生成されたJSONファイルを読み込む
    fetch('/posts-data.json')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        
        // すべてのタグを抽出して重複を削除
        const allTags = data.reduce((acc, post) => {
          if (post.tags && Array.isArray(post.tags)) {
            return [...acc, ...post.tags];
          }
          return acc;
        }, []);
        
        setTags([...new Set(allTags)]);
      });
  }, []);
  
  // タグでフィルタリングした投稿を取得
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags && post.tags.includes(selectedTag))
    : posts;
  
  return (
    <div className="blog-container">
      {/* タグフィルター */}
      <div className="tags-filter">
        <button 
          className={selectedTag === null ? 'active' : ''} 
          onClick={() => setSelectedTag(null)}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            className={selectedTag === tag ? 'active' : ''}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {/* 記事リスト */}
      <div className="posts-grid">
        {filteredPosts.map(post => (
          <article key={post.slug} className="post-card">
            {post.thumbnail && (
              <div className="thumbnail">
                <img src={post.thumbnail} alt={post.title} />
              </div>
            )}
            <div className="post-content">
              <h2>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                <time>{new Date(post.date).toLocaleDateString('ja-JP')}</time>
                {post.author && <span className="author">by {post.author}</span>}
              </div>
              {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
              {post.tags && (
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="tag"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag(tag);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

## 拡張機能の実装例

### ページネーション

```javascript
// ページネーション実装の一部
const postsPerPage = 5;
const currentPage = parseInt(searchParams.get('page') || '1', 10);
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
const totalPages = Math.ceil(posts.length / postsPerPage);

// ページネーションコントロール
<div className="pagination">
  <button 
    onClick={() => paginate(currentPage - 1)} 
    disabled={currentPage === 1}
  >
    前へ
  </button>
  
  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
    <button
      key={number}
      className={currentPage === number ? 'active' : ''}
      onClick={() => paginate(number)}
    >
      {number}
    </button>
  ))}
  
  <button 
    onClick={() => paginate(currentPage + 1)} 
    disabled={currentPage === totalPages}
  >
    次へ
  </button>
</div>
```

## まとめ

- **ライブラリ選定**: react-markdown + gray-matter
- **メタデータ管理**: ビルド時生成パターン
- **特徴**: シンプルな実装、高いパフォーマンス、SEOに有利
- **拡張性**: タグによるフィルタリング、ページネーション、アーカイブなどの機能を後から追加可能

この実装方法により、メンテナンスが容易で、パフォーマンスに優れた静的なMarkdownブログを構築できます。
