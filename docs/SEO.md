# SEO設定・公開後の手順

## 対象URL

https://masarugym.pages.dev/

`astro.config.mjs` の `site` を上記の本番URLに設定しています。canonical・OGP URL・構造化データ・robots.txt・サイトマップはこの値をもとに生成します。独自ドメインに移行する際は `site` を変更して再公開してください。

## 実装内容

- 検索結果用タイトル: 津市のボクシングジム｜まさるボクシングジム【三重県】
- 地域・ジム名・実際のREコースの特徴・料金や体験への案内を含む説明文
- トップページの正規URLを `https://masarugym.pages.dev/` に固定するcanonical
- OGP一式（タイトル・説明・URL・サイト名・日本語ロケール・共有画像・画像サイズ・代替テキスト）
- Xなどで使用される大きな画像付き共有カード
- 既存ヒーロー画像をAstroの画像処理で1200×630のJPEGにした共有用画像（ビルド時生成）
- JSON-LDの `ExerciseGym`・`WebSite`・`WebPage` をIDで関連付け
- ジムの住所・国番号付き電話・メール・Instagram・通常営業時間を構造化データへ反映
- `/robots.txt` と `/sitemap.xml` を静的エンドポイントで生成
- 存在しないURL用の404ページとnoindex設定
- ヒーローの地域・ジム名を日本語で明記

本体は静的HTMLです。紹介・料金・入会案内・アクセスはクライアント側のデータ取得に依存せず出力されます。画像のサイズ指定・ヒーロー画像の優先読込・下部画像とマップの遅延読込は維持しています。

## 構造化データの範囲

提供文・参考チラシ・既存公式ページに基づく情報を使っています。生成したトレーニング画像は、店舗の実写写真として構造化データに登録していません。未確認の緯度経度・レビュー・評価・実施中のキャンペーン・体験特典も登録していません。

営業時間は月・水・木・金17:00〜21:30、土日14:00〜18:00。火曜日は通常営業の指定から除外しています。祝日と試合日の不定休は説明文と画面上に記載しています。未確定の祝日・臨時休館の日付を推測して登録することは避けています。

## 更新する場所

| 内容 | ファイル |
| --- | --- |
| 本番URL | `astro.config.mjs` の `site` |
| タイトル・説明文・構造化データ | `src/data/seo.ts` |
| 電話・住所・Instagramなど | `src/data/gym.ts` |
| head内メタ情報と共有画像処理 | `src/pages/index.astro` |
| クロール設定 | `src/pages/robots.txt.ts` |
| サイトマップURL一覧 | `src/pages/sitemap.xml.ts` |
| 404ページ | `src/pages/404.astro` |

所在地を変える場合は `gym.address` と `gym.postalAddress`、画面上のアクセス情報、地図も揃えて変更します。営業時間変更時は画面上のコース・アクセス・連絡先表示と `src/data/seo.ts` の営業時間を揃えてください。

現時点で独立した公開ページはトップだけなので、サイトマップもトップ1件です。ページ内の各セクションや、独立ページではない開閉式の記事を別URLとして登録していません。今後URLを持つ記事ページを作った場合に、実在するページだけ追加します。`lastmod` に毎回のビルド日を自動設定することも避けています。

## 公開後に行う作業

1. この変更をCloudflare Pagesへ再デプロイします。現在の公開ページはローカル修正だけでは変わりません。
2. Google Search Consoleで `https://masarugym.pages.dev/` のURLプレフィックスプロパティを登録し、所有権確認を行います。確認コードが発行されたらhead内へ追加できます。
3. Search Consoleへ `https://masarugym.pages.dev/sitemap.xml` を送信し、トップページをURL検査からインデックス登録リクエストします。
4. Googleビジネスプロフィールのウェブサイト欄、Instagramのプロフィールリンクなど、管理している公式導線を新しいURLに揃えます。
5. 旧 `http://www.masarugym.com/` から完全移行する場合は、旧ホスティング側で新URLへの301リダイレクトを設定します。新サイト側のcanonicalだけでは旧ドメインを転送できません。

Cloudflare PagesのプレビューURLはプラットフォーム側でnoindexが付く場合があります。本番URLをSearch Consoleに登録してください。独自ドメイン移行時は、移行先をcanonicalとサイトマップの基準にし、旧公開URLとの転送も揃えます。

## 実施状況

実装前の公開トップページはHTTP 200で取得できました。今回のSEO修正はローカルソースに反映しています。ユーザーの指示により実装後のビルド・ブラウザ確認・構造化データの外部テストは実施していません。デプロイ・Search Console登録・サイトマップ送信・インデックス登録も未実施です。

## 参照した公式資料

- [Google: ローカルビジネスの構造化データ](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Schema.org: ExerciseGym](https://schema.org/ExerciseGym)
- [Astro: ルーティング](https://docs.astro.build/en/guides/routing/)
- [Astro: 画像](https://docs.astro.build/en/guides/images/)
- [Cloudflare Pages: ページ配信と404の挙動](https://developers.cloudflare.com/pages/configuration/serving-pages/)
