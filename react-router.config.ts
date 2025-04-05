import type { Config } from "@react-router/dev/config";

export default {
	// SSGモードを設定
	ssr: false,

	// プリレンダリングの設定
	// "*" を使って全てのルートをプリレンダリング
	async prerender() {
		return ["/"];
	},

	// 出力ディレクトリの設定
	outputDir: {
		client: "build/client",
		server: "build/server",
	},
} satisfies Config;
