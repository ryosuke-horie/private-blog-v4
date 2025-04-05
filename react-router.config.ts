import type { Config } from "@react-router/dev/config";

export default {
	// SSGモードに変更（SPAモードを有効化）
	ssr: false,
	// return a list of URLs to prerender at build time
	async prerender() {
		return ["*"];
	},
} satisfies Config;
