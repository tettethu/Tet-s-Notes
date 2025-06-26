window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],     // 行内公式识别
    displayMath: [['$$', '$$'], ['\\[', '\\]']],   // 块级公式识别
    macros: {
      xRightarrow: ["\\mathrel{\\Rightarrow^{\\text{#1}}}", 1]
    }
  },
  svg: {
    fontCache: 'global'
  }
};
