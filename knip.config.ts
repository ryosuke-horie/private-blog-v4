import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreDependencies: [
		"@react-router/node",
		"isbot",
		"@biomejs/biome",
		"react-router-devtools",
	],
	ignore: ["panda.config.ts", "postcss.config.cjs"],
};

export default config;
