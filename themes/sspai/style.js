const Style = () => {
  return (
    <style jsx global>{`
      /* 背景改为极简浅灰白 */
      body {
        background-color: #f4f7f9 !important;
      }

      /* 少数派风格卡片：去阴影，改细边框 */
      #theme-heo .notion-next-card, 
      #theme-heo .article {
        border: 1px solid #e2e8f0 !important;
        box-shadow: none !important;
        border-radius: 8px !important;
        background-color: #ffffff !important;
      }

      /* 鼠标悬停微调：颜色变深一点，模拟点击感 */
      #theme-heo .notion-next-card:hover {
        border-color: #cbd5e1 !important;
      }

      /* 少数派标准红点缀 (#e51e16) */
      .text-indigo-600 { color: #e51e16 !important; }
      .bg-indigo-600 { background-color: #e51e16 !important; }
      
      /* 滚动条美化 */
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 20px;
      }

      /* 首页顶部英雄区背景微调 */
      #theme-heo #wrapper-outer {
        margin-top: 1rem;
      }
    `}</style>
  )
}
export { Style }
