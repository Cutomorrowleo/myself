/* ============================================
   I18N.JS - Persistent bilingual UI
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio-language';
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let currentLanguage = localStorage.getItem(STORAGE_KEY) === 'zh' ? 'zh' : 'en';
  let applying = false;

  const zh = {
    'Skip to content': '跳转到主要内容',
    'Home': '主页',
    'Work': '作品',
    'Play': '互动',
    'About': '关于',
    'Contact': '联系',
    'Non-Linear': '非线性',
    'Creative.': '创意。',
    'Design Engineer · Brand & Web · Built with Claude Code': '设计工程师 · 品牌与网站 · 使用 Claude Code 构建',
    'Web Design & Dev': '网站设计与开发',
    'Web Design & Development': '网站设计与开发',
    'Websites': '网站',
    'UI/UX': '界面 / 体验',
    'Development': '开发',
    'Brand Identity': '品牌识别',
    'Logos': '标志',
    'Guidelines': '规范',
    'Strategy': '策略',
    'Packaging': '包装设计',
    'Labels': '标签',
    'Dielines': '刀模',
    'Hey, I\'m Shruti': '你好，我是 Shruti',
    'Get to know me →': '了解我 →',
    'Let\'s Talk': '聊聊吧',
    'Good work starts with good conversations.': '好作品始于真诚的交流。',
    'Say hello': '打个招呼',
    'Chai?': '喝杯茶？',
    'Click me, dattebayo!': '点我开始奔跑！',
    'Drag to explore': '拖动探索',
    'Swipe to explore': '滑动探索',
    'Back to Playground': '返回画布',
    'Play': '开始',
    'Visit Website →': '访问网站 →',
    'View Case Study →': '查看案例 →',
    'Projects loading soon.': '项目即将上线。',
    'Nice work!': '做得好！',
    'You found my mark': '你找到了我的标记',
    'Naruto Runner': '火影跑酷',
    'Press space or tap to start. Use up/down arrows to control Naruto.': '按空格键或点击开始，使用上下方向键控制角色。',
    'My story': '我的故事',
    'Architecture → Brand → Web → AI': '建筑 → 品牌 → 网站 → AI',
    'I started in architecture, moved into brand and packaging design, and somewhere along the way fell in love with building for the screen. Now I sit at the intersection of design thinking and emerging technology — making things that feel considered, from the first sketch to the final pixel.': '我从建筑设计出发，随后进入品牌与包装设计领域，也在这段过程中爱上了为屏幕创造体验。如今，我工作在设计思维与新兴技术的交汇处，从第一张草图到最后一个像素，都力求经过认真思考。',
    'I believe the best work happens when craft meets curiosity. I care about the details that most people won\'t notice but everyone will feel — the weight of a typeface, the rhythm of a layout, the moment an interaction earns a smile.': '我相信，最好的作品诞生于技艺与好奇心相遇之时。我在意那些大多数人不会明确注意、却都能感受到的细节：字体的分量、版式的节奏，以及一次互动让人会心一笑的瞬间。',
    'I build with AI the way a photographer works with light — it\'s a medium, not a shortcut. The taste, the decisions, the creative direction? That\'s still very human. That\'s still mine.': '我使用 AI，就像摄影师运用光线。它是一种媒介，而不是捷径。审美、判断与创意方向依然来自人，也依然属于我。',
    'Packaging Systems': '包装系统',
    'Design Systems': '设计系统',
    'Typography': '字体设计',
    'AI-Assisted Development': 'AI 辅助开发',
    'Good work comes from good conversations.': '好作品源于好的交流。',
    'Multidisciplinary Designer · Brand, Visual & Content': '跨领域设计师 · 品牌、视觉与内容',
    'About This Portfolio': '关于这个作品集',
    'About Me': '关于我',
    'Experience': '工作经历',
    'Skills': '专业技能',
    'Notable Projects': '代表项目',
    'Education': '教育经历',
    'This portfolio was built without Figma. No mockups, no handoff, no "I\'ll build it when I\'m ready." Just a mood board, Claude Code, and a designer who finally found a tool that keeps up with how she thinks. I described what I wanted. It built. I reacted. It refined. The result looks exactly like what I imagined — because the creative direction was never outsourced, only the syntax.': '这个作品集没有使用 Figma 制作。没有预先绘制的模型，没有交付流程，也没有“准备好以后再开发”。只有一张情绪板、Claude Code，以及一位终于找到能够跟上自己思考速度的设计师。我描述想法，它负责构建；我做出判断，它继续完善。最终结果与我的设想一致，因为被交给工具的只是语法，而不是创意方向。',
    'Multidisciplinary Designer with 4+ years of experience spanning brand identity, visual systems, content design, and web UI. Brings a rare combination of strategic visual thinking and hands-on execution — from developing brand narratives and visual languages to designing production-ready assets across digital and print surfaces. Architecture-trained, meaning spatial reasoning and attention to detail are instinctive. Has led end-to-end visual projects for global brands and professional communities, maintaining consistency across complex, multi-channel systems. Early adopter of AI-assisted design workflows — uses AI tools to accelerate creative production, iterate faster, and extend visual systems without compromising craft or brand integrity.': '拥有 4 年以上经验的跨领域设计师，工作覆盖品牌识别、视觉系统、内容设计与网页界面。兼具策略性视觉思考与落地执行能力，从品牌叙事和视觉语言，到数字及印刷媒介中的生产级设计资产均可独立完成。建筑教育背景培养了自然的空间推理能力与细节意识。曾为全球品牌和专业社群主导端到端视觉项目，并在复杂的多渠道系统中保持一致性。较早采用 AI 辅助设计流程，在不牺牲工艺和品牌完整性的前提下，加快创意生产、迭代与视觉系统扩展。',
    'Multidisciplinary Designer': '跨领域设计师',
    'Visual Design Consultant': '视觉设计顾问',
    'Visual Experience Consultant': '视觉体验顾问',
    'Brand & Graphic Designer': '品牌与平面设计师',
    'Graphic Designer': '平面设计师',
    'Design Intern': '设计实习生',
    'Jan 2023 — Present': '2023 年 1 月至今',
    'Nov 2024 — Jul 2025': '2024 年 11 月至 2025 年 7 月',
    'Oct 2022 — Apr 2024': '2022 年 10 月至 2024 年 4 月',
    'Jan 2022 — Sep 2022': '2022 年 1 月至 2022 年 9 月',
    'Aug 2021 — Jan 2022': '2021 年 8 月至 2022 年 1 月',
    'Nov 2020 — May 2021': '2020 年 11 月至 2021 年 5 月',
    'Jan 2026': '2026 年 1 月',
    'Independent · Gurugram — Remote': '独立设计师 · 古尔冈 · 远程',
    'Sylva Inc · Remote': 'Sylva Inc · 远程',
    'Mycelium Sona Biotech Pvt. Ltd. · Pune': 'Mycelium Sona Biotech Pvt. Ltd. · 浦那',
    'Loud Mob Media · Pune': 'Loud Mob Media · 浦那',
    'Corporate Culture · Pune': 'Corporate Culture · 浦那',
    'Dream Sports Foundation (Dream11) · Mumbai (Remote)': 'Dream Sports Foundation（Dream11）· 孟买（远程）',
    'Led brand identity, visual design, and content design projects for 10+ clients across B2B SaaS, DTC, and professional media — developing full visual systems including brand narratives, typography, colour, iconography, illustration, and guidelines documentation': '为 B2B SaaS、DTC 和专业媒体领域的 10 多位客户主导品牌识别、视觉与内容设计项目，建立包含品牌叙事、字体、色彩、图标、插画和规范文档的完整视觉系统',
    'Designed and built production web experiences end-to-end — from information architecture and content strategy through high-fidelity UI, motion design, and live implementation using AI-assisted development tools': '端到端设计并构建可上线的网站体验，从信息架构、内容策略到高保真界面、动态设计和 AI 辅助开发落地',
    'Created and maintained visual asset libraries and design systems in Figma — ensuring consistent brand expression across web, marketing, and content surfaces for clients managing distributed teams': '在 Figma 中创建并维护视觉资产库与设计系统，帮助分布式团队在网站、营销和内容界面中保持一致的品牌表达',
    'Produced visual content at scale — thumbnails, campaign assets, pitch decks, and brand collateral — developing strong instincts for what communicates clearly across platforms and contexts': '规模化制作缩略图、活动素材、提案演示和品牌物料，持续提升跨平台、跨场景的清晰沟通能力',
    'Used AI tools (Claude Code, Freepik AI) to accelerate asset creation, visual iteration, and content production — maintaining brand quality and craft while significantly reducing production timelines': '使用 Claude Code、Freepik AI 等工具加速资产制作、视觉迭代和内容生产，在保持品牌质量与工艺的同时显著缩短周期',
    'Provided visual design and brand consultancy for 3 professional community platforms — PreSales Collective, Operators, and conference properties — developing distinct visual identities and content design systems for each': '为 PreSales Collective、Operators 及会议品牌等三个专业社群平台提供视觉与品牌顾问服务，并分别建立独特的视觉识别和内容设计系统',
    'Designed the complete visual language for each platform: brand strategy, typography, colour systems, illustration style, and iconography — producing comprehensive brand guidelines and asset libraries for ongoing team use': '为每个平台设计完整视觉语言，包括品牌策略、字体、色彩系统、插画风格和图标，并输出可供团队长期使用的品牌规范与资产库',
    'Collaborated with product, engineering, and content teams throughout — ensuring visual consistency across web UI, marketing content, and event materials simultaneously': '全程与产品、工程及内容团队协作，确保网页界面、营销内容与活动物料同步保持视觉一致',
    'Led a full brand identity redesign for Mycelium India — developing a new visual language that aligned with the company\'s cutting-edge biotech positioning while maintaining credibility with enterprise clients': '主导 Mycelium India 的完整品牌重塑，建立符合前沿生物科技定位、同时保持企业客户信任感的新视觉语言',
    'Ensured visual consistency across all marketing channels — managing creative direction for digital content, packaging design, product collateral, and brand communications': '统筹数字内容、包装、产品物料与品牌传播的创意方向，确保所有营销渠道的视觉一致性',
    'Managed all creative design aspects of the brand — from brand guidelines and typography systems to marketing materials, product labels, and event design': '负责品牌全部创意设计工作，从品牌规范和字体系统到营销物料、产品标签及活动设计',
    'Designed full brand identities for agency clients across entertainment and tech — logo systems, typography, colour, illustration, iconography, and packaging — producing print-ready production files with accurate colour management and technical specifications.': '为娱乐与科技行业的代理公司客户设计完整品牌识别，包括标志系统、字体、色彩、插画、图标与包装，并输出具备准确色彩管理和技术规范的印刷生产文件。',
    'Produced event design, 3D stage concepts, and marketing collateral — required spatial thinking and the ability to design experiential, large-format visual systems for corporate events.': '制作活动设计、三维舞台概念与营销物料，运用空间思维为企业活动建立体验式的大型视觉系统。',
    'Designed social content and brand templates for India\'s largest fantasy sports platform with 100M+ users — built scalable template systems for consistent, high-volume content production across campaigns.': '为拥有超过一亿用户的印度大型梦幻体育平台设计社交内容和品牌模板，并建立可扩展的模板系统，支持各类活动持续稳定地进行高产量内容制作。',
    'Visual Design': '视觉设计',
    'Content Design': '内容设计',
    'UI Design': '界面设计',
    'Iconography': '图标设计',
    'Illustration': '插画',
    'Motion Design': '动态设计',
    'Packaging Design': '包装设计',
    'Information Architecture': '信息架构',
    'Figma (Advanced)': 'Figma（高级）',
    'AI-Assisted Design': 'AI 辅助设计',
    'Rapid Prototyping': '快速原型',
    'PreSales Collective — Brand Identity & Web': 'PreSales Collective · 品牌识别与网站',
    'Mycelium India — Rebranding': 'Mycelium India · 品牌重塑',
    'Kindred Studio Website': 'Kindred Studio 网站',
    'End-to-end brand identity and web design for a global professional community of 50K+ presales professionals — visual system, content design, course pages, and event marketing all under a unified but flexible design language.': '为拥有五万多名售前专业人士的全球社群完成端到端品牌识别与网站设计，以统一而灵活的设计语言覆盖视觉系统、内容设计、课程页面和活动营销。',
    'Full brand identity redesign for a biotech company — repositioned visual language to reflect cutting-edge technology and premium quality while maintaining scientific credibility across all collaterals.': '为生物科技公司完成完整品牌重塑，在所有物料中保持科学可信度的同时，通过新的视觉语言体现前沿技术与高品质定位。',
    'Designed and built the Kindred studio brand and website — visual identity, content design, and live implementation using AI tools; shipped in under 4 weeks.': '设计并构建 Kindred 工作室品牌与网站，包含视觉识别、内容设计和 AI 辅助开发落地，并在四周内上线。',
    'Bachelor of Architecture (B.Arch)': '建筑学学士（B.Arch）',
    'Lovely Professional University, Punjab': 'Lovely Professional University，旁遮普',
    '5-year programme in spatial design, systems thinking, technical drawing, and visual communication at multiple scales. Foundations that transfer directly to content design, information architecture, and building visual systems with structural rigour.': '五年制课程涵盖空间设计、系统思维、技术制图和多尺度视觉沟通。这些基础可以直接应用于内容设计、信息架构，以及具有严谨结构的视觉系统构建。',
    'a recipe from my kitchen': '来自我的厨房',
    'Ginger Chai': '姜味印度奶茶',
    'the kind that fills the whole house\nwith warmth before the first sip': '第一口还没喝下\n暖意就已充满整个房间',
    'What you\'ll need:': '所需材料：',
    'How to make it:': '制作方法：',
    'Crush the spices': '碾碎香料',
    'Boil with spices & tea': '煮香料与茶叶',
    'Add the milk': '加入牛奶',
    'Let it find its colour': '煮出合适的颜色',
    'Strain & serve': '过滤并享用',
    'Chai is not a beverage. It\'s a ritual, a pause, a conversation starter.': '印度奶茶不只是一杯饮品。它是一种仪式，一次停顿，也是一段谈话的开始。',
    'Creative Director': '创意总监',
    'Industry': '行业',
    'Year': '年份',
    'Sections': '章节',
    'Next Case Study': '下一个案例',
    'The Challenge': '项目挑战',
    'The Approach': '设计方法',
    'The Process': '设计过程',
    'The Result': '项目成果',
    'Process': '设计过程',
    'Outcome': '项目成果',
    'The Brief': '项目简述',
    'Previous project': '上一个项目',
    'Next project': '下一个项目',
    'Previous illustration': '上一幅插画',
    'Next illustration': '下一幅插画',
    'Previous puzzle': '上一个谜题',
    'Next puzzle': '下一个谜题',
    'Reset': '重置',
    'Loading portfolio': '正在加载作品集',
    'Mobile navigation': '移动端导航',
    'Open resume': '打开个人简历',
    'Close resume': '关闭个人简历',
    'Close recipe': '关闭食谱',
    'Social links': '社交链接',
    'Design tools I use': '我使用的设计工具',
    'Interactive portfolio canvas — drag to explore': '互动作品集画布，拖动即可探索',
    'Portfolio elements': '作品集内容',
    'Back to playground': '返回画布'
  };

  function withWhitespace(source, translated) {
    const leading = source.match(/^\s*/)[0];
    const trailing = source.match(/\s*$/)[0];
    return `${leading}${translated}${trailing}`;
  }

  function translateValue(value) {
    if (currentLanguage !== 'zh' || typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed) return value;
    if (zh[trimmed]) return withWhitespace(value, zh[trimmed]);

    const slideMatch = trimmed.match(/^Go to slide (\d+)$/);
    if (slideMatch) return withWhitespace(value, `前往第 ${slideMatch[1]} 张`);

    const viewMatch = trimmed.match(/^View (.+) case study$/);
    if (viewMatch) return withWhitespace(value, `查看 ${viewMatch[1]} 案例`);

    const projectMatch = trimmed.match(/^View project: (.+)$/);
    if (projectMatch) return withWhitespace(value, `查看项目：${projectMatch[1]}`);

    return value;
  }

  function applyTextNode(node) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const next = currentLanguage === 'zh' ? translateValue(source) : source;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function applyAttributes(element) {
    const attributes = ['aria-label', 'title', 'data-tooltip'];
    let stored = originalAttributes.get(element);
    if (!stored) {
      stored = {};
      originalAttributes.set(element, stored);
    }

    attributes.forEach(name => {
      if (!element.hasAttribute(name)) return;
      if (!(name in stored)) stored[name] = element.getAttribute(name);
      const source = stored[name];
      const next = currentLanguage === 'zh' ? translateValue(source) : source;
      if (element.getAttribute(name) !== next) element.setAttribute(name, next);
    });
  }

  function apply(root = document.body) {
    if (!root || applying) return;
    applying = true;

    const elementRoot = root.nodeType === Node.ELEMENT_NODE ? root : document.body;
    applyAttributes(elementRoot);
    elementRoot.querySelectorAll('*').forEach(element => {
      if (!['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) applyAttributes(element);
    });

    const walker = document.createTreeWalker(
      elementRoot,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG'].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) applyTextNode(node);

    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    document.body.classList.toggle('lang-zh', currentLanguage === 'zh');
    updateControl();
    applying = false;
  }

  function updateControl() {
    const control = document.querySelector('.language-switch');
    if (!control) return;
    control.querySelectorAll('[data-language]').forEach(button => {
      const active = button.dataset.language === currentLanguage;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    control.setAttribute(
      'aria-label',
      currentLanguage === 'zh' ? '语言切换，当前为中文' : 'Language switch, English selected'
    );
  }

  function setLanguage(language) {
    const next = language === 'zh' ? 'zh' : 'en';
    if (next === currentLanguage) return;
    currentLanguage = next;
    localStorage.setItem(STORAGE_KEY, currentLanguage);
    apply(document.body);
    window.dispatchEvent(new CustomEvent('portfolio:languagechange', {
      detail: { language: currentLanguage }
    }));
  }

  function bindControl() {
    const control = document.querySelector('.language-switch');
    if (!control) return;
    control.addEventListener('click', event => {
      const button = event.target.closest('[data-language]');
      if (button) setLanguage(button.dataset.language);
    });
    updateControl();
  }

  const observer = new MutationObserver(mutations => {
    if (applying) return;
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) apply(node);
        if (node.nodeType === Node.TEXT_NODE && node.parentElement) apply(node.parentElement);
      });
    });
  });

  window.PortfolioI18n = {
    apply,
    setLanguage,
    getLanguage: () => currentLanguage,
    t: translateValue
  };

  bindControl();
  apply(document.body);
  observer.observe(document.body, { childList: true, subtree: true });
})();
