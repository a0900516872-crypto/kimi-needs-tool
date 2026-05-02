// ========================================
// 飛计划 STUDIO — 案例配置
// 在这里填入你自己的真实案例
// ========================================

export interface CaseData {
  name: string;        // 案例编号或名称，如 "案例 01" 或 "翡翠湾私宅"
  quote: string;       // 客户评价/引言
  image: string;       // 案例图片路径，放在 public/images/ 下
}

// 替换下面这些案例为你自己的真实项目
export const cases: CaseData[] = [
  {
    name: '案例 01',
    quote: '"他们不只是装修了一套房，而是给了我们一个全新的生活方式。"',
    image: '/images/module-a.jpg',  // 替换为你自己的案例图
  },
  {
    name: '案例 02',
    quote: '"从第一次见面到交付，每一步都让我觉得自己被真正理解了。"',
    image: '/images/module-c.jpg',  // 替换为你自己的案例图
  },
  {
    name: '案例 03',
    quote: '"这个家的每一个角落，都藏着只属于我们的记忆。"',
    image: '/images/module-d.jpg',  // 替换为你自己的案例图
  },
];
