# DBG Markets 指南网站 Vercel 部署前检查报告

检查时间：2026-06-03

## 1. 项目框架

当前项目是纯静态 HTML/CSS/JavaScript 网站，不是 Next.js、React、Vite 或 Astro 项目。

站点输出目录为：

```txt
dbggm-site
```

核心页面采用目录 URL 结构，例如：

```txt
/open-account/
/deposit-guide/
/withdrawal-guide/
/account-types/
/mt4-mt5-guide/
/faq/
/risk-disclosure/
/about/
```

## 2. 启动命令

本地预览命令：

```bash
npm run dev
```

该命令实际执行：

```bash
python3 -m http.server 4199 --directory dbggm-site
```

本地访问地址：

```txt
http://127.0.0.1:4199/
```

## 3. 构建命令

构建/上线前检查命令：

```bash
npm run build
```

该命令执行静态站点检查：

```bash
node scripts/verify-static-site.mjs
```

## 4. 构建是否通过

已通过。

执行结果：

```txt
Static site verification passed.
Checked site directory: dbggm-site
Checked core routes: /, /open-account/, /deposit-guide/, /withdrawal-guide/, /account-types/, /mt4-mt5-guide/, /faq/, /risk-disclosure/, /about/
```

## 5. 已检查页面

已检查以下核心页面：

```txt
/
/open-account/
/account-types/
/deposit-guide/
/withdrawal-guide/
/mt4-mt5-guide/
/risk-disclosure/
/faq/
/about/
/404.html
```

同时检查了详细教程页面：

```txt
/guides/
/guides/mt-account-register-mobile/
/guides/mt-account-register-pc/
/guides/unionpay-deposit-mobile/
/guides/unionpay-deposit-pc/
/guides/usdt-deposit-mobile/
/guides/usdt-deposit-pc/
/guides/unionpay-withdrawal-mobile/
/guides/unionpay-withdrawal-pc/
/guides/usdt-withdrawal-mobile/
/guides/usdt-withdrawal-pc/
```

浏览器级检查结果：

```txt
21 个 HTML 页面
手机端和桌面端共 42 次打开
状态码：200
横向滚动：未发现
破图：未发现
H1：正常
```

## 6. 已发现并修复的问题

本次为部署整理，未修改业务正文和页面设计。

已补充部署所需文件：

```txt
package.json
vercel.json
scripts/verify-static-site.mjs
```

已确认：

```txt
robots.txt 存在，并声明 sitemap 地址
sitemap.xml 存在，并包含核心页面和详细教程页面
404.html 存在
站点内链未使用 .html
站点输出中未发现 127.0.0.1、localhost、本地路径、MarketHubX
站点输出中未发现“保证收益、稳赚、无风险、包盈利”等违规表达
JSON-LD 语法检查通过
图片资源检查通过
```

## 7. 是否存在遗留问题

未发现阻止部署到 Vercel 的遗留问题。

注意：当前联系二维码区域仍是前端占位样式。如果后续要正式接入真实 QQ、WhatsApp、Telegram 或邮箱二维码，可以替换对应二维码资源，但这不影响静态站点部署。

## 8. 是否可以部署到 Vercel

可以。

当前项目已经可以上传 GitHub，并通过 Vercel 导入部署。

## 9. Vercel 导入时建议填写的 Build Command

```bash
npm run build
```

## 10. Vercel 导入时建议填写的 Output Directory

```txt
dbggm-site
```

## 11. 是否需要环境变量

不需要。

当前网站是纯静态站点，没有服务端接口、数据库或私密 API Key。

## 12. 如果需要环境变量，请列出名称

当前不需要环境变量。
