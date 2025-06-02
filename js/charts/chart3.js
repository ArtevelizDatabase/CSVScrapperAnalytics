// Chart 3: User Percentage Pie Chart
const UserPercentageChart = {
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
          formatter: (value, context) => { const total = context.dataset.data.reduce((a, b) => a + b, 0); const percentage = ((value / total) * 100).toFixed(1); return percentage > 5 ? `${percentage}%` : ""; },
          font: { weight: "bold", size: 10 }, color: "#fff",
        },
      },
    };
    const mergedOptions = { ...defaultOptions, ...options };
    try {
      this.instance = new window.Chart(ctx.getContext("2d"), { type: "pie", data, options: mergedOptions });
      console.log("UserPercentageChart created successfully via chart3.js");
      return this.instance;
    } catch (e) { console.error("Error creating UserPercentageChart:", e); return null; }
  },
  update(newData) { if (this.instance) { this.instance.data = newData; this.instance.update(); } },
  destroy() { if (this.instance) { this.instance.destroy(); this.instance = null; } },
  changeType(newType) { if (this.instance) { this.instance.config.type = newType; this.instance.update(); } },
  updateOptions(newOptions) { if (this.instance) { Object.assign(this.instance.options, newOptions); this.instance.update(); } },
};
window.UserPercentageChart = UserPercentageChart;
console.log("chart3.js loaded: UserPercentageChart is now global.");