# DBG Markets Help GTM 安装报告

生成日期：2026-06-04

## 1. 当前项目框架判断

当前项目判断为纯静态 HTML 网站。

判断依据：

- `package.json` 中没有 Next.js、Vite、Astro 等框架依赖或构建脚本。
- 开发脚本为 `python3 -m http.server 4199 --directory dbggm-site`。
- 正式页面位于 `dbggm-site/**/index.html`，另有 `dbggm-site/404.html`。

## 2. 修改了哪些文件

已在以下 22 个 HTML 文件安装 Google Tag Manager：

- `dbggm-site/404.html`
- `dbggm-site/index.html`
- `dbggm-site/about/index.html`
- `dbggm-site/account-types/index.html`
- `dbggm-site/contact/index.html`
- `dbggm-site/deposit-guide/index.html`
- `dbggm-site/faq/index.html`
- `dbggm-site/mt4-mt5-guide/index.html`
- `dbggm-site/open-account/index.html`
- `dbggm-site/risk-disclosure/index.html`
- `dbggm-site/withdrawal-guide/index.html`
- `dbggm-site/guides/index.html`
- `dbggm-site/guides/mt-account-register-mobile/index.html`
- `dbggm-site/guides/mt-account-register-pc/index.html`
- `dbggm-site/guides/unionpay-deposit-mobile/index.html`
- `dbggm-site/guides/unionpay-deposit-pc/index.html`
- `dbggm-site/guides/unionpay-withdrawal-mobile/index.html`
- `dbggm-site/guides/unionpay-withdrawal-pc/index.html`
- `dbggm-site/guides/usdt-deposit-mobile/index.html`
- `dbggm-site/guides/usdt-deposit-pc/index.html`
- `dbggm-site/guides/usdt-withdrawal-mobile/index.html`
- `dbggm-site/guides/usdt-withdrawal-pc/index.html`

安装内容：

- GTM head script 已插入到每个页面 `<head>` 起始后方。
- GTM noscript iframe 已插入到每个页面 opening `<body>` 标签后方。
- GTM Container ID：`GTM-KNLZC5KC`

## 3. 是否发现已有 GTM / GA4 / gtag / Clarity 代码

未在 `dbggm-site` 正式站点文件中发现既有 GTM、GA4、gtag、Google Analytics 或 Microsoft Clarity 可执行代码。

说明：仓库根目录旧文件 `seo-audit-report.md` 中提到过 GA4 待人工确认，但这是报告文字，不是站点加载代码。

## 4. GTM 是否已经全站安装

是。

验证结果：

- 已检查 `dbggm-site` 下全部 22 个 HTML 文件。
- 每个 HTML 文件均包含 1 处 GTM head script。
- 每个 HTML 文件均包含 1 处 GTM noscript iframe。
- 每个 HTML 文件中 `GTM-KNLZC5KC` 出现 2 次，分别对应 head script 和 noscript iframe。
- 插入位置校验通过：head script 紧跟 `<head>`，noscript 紧跟 opening `<body...>`。

## 5. 是否存在重复加载风险

当前未发现重复加载风险。

依据：

- 安装前检索未发现既有 GTM / GA4 / gtag / Clarity 执行代码。
- 安装后每个 HTML 文件均只有 1 组 GTM head script 和 1 组 noscript。
- 未将 GTM 安装到 API、serverless function、middleware 或其他会增加 Vercel 请求成本的位置。

## 6. 如何验证安装是否成功

建议部署后按以下方式验证：

1. 在浏览器打开 `https://www.dbgmarkets-help.com/`。
2. 查看页面源代码，搜索 `GTM-KNLZC5KC`，应看到 head script 和 noscript iframe。
3. 使用 Google Tag Assistant 或 GTM Preview 模式访问站点，确认容器 `GTM-KNLZC5KC` 已加载。
4. 打开浏览器 DevTools Network，过滤 `googletagmanager.com`，应看到 `gtm.js?id=GTM-KNLZC5KC` 请求。
5. 随机检查内页，例如 `/open-account/`、`/deposit-guide/`、`/guides/usdt-deposit-pc/`，确认同样加载 GTM。

本地校验已执行：

- `npm run check`：通过。
- 逐页 GTM 计数脚本：22 个 HTML 文件全部通过。
- `rg` 检索 GA4 / gtag / Clarity：未发现。

## 7. 是否需要重新部署 Vercel

需要。

本次修改的是静态 HTML 源文件。只有重新部署 Vercel 后，线上站点 `https://www.dbgmarkets-help.com/` 才会加载新安装的 GTM 代码。

## 8. 隐私或合规提醒

- 当前只安装 GTM 容器代码，没有新增事件追踪、表单采集或个人信息采集逻辑。
- 后续在 GTM 容器中配置标签时，不应采集或传递姓名、邮箱、手机号、交易账号、身份证、银行卡、聊天内容等个人敏感信息。
- 如需配置点击、表单或转化事件，建议只发送页面路径、按钮类型、事件名称等非敏感字段。
