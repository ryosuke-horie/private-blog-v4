import { $getPageFullContent } from "@notion-md-converter/core";
import { NotionZennMarkdownConverter } from "@notion-md-converter/zenn";
import { Client } from "@notionhq/client";
import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';
import { createHash } from 'crypto';

import dotenv from 'dotenv';
dotenv.config();

// 実行結果をデバッグ出力するためのフラグ
const DEBUG = true;

// 画像をダウンロードして保存する関数
async function downloadImage(imageUrl: string, outputDir: string): Promise<string> {
    if (DEBUG) console.log(`Attempting to download: ${imageUrl}`);
    
    try {
        // URLからファイル名を生成（URLのハッシュ値を使用）
        const hash = createHash('md5').update(imageUrl).digest('hex');
        const ext = '.jpg'; // S3 URLは複雑なので、拡張子は.jpgに固定
        const filename = `${hash}${ext}`;
        const outputPath = path.join(outputDir, filename);

        // 既にファイルが存在していればスキップ
        try {
            await fs.access(outputPath);
            console.log(`Image already exists: ${outputPath}`);
            return filename;
        } catch {
            // ファイルが存在しない場合は続行
            if (DEBUG) console.log(`File doesn't exist, proceeding with download`);
        }

        // 出力ディレクトリが存在しない場合は作成
        try {
            await fs.mkdir(outputDir, { recursive: true });
        } catch (err) {
            console.error(`Failed to create directory: ${outputDir}`, err);
        }

        // 画像をダウンロード
        if (DEBUG) console.log(`Downloading image from URL: ${imageUrl}`);
        const response = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            timeout: 10000, // 10秒のタイムアウト
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (DEBUG) console.log(`Download successful, writing file to: ${outputPath}`);
        await fs.writeFile(outputPath, Buffer.from(response.data));
        console.log(`Downloaded image: ${imageUrl.substring(0, 50)}... -> ${outputPath}`);
        
        return filename;
    } catch (error) {
        console.error(`Failed to download image: ${imageUrl.substring(0, 50)}...`, error);
        // エラーの場合は元のURLを返す
        return imageUrl;
    }
}

// Markdownから画像URLを抽出してダウンロードし、パスを更新する関数
async function processMarkdownImages(markdownContent: string, imageDirPath: string, imageUrlPrefix: string = './images/'): Promise<string> {
    // Markdown内の画像パターンを検出する正規表現
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    
    // すべての画像URL置換処理を並行して実行するためのPromise配列
    const replacementPromises: [string, Promise<string>][] = [];
    
    // 画像URLを検出してダウンロード処理をキューに入れる
    let match;
    let matchCount = 0;
    const matches: string[] = [];
    
    // マッチを先に全て取得
    while ((match = imageRegex.exec(markdownContent)) !== null) {
        matchCount++;
        if (DEBUG) console.log(`Found image match #${matchCount}: ${match[0].substring(0, 50)}...`);
        matches.push(match[0]);
    }
    
    if (DEBUG) console.log(`Total image matches found: ${matchCount}`);
    
    // 拡張した正規表現でより詳細に解析
    for (const fullMatch of matches) {
        const altTextMatch = fullMatch.match(/!\[(.*?)\]/);
        const urlMatch = fullMatch.match(/\]\((.*?)\)/);
        
        if (!altTextMatch || !urlMatch) {
            if (DEBUG) console.log(`Could not parse image markdown: ${fullMatch}`);
            continue;
        }
        
        const altText = altTextMatch[1] || '';
        const imageUrl = urlMatch[1];
        
        // 各種クラウドストレージサービスのURLに対応
        if (imageUrl && imageUrl.startsWith('https://') && 
            (imageUrl.includes('notion.so') || 
             imageUrl.includes('file.notion.so') || 
             imageUrl.includes('s3.us-west-2.amazonaws.com') || 
             imageUrl.includes('s3.amazonaws.com'))) {
            
            if (DEBUG) console.log(`Processing URL: ${imageUrl.substring(0, 50)}...`);
            const filenamePromise = downloadImage(imageUrl, imageDirPath);
            replacementPromises.push([fullMatch, filenamePromise]);
        } else {
            if (DEBUG) console.log(`Skipping URL (not matching pattern): ${imageUrl?.substring(0, 50) || 'undefined'}...`);
        }
    }

    if (DEBUG) console.log(`Starting to process ${replacementPromises.length} images`);
    
    // すべての画像のダウンロードと置換を実行
    let updatedContent = markdownContent;
    for (const [fullMatch, filenamePromise] of replacementPromises) {
        const filename = await filenamePromise;
        // 元のURLがそのまま返ってきた場合（エラー時）は置換しない
        if (filename.startsWith('http')) {
            if (DEBUG) console.log(`Skipping replacement for: ${filename.substring(0, 50)}...`);
            continue;
        }
        
        // 画像パスを置換
        const newImagePath = `${imageUrlPrefix}${filename}`;
        const altTextMatch = fullMatch.match(/!\[(.*?)\]/);
        let altText = altTextMatch ? altTextMatch[1] : '';
        
        // Alt属性がURLの場合は空文字列に置き換える
        if (altText && (altText.startsWith('http') || altText.length > 50)) {
            altText = '';
        }
        
        const newImageMarkdown = `![${altText}](${newImagePath})`;
        
        if (DEBUG) console.log(`Replacing:\n${fullMatch.substring(0, 50)}...\nWith:\n${newImageMarkdown}`);
        updatedContent = updatedContent.replace(fullMatch, newImageMarkdown);
    }
    
    return updatedContent;
}

const main = async () => {
    // 環境変数からNotionのAPIトークンを取得
    const notionToken = process.env.NOTION_API_TOKEN;

    // 環境変数が設定されているか確認
    if (!notionToken) {
        console.error("Error: NOTION_API_TOKEN environment variable is not set");
        process.exit(1);
    }

    const client = new Client({
        auth: notionToken,
    });

    const pageId = "1cfb87357979801faaacc223d5ee7e81"; // ここにNotionのページIDを指定
    console.log(`Fetching Notion page: ${pageId}`);
    const content = await $getPageFullContent(client, pageId);
    console.log(`Retrieved content from Notion, converting to Markdown`);

    const executor = new NotionZennMarkdownConverter();
    const markdownResult = executor.execute(content);
    
    if (DEBUG) {
        console.log(`Generated Markdown (first 200 chars):\n${markdownResult.substring(0, 200)}...`);
    }
    
    // ページタイトルを取得（最初の# で始まる行から）
    const titleMatch = markdownResult.match(/^# (.+)$/m);
    let title = titleMatch && titleMatch[1] ? titleMatch[1] : `notion-page-${pageId}`;
    
    // タイトルが空白しかない場合は、デフォルトのページIDを使用
    if (title.trim() === '') {
        title = `notion-page-${pageId}`;
    }
    
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
    console.log(`Using title: "${title}" (sanitized: "${sanitizedTitle}")`);
    
    // コンテンツのルートディレクトリ
    const contentsDir = path.join(__dirname, '../../contents');
    
    // 記事ごとのディレクトリを作成
    const articleDir = path.join(contentsDir, sanitizedTitle);
    try {
        await fs.mkdir(articleDir, { recursive: true });
    } catch (err) {
        console.error(`Failed to create directory: ${articleDir}`, err);
    }
    
    // 記事ごとの画像ディレクトリを作成
    const articleImagesDir = path.join(articleDir, 'images');
    try {
        await fs.mkdir(articleImagesDir, { recursive: true });
    } catch (err) {
        console.error(`Failed to create directory: ${articleImagesDir}`, err);
    }
    
    // 画像の保存先ディレクトリとURLプレフィックス
    const imageDirPath = articleImagesDir;
    const imageUrlPrefix = './images/'; // 相対パスで画像を参照
    
    console.log(`Processing images, saving to: ${imageDirPath}`);
    // 画像をダウンロードしてMarkdownのパスを更新
    const processedMarkdown = await processMarkdownImages(markdownResult, imageDirPath, imageUrlPrefix);
    
    // Markdownファイルを保存
    const outputPath = path.join(articleDir, 'index.md');
    await fs.writeFile(outputPath, processedMarkdown);
    
    console.log(`Markdown saved to: ${outputPath}`);
    console.log('Processing completed successfully!');
};

main();