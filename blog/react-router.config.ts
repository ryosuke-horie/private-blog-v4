import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
  // ビルド時にプリレンダリングするURLのリストを返す
  async prerender() {
    return ["/", "/blog"];
  },
} satisfies Config;
