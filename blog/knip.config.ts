import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreDependencies: [
		"@react-router/node",
		"isbot",
		"@biomejs/biome",
		"react-router-devtools",
		"@ark-ui/react",
		"@park-ui/panda-preset",
		"lucide-react",
	],
	ignore: [
		"panda.config.ts",
		"postcss.config.cjs",
		"vite.config.ts",
		"app/components/parkui/**",
		"workers/**",
	],
	entry: ["./.react-router/types", "."],
};

export default config;
