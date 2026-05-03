// ========================================
// 飛计划 STUDIO — Design Discovery
// 五幕结构：建立信任 → 仪式过渡 → 引导访谈 → 收尾
// 所有文字面向客户，第一人称口语化，像在聊天
// ========================================

export interface SlideData {
  type: 'cover' | 'philosophy' | 'case' | 'transition' | 'chapter-intro' | 'question' | 'review' | 'end';
  act: number;
  chapter?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  guide?: string;
  image?: string;
  caseName?: string;
  caseQuote?: string;
}

import { cases } from './cases';

// ======== 第一幕 · 认识彼此 ========
const ACT1: SlideData[] = [
  {
    type: 'cover',
    act: 1,
    title: '飛计划 STUDIO',
    subtitle: 'Design Discovery',
    content: '用对话，找到家的起点',
    image: '/images/module-a.jpg',
  },
  {
    type: 'philosophy',
    act: 1,
    title: '关于我们',
    subtitle: '',
    content: '我们不定义风格，只定义属于你的生活。\n\n每一个空间背后，都有一段独特的故事。好的设计不是强加审美，而是把你理想中的生活场景，一点点还原到现实里。',
    image: '/images/module-b.jpg',
  },
  // 案例从 cases.ts 读取，可自行替换
  ...cases.map((c) => ({
    type: 'case' as const,
    act: 1,
    title: '代表案例',
    subtitle: '',
    caseName: c.name,
    caseQuote: c.quote,
    image: c.image,
  })),
];

// ======== 第二幕 · 开始进入 ========
const ACT2: SlideData[] = [
  {
    type: 'transition',
    act: 2,
    title: '接下来，',
    subtitle: '我想听听你的故事',
    content: '没有标准答案，也没有对错。\n\n你接下来说的每一句话，都会成为这个家的设计线索。',
  },
];

// ======== 第三幕 · 聊聊生活 ========
const ACT3: SlideData[] = [
  // 章节1 · 你和你的家
  {
    type: 'chapter-intro',
    act: 3,
    chapter: '1',
    title: '你和你的家',
    subtitle: '',
    image: '/images/module-a.jpg',
  },
  {
    type: 'question', act: 3, chapter: '1',
    title: '家里住几口人？可以简单介绍一下每个人吗？',
    guide: '从谁开始都可以——他/她在家最常待的地方是哪里？',
    image: '/images/module-a.jpg'
  },
  {
    type: 'question', act: 3, chapter: '1',
    title: '这次为什么换房？是什么让你决定重新设计这个家？',
    guide: '一个新生命到来？工作的变动？还是单纯觉得是时候改变了？',
    image: '/images/module-a.jpg'
  },
  {
    type: 'question', act: 3, chapter: '1',
    title: '现在住的房子，有没有三个你觉得"幸好有它"的地方？',
    guide: '哪怕是很小的细节——一束光、一个角落、一种动线，都可以说。',
    image: '/images/module-a.jpg'
  },
  {
    type: 'question', act: 3, chapter: '1',
    title: '反过来，有没有三个你每次想到就叹气的地方？',
    guide: '收纳不够？光线太暗？动线绕远？说出来就是改变的开始。',
    image: '/images/module-a.jpg'
  },

  // 章节2 · 一天的节奏
  {
    type: 'chapter-intro',
    act: 3,
    chapter: '2',
    title: '一天的节奏',
    subtitle: '',
    image: '/images/module-c.jpg',
  },
  {
    type: 'question', act: 3, chapter: '2',
    title: '工作日早上，你在家做的第一件事是什么？',
    guide: '煮咖啡？洗漱？还是直接坐在沙发上发呆五分钟？',
    image: '/images/module-c.jpg'
  },
  {
    type: 'question', act: 3, chapter: '2',
    title: '下班回家推开门，你通常会先走向哪里？',
    guide: '直奔厨房做晚餐，还是瘫倒在沙发上？这个本能反应很重要。',
    image: '/images/module-c.jpg'
  },
  {
    type: 'question', act: 3, chapter: '2',
    title: '晚上睡觉前，你会在家做些什么？',
    guide: '看书？追剧？陪孩子？还是独自在阳台发会儿呆？',
    image: '/images/module-c.jpg'
  },
  {
    type: 'question', act: 3, chapter: '2',
    title: '周末的一天，和平时最大的不同是什么？',
    guide: '终于可以慢下来吃早餐，还是家里会涌进一群朋友？',
    image: '/images/module-c.jpg'
  },

  // 章节3 · 你心中的画面
  {
    type: 'chapter-intro',
    act: 3,
    chapter: '3',
    title: '你心中的画面',
    subtitle: '',
    image: '/images/module-d.jpg',
  },
  {
    type: 'question', act: 3, chapter: '3',
    title: '看到这些氛围图，有哪几张让你多停了一眼？',
    guide: '不用解释为什么，凭直觉就好——第一眼被吸引的，往往就是内心真正想要的。',
    image: '/images/module-d.jpg'
  },
  {
    type: 'question', act: 3, chapter: '3',
    title: '那张图打动你的，是什么感觉？温暖？安静？还是开阔？',
    guide: '描述不出来的话，可以用身体感受——站在里面会想深呼吸，还是想蜷缩起来？',
    image: '/images/module-d.jpg'
  },
  {
    type: 'question', act: 3, chapter: '3',
    title: '小时候的家，或者外婆家，有没有一个到现在都忘不了的角落？',
    guide: '午后阳光照进来的位置，某个柜子里的味道—— anything。',
    image: '/images/module-d.jpg'
  },
  {
    type: 'question', act: 3, chapter: '3',
    title: '有没有一件家具或者物件，是一定要带进新家的？',
    guide: '一张旧沙发、一盏灯、一幅画——它承载了什么样的故事？',
    image: '/images/module-d.jpg'
  },

  // 章节4 · 那些绕不开的事
  {
    type: 'chapter-intro',
    act: 3,
    chapter: '4',
    title: '那些绕不开的事',
    subtitle: '',
    image: '/images/module-e.jpg',
  },
  {
    type: 'question', act: 3, chapter: '4',
    title: '上一套房子，如果重来一次，你最想修正的一个决定是什么？',
    guide: '不用自责，只是想听听——那个遗憾让我们知道这次要避开什么。',
    image: '/images/module-e.jpg'
  },
  {
    type: 'question', act: 3, chapter: '4',
    title: '这次的设计里，有哪些是你绝对不会让步的坚持？',
    guide: '"必须有独立书房"，或者"厨房必须是开放式的"——这些是我们的红线。',
    image: '/images/module-e.jpg'
  },
  {
    type: 'question', act: 3, chapter: '4',
    title: '家里有没有需要特别照顾的人或事？老人、孩子、宠物，或者什么习惯？',
    guide: '一个老人需要无障碍设施？一只猫需要晒太阳的位置？这些细节很重要。',
    image: '/images/module-e.jpg'
  },

  // 章节5 · 未来的某个早晨
  {
    type: 'chapter-intro',
    act: 3,
    chapter: '5',
    title: '未来的某个早晨',
    subtitle: '',
    image: '/images/module-b.jpg',
  },
  {
    type: 'question', act: 3, chapter: '5',
    title: '想象一下，新家完工后的第一个周末早晨，你会在哪里、做什么？',
    guide: '阳光从哪个方向照进来？你在厨房还是在阳台？身边有谁？尽量具体。',
    image: '/images/module-b.jpg'
  },
  {
    type: 'question', act: 3, chapter: '5',
    title: '一年后的今天，你希望你在这个家里最常回忆起的是哪个瞬间？',
    guide: '这是一种倒推的思考——从未来回望现在，什么才是最重要的。',
    image: '/images/module-b.jpg'
  },
];

// ======== 第四幕 · 感谢 ========
const ACT4: SlideData[] = [
  {
    type: 'review',
    act: 4,
    title: '关键信息回顾',
    subtitle: '',
    content: '感谢你今天的坦诚分享。\n\n这些话语会被整理成一份「你想要的家」的设计蓝图，在接下来的方案里，一一回应。',
  },
  {
    type: 'end',
    act: 4,
    title: '飛计划STUDIO 会用设计回应你今天说的每一句话。',
    subtitle: '',
    content: '',
  },
];

// ======== Export all slides ========
export function buildSlides(): SlideData[] {
  return [...ACT1, ...ACT2, ...ACT3, ...ACT4];
}

export function getActLabel(act: number): string {
  // 对客户显示克制的标签，不要暴露内部幕次结构
  const labels: Record<number, string> = {
    1: '',  // 开始部分，不显示标签
    2: '',  // 过渡，不显示标签
    3: '',  // 访谈部分，显示章节名即可
    4: '',  // 结束部分，不显示标签
  };
  return labels[act] || '';
}

export function getChapterLabel(chapter: string | undefined): string {
  if (!chapter) return '';
  const labels: Record<string, string> = {
    '1': '你和你的家',
    '2': '一天的节奏',
    '3': '你心中的画面',
    '4': '那些绕不开的事',
    '5': '未来的某个早晨',
  };
  return labels[chapter] || '';
}

export function getSlideLabel(slide: SlideData): string {
  if (slide.type === 'chapter-intro' || slide.type === 'question') {
    return getChapterLabel(slide.chapter);
  }
  if (slide.type === 'case') return '代表案例';
  if (slide.type === 'philosophy') return '关于我们';
  return '';
}