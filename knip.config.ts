import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreDependencies: [
		"@react-router/node",
		"isbot",
		"@biomejs/biome",
		"react-router-devtools",
	],
};

export default config;
