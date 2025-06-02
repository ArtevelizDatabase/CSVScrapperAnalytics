// Chart 6: Category Distribution (Doughnut Chart)
const CategoriesChart = {
  instance: null,
  create(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (!window.Chart) return null;
    const defaultOptions = {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "bottom", labels: { padding: 15, usePointStyle: true, boxWidth: 8, font: { size: 10 } } },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.7)", titleFont: { size: 12 }, bodyFont: { size: 11 }, padding: 10,
          callbacks: { label: (context) => { const total = context.dataset.data.reduce((a, b) => a + b, 0); const percentage = ((context.parsed / total) * 100).toFixed(1); return `${context.label}: ${context.parsed} (${percentage}%)`; } },
        },
        datalabels: {
          formatter: (value, context) => { const total = context.dataset.data.reduce((a, b) => a + b, 0); const percentage = ((value / total) * 100).toFixed(1); return percentage > 3 ? `${percentage}%` : ""; },
          font: { weight: "bold", size: 9 }, color: "#fff",
        },
      },
    };
    const mergedOptions = { ...defaultOptions, ...options };
    try {
      this.instance = new window.Chart(ctx.getContext("2d"), { type: "doughnut", data, options: mergedOptions });
      console.log("CategoriesChart created successfully via chart6.js");
      return this.instance;
    } catch (e) { console.error("Error creating CategoriesChart:", e); return null; }
  },
  update(newData) { if (this.instance) { this.instance.data = newData; this.instance.update(); } },
  destroy() { if (this.instance) { this.instance.destroy(); this.instance = null; } },
  changeType(newType) { if (this.instance) { this.instance.config.type = newType; this.instance.update(); } },
  updateOptions(newOptions) { if (this.instance) { Object.assign(this.instance.options, newOptions); this.instance.update(); } },
};
window.CategoriesChart = CategoriesChart;
console.log("chart6.js loaded: CategoriesChart is now global.");