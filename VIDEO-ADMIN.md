# 作品管理后台

入口 `/admin`，视频栏目 `/admin/videos`，图片栏目 `/admin/images`。支持 MP4（最大 2 GiB）、浏览器自动截取视频第一帧作为 JPG 封面、横竖屏识别、三行文字编辑、排序、隐藏。先上传再「保存并显示」。已有七个作品作为初始目录，包括现代居所 · 光影美学。上线后日常增删改展示不需要重新部署；目前仅支持隐藏，不提供永久删除。

## 储存与接口

- `VIDEOS` R2 binding 对应现有 `autaksing-videos` 桶；继续使用 `https://video.autaksing.com/` 公开媒体域名。
- 上传媒体采用 UUID，写入 `website-media/`，不覆盖旧视频。
- 作品目录在 `website-data/videos.json`，首次保存前读取代码内初始作品。
- `GET /api/videos` 返回可展示作品；网页加载时获取。临时接口故障时保留代码内初始作品作为后备。
- `PUT /api/admin/videos` 使用 R2 ETag 条件写入防止多人或多标签互相覆盖。冲突返回 409，需刷新后重新编辑。
- 上传每段 8 MiB，通过 Worker 固定长度原生流直接写入 R2，不在内存中复制整个视频分段，失败分段自动最多重试三次。文件没有全部完成之前不会进入作品目录。
- 前端关闭页面会丢失当前上传进度，并有离开提示；不承诺跨刷新断点续传。取消会中止未完成的 multipart。R2 也会按其默认规则清理未完成上传。
- 自动截封面需要浏览器可以解码文件，推荐 MP4 / H.264。不会自动转码视频。
- 隐藏只影响作品列表，不撤销 R2 文件公开地址；储存桶本来就是公开媒体桶，目录不存密码、Cookie 或其他秘密。

## 登录

仅支持一个管理员账号，无注册接口或用户创建接口。`ADMIN_USERNAME` 与 `ADMIN_PASSWORD` 使用 Cloudflare Worker Secret，不写入代码或 Git。登录密码支持至少 6 个字符。独立的 `ADMIN_SESSION_SECRET` 负责 Cookie 与上传凭证签名，至少 20 个字符，建议随机 32 字符；如旧密码本身够长，也兼容以旧密码签名。签名 Cookie：HttpOnly、SameSite=Strict、正式环境 Secure、8 小时过期。更改账号或密码使旧 Cookie 失效。上传操作同时验证登录和上传签名；所有写请求校验同源 Origin。

`ADMIN_LOGIN_LIMITER` 限制每个来源 IP 每分钟五次登录尝试。未配置密码、储存桶或登录保护时拒绝管理操作。

## 本地预览与测试

1. `.dev.vars` 设置独立本地 `ADMIN_USERNAME`、`ADMIN_PASSWORD` 和随机 `ADMIN_SESSION_SECRET`；文件已经忽略。
2. `npm ci`，`npm run build:cloudflare`。
3. `npm run preview:cloudflare`（构建前先停止预览）。
4. 本地自动使用模拟 R2；媒体通过仅本地开放的 `/api/media/` 路由读取，支持 Range。
5. `node scripts/test-video-admin.mjs` 测试本地 API；只连接 localhost，验证登录、跨源拦截、大小限制、分段上传及重试完成、范围读取、目录保存、版本冲突、隐藏、退出。测试结束恢复原作品目录，测试媒体保留在本地模拟桶。

## 正式发布（待用户授权）

1. 确认 R2 桶 `autaksing-videos` 与视频域名仍关联；现有媒体不做搬迁或删除。
2. 先通过 `wrangler secret put ADMIN_USERNAME --config wrangler.jsonc` 设置管理员账号，再通过 `wrangler secret put ADMIN_PASSWORD --config wrangler.jsonc` 设置正式密码，并通过 `wrangler secret put ADMIN_SESSION_SECRET --config wrangler.jsonc` 设置独立随机会话密钥。通过安全本地文件交付给网站拥有者，不能提交进仓库。
3. 推送代码并执行 `npm run deploy:cloudflare`，保留现有变量。
4. 验证正式登录、匿名拦截、七个原作品；用实际新作品验证一次上传并保存流程。后续上传与修改从后台完成。
5. 不要把本地测试目录或 `.dev.vars` 同步到线上桶。

R2 分段上传参考：https://developers.cloudflare.com/r2/api/workers/workers-multipart-usage/

## 图片作品

图片使用相同管理员账号和 R2 桶，单张最大 20 MiB，支持 JPG、PNG、WebP；拒绝 SVG 与非图片内容。原文件写入 UUID 路径，不修改旧文件。

`POST /api/admin/image-upload` 上传文件；`GET/PUT /api/admin/images` 管理图片目录（同样使用 ETag 防止覆盖）；`GET /api/images` 返回可见图片。目录单独存于 `website-data/images.json`，与视频互不覆盖。

三行文字与视频一致：分类、作品标题、说明。前台 `/graphic-design` 按比例展示并支持点击放大、Escape 关闭。后台可排序、隐藏。

本地浏览器已验证图片上传、保存、前台加载和放大、手机宽度、匿名写入拦截、文件类型拒绝、目录版本冲突。

## 上传反馈

上传阶段与结果保留在按钮附近。失败后保留错误和进度，可以重新上传。视频自动封面读取失败不再阻断 MP4 上传；上传后可手动选择横竖屏，再保存显示。中文文件名可以直接使用，R2 实际存储名由服务器生成。

已用中文名 MP4 验证正常上传、失败提示保留、重试，以及模拟封面读取失败后继续上传。预览服务更新后请刷新页面，以加载新界面。

## 本地数据持久化修复

预览必须使用 `npm run preview:cloudflare`。该脚本显式将 R2 模拟数据保存在项目根目录 `.wrangler/state`，绝对路径传递给 Wrangler，不能留在构建产物 `dist/server/.wrangler` 内。构建会清理 dist。已有的旧模拟存储需在停止服务器后整体复制到根目录 `.wrangler/state`，再启动新预览。重新构建、重启后验证作品目录与已上传媒体均保留。

正式迁移期间确认旧缓冲上传在大文件时触发 Cloudflare 1102，现已用 FixedLengthStream 直接传输到 R2。仍会验证预期分段长度和 MP4 首段文件标识；分段上传与重试集成测试已通过。
