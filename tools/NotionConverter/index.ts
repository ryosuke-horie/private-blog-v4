import { $getPageFullContent } from "@notion-md-converter/core";
import { NotionZennMarkdownConverter } from "@notion-md-converter/zenn";
import { Client } from "@notionhq/client";

import dotenv from 'dotenv';
dotenv.config();

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

    const pageId = "1b4b8735797980879c62f5cda1b27517"
    const content = await $getPageFullContent(client, pageId);

    const executor = new NotionZennMarkdownConverter();
    const result = executor.execute(content);
    console.log(result);
};

main();