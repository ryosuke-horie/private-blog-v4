import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreDependencies: [
		"@react-router/node",
		"isbot",
		"@biomejs/biome",
		"react-router-devtools",
	],
	ignore: ["panda.config.ts", "postcss.config.cjs", "vite.config.ts"],
};

export default config;
