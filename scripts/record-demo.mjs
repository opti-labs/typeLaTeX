// 複合モードを全問正解でクリアする様子を録画するスクリプト。
// 各問題はページ上の「お手本」LaTeX をそのまま 1 文字ずつ入力し、
// ライブプレビューが更新される様子を見せながら正解していく。
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "recordings");
const URL = process.env.DEMO_URL || "http://localhost:5180/";
const VIEWPORT = { width: 820, height: 1180 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  recordVideo: { dir: OUT_DIR, size: VIEWPORT },
});
const page = await context.newPage();

await page.goto(URL, { waitUntil: "networkidle" });
await sleep(1200); // タイトルを見せる

// 複合範囲（3 枚目のカード）を開始
await page.locator("div.grid > button").nth(2).click();
await sleep(800);

const QUESTIONS = 10;
for (let q = 0; q < QUESTIONS; q++) {
  // お手本の LaTeX ソースを読み取る（KaTeX の annotation に元コードが入る）
  const target = await page.locator("annotation").first().textContent();
  if (!target) break;

  // textarea を取得して 1 文字ずつ入力（React の input イベントを発火）
  const handle = await page.locator("textarea").elementHandle();
  for (let i = 1; i <= target.length; i++) {
    const partial = target.slice(0, i);
    await page.evaluate(
      ({ el, value }) => {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value",
        ).set;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      },
      { el: handle, value: partial },
    );
    // 長い数式ほど速く打つ（全体が間延びしないように）
    await sleep(target.length > 40 ? 18 : 32);
  }

  await sleep(350); // 入力完了を見せる
  // 判定ボタンをクリック
  await page.locator("button:has-text('判定')").click();
  await sleep(1100); // 正解スタンプ＋次問題への遷移を待つ
}

// リザルト画面を見せる
await page.waitForSelector("h1:has-text('リザルト')", { timeout: 5000 });
await sleep(1500);
// スコア内訳までゆっくりスクロール
await page.evaluate(() => window.scrollTo({ top: 400, behavior: "smooth" }));
await sleep(2000);

await context.close(); // ここで動画が確定保存される
await browser.close();

const video = await page.video();
const videoPath = video ? await video.path() : null;
console.log("VIDEO_PATH=" + videoPath);
