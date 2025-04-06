// Cloudflare Workersのエントリーポイント
export default {
	async fetch(request, env, ctx) {
		// __STATIC_CONTENT: 静的コンテンツを参照するための特別な変数
		// Workers Sitesの機能で自動的に利用可能になる
		const url = new URL(request.url);
		const cache = caches.default;

		// キャッシュを確認
		let response = await cache.match(request);
		if (response) return response;

		try {
			// 静的ファイルを取得する
			response = await env.__STATIC_CONTENT.fetch(url);

			// SPAのためのフォールバック - 404の場合はindexを返す
			if (response.status === 404) {
				// ファイルリクエストではなくページリクエストの場合、index.htmlにフォールバック
				const pathname = url.pathname;
				const fileExtension = pathname.split(".").pop();

				if (fileExtension === pathname) {
					// ファイル拡張子がない場合
					const indexResponse = await env.__STATIC_CONTENT.fetch(
						new URL("/index.html", url),
					);
					if (indexResponse.status === 200) {
						return indexResponse;
					}
				}
			}

			// 応答をキャッシュ
			if (response.status === 200) {
				ctx.waitUntil(cache.put(request, response.clone()));
			}

			return response;
		} catch (error) {
			console.error("Error serving static content:", error);
			return new Response("An error occurred", { status: 500 });
		}
	},
};
