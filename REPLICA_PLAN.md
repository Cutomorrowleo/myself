# 交互作品集复刻方案

## 设计判断

目标站不是传统纵向落地页，而是一个固定视口中的大型二维画布。用户通过拖拽、触控和滚轮探索作品，卡片点击后进入详情层。视觉上接近 FigJam、剪贴簿和贴纸墙的混合体。

设计参数：

- `DESIGN_VARIANCE: 9`
- `MOTION_INTENSITY: 8`
- `VISUAL_DENSITY: 4`
- 主题：单一浅色主题
- 强调色：黄色为主，珊瑚粉、薄荷绿和天蓝作为内容分组色

## 目标站结构

1. `5000 x 4000` 世界坐标画布
2. 固定视口和点阵背景
3. 绝对定位的英雄文案、作品卡堆、人物贴纸、工具栏与信息卡
4. 基于层级的视觉深度和轻微漂浮动画
5. 鼠标拖拽、触控拖拽、滚轮平移、组合键缩放
6. 惯性移动和导航自动定位
7. 右侧详情面板
8. 桌面悬浮控件和移动端底部导航
9. 首次加载遮罩

## 当前实现

- React 负责内容组件、面板状态和导航。
- 画布连续坐标保存在 `ref`，通过 `requestAnimationFrame` 更新 DOM transform，避免每帧 React 重渲染。
- 项目、关于和联系复用一个侧滑面板。
- 作品卡堆采用三层卡片，在 hover 时扇形展开。
- 三张人物和静物贴纸由 OpenAI 内置图像生成工具生成。
- 生成图先使用绿色纯色背景，再通过本地脚本转换为带 alpha 的 PNG。
- 所有可见内容集中在 `src/App.jsx`，方便替换为真实姓名、项目和联系方式。

## 精确复刻时的内容替换顺序

1. 替换 `projects` 中的标题、介绍、项目分类和链接。
2. 根据最终项目数量调整 `elements` 坐标。
3. 为每个项目生成独立封面，不要重复使用人物贴纸。
4. 补充项目详情页或独立路由。
5. 根据品牌字体替换当前 Manrope 和 Caveat。
6. 用真实社交链接和邮箱替换演示信息。

## 插画生成提示词方向

统一风格关键词：

`hand-drawn editorial sticker illustration, clean black ink outlines, slightly imperfect linework, flat gouache color fills, playful contemporary portfolio aesthetic, white die-cut sticker border`

统一约束：

`no words, no logos, no watermark, compact silhouette, generous padding, no cast shadow`

项目中已生成：

- `public/assets/designer.png`
- `public/assets/chai.png`
- `public/assets/watering.png`

## 运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```
