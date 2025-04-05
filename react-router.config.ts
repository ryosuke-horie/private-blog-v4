import type { Config } from "@react-router/dev/config";

export default {
	// SSGモードを設定
	ssr: true,

	// プリレンダリングの設定(SSG)
	// "*" を使って全てのルートをプリレンダリング
	async prerender() {
		return ["/"];
	},
} satisfies Config;
