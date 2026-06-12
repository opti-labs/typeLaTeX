import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages では https://<user>.github.io/<repo>/ に配信されるため、
// プロジェクトページの場合は base を "/<repo>/" にする必要がある。
// GitHub Actions 実行時に自動設定される GITHUB_REPOSITORY から算出するので、
// リポジトリ名を変えても設定変更は不要。
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = repo && !repo.endsWith(".github.io") ? `/${repo}/` : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
