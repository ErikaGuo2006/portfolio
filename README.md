# Atako Uesugi 个人作品集交互原型

直接双击 index.html 即可离线体验。全部资源都在本目录，不需要安装 Skills、依赖包或创建账号。

已实现：
- 封面四个物品导航：酒杯（个人信息）、苹果（插画）、蝴蝶结（UI）、鸢尾花（游戏）。
- 悬停放大、浅黄色外描边、键盘聚焦反馈。
- 蓝色封面上的实时水面：曲面反光、透光波纹、鼠标拖动产生的波纹叠加与自然衰减；手机触碰也可触发。
- 同一组物品随页面滚动移动和缩放到顶部目录。
- 点击目录平滑跳转；当前章节彩色，其他浅蓝；章节随滚动更新。
- 内容保持原生滚动；桌面在下一章节边界附近继续向下滚动，会平滑吸附到下一章节；手机自然连续浏览。
- 插画瀑布流、委托作品与同人创作分类、点击放大；UI 与游戏的项目详情弹窗。
- 手机布局、键盘导航、Esc 关闭弹窗、减少动效、系统减少动态效果偏好。

当前为本地原型，尚未公开发布。人物、图标和项目封面仍为占位图形；插画区已接入 9 张委托作品及 7 张同人创作，全部为用户提供原图。文案整理自用户提供的资料；没有添加工作经历。社交地址、实机视频、其他正式项目素材、试玩下载文件尚待补充。

## 后续替换素材

1. 人物：将正式透明 PNG / WebP 放入 assets/，在 content.js 中修改 character.idle。
2. 四种拿物品姿势：填写 character.poses 对应 about、illustrations、ui-design、games 的路径。资源为空时使用默认人物。现阶段仅有轻微姿态反馈，不包含最终持物动作。
3. 图标：app.js 的 icons 定义了四个矢量占位。最终可以把 object-art 与 next-icon 内部的 SVG 替换成透明图片；保留外层导航与按钮属性即可继续使用悬停和滚动逻辑。
4. 插画：修改 content.js 的 illustrations，填写标题、category（commissioned / fan-art）、图片 src、展示高宽比 ratio。可自由增减数量。
5. 项目：content.js 的 projects 支持 images（路径数组）、video、download。填入资源后，项目弹窗自动显示。
6. 社交：目前显示为待补充文字。确认真实主页后替换成链接。

PSD 请保留人物、四件物品、不同姿势和背景的独立图层；网站使用导出的透明图片，不直接渲染 PSD。不同姿势建议使用同样的画布与人物对齐基准，避免切换跳位。

## 文件

- index.html：结构与主要文案
- styles.css：蓝白配色、响应式布局与悬停样式
- app.js：滚动目录、水面输入、导航、筛选和详情
- water.js：独立水面渲染与波纹模拟（WebGL，附 Canvas 2D 降级）
- content.js：素材入口与项目资源
- assets/character.svg：人物占位

如果需要本地网址预览，在此文件夹运行 Python 的静态文件服务；也可直接打开 index.html。没有联网字体、追踪、分析或外部资源依赖。

## 水面更新

水面使用本地实时渲染，不依赖参考视频、截图或联网纹理。只对蓝色背景生效，人物、文字和图形目录保持独立。水面离开视口或标签页进入后台后暂停；“减少动效”会显示静态水面。手机保留纵向滚动，同时支持触碰和横向划动扰动水面。

content.js 中 water.caustics 控制波光明亮程度，water.strength 控制波纹的视觉起伏，均可继续调整。

## 插画分类

委托作品（Commissioned Work）：9 张；同人创作（Fan Art）：7 张。默认展示委托作品。当前使用中性编号作为标题，没有添加未经提供的客户、角色或项目名称。所有图片保留原始像素、比例和水印；通过懒加载减少首次载入量，点击作品可预览并打开完整原图。

## 自我介绍

自我介绍已替换为用户确认中文文案的英文译文。优先展示 Atako Uesugi，正文保留 Yilin / Erika、321jump、ph3nol 和 sslx；页面标题、封面署名及页脚已同步。教育背景和联系方式保留。

## 插画列表排版

插画列表为双列纯图片瀑布流。已移除展示性大标题、介绍句及图片下方文字；分类筛选与点击原图保留。参照用户的小红书截图，列间距、纵向间距及圆角均采用约 5 CSS 像素；两侧留 5 像素边距，图片继续按原始比例展示。


## Editorial typography
Headlines use locally hosted Bodoni Moda (regular / italic variable) and Barlow Condensed SemiBold from Google Fonts. Body copy uses the system sans-serif stack. Font files and their SIL Open Font License notices are included in assets/fonts/. Desktop text follows a two-column editorial grid; mobile uses a single readable column with 14px body copy and 1.65 line height.


## Local layout editor
Open the site on localhost, 127.0.0.1, or from a local file. Click **Edit layout** at the bottom right, then select text on the page or from the **Selected text** menu. Adjust font size, line height, letter spacing, width, margins, alignment, or typeface. Changes save automatically in this browser's local storage; **Save locally** repeats the save. Desktop (>680px) and mobile (<=680px) adjustments are separate. Resize the browser to switch between them.

**Undo** reverses edits. **Reset selected text** resets the selected element for the current screen size. **Reset all** clears both screen-size profiles and can be undone in the same editing session. **Export settings** downloads `atako-layout-settings.json`; send this file back for permanent integration, or import it in another browser. Export before clearing browser storage or changing origin/port. Edits are not automatically written back to the source files. The panel is hidden on public hostnames. Use **Finish editing** to preview without selection outlines.

The display family is now **Noto Serif SC Black (900)**, with a small Latin subset for the English interface and the complete variable font as a Chinese fallback. Barlow Condensed remains for condensed headings. Noto's OFL license is bundled in assets/fonts/.


## Contact ending
The final contact section includes telephone and email actions plus X, Discord, Instagram, and Xiaohongshu links supplied by the owner. Replace `.contact-character` with the final transparent character image when ready. The signature palette uses #2752C2, #7CF6FF, #D9D9D9, #FFE76B, and the specified #F1ABB1. Contact icons are inline single-color SVGs.


2026-11-03 update: contact artwork/buttons use a 60/40 layout without a visible heading; signature colors follow About with thin oversized hex labels; three fixed eight-point stars share the cover/content color transition.
