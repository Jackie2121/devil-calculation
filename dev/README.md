# 魔鬼计算 · 开发源文件

成品是根目录下的单文件网页：

- `../魔鬼计算.html`

修改源文件后重新生成：

```bash
node build.mjs
```

引擎测试：

```bash
node test-engine.mjs
```

文件说明：

- `index.html`：页面结构（开发时引用外部 CSS/JS）
- `styles.css`：亮色/暗色主题、响应式布局
- `engine.js`：普通 25 题 / 0–9 无尽关的出题与会话逻辑
- `app.js`：界面状态、交互、主题、记录
- `build.mjs`：把 CSS/JS 内联成单文件成品
- `test-engine.mjs`：题目范围、N-back 队列、存储与最佳成绩测试
