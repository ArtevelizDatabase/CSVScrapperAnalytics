// Chart 2: Top Product Titles (Horizontal Bar Chart)
const TopProductTitlesChart = {
  instance: null,
  create(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (!window.Chart) return null;

    const defaultOptions = {
      responsive: true, maintainAspectRatio: false, indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "rgba(0,0,0,0.7)", titleFont: { size: 12 }, bodyFont: { size: 11 }, padding: 10 },
        datalabels: { anchor: "end", align: "right", formatter: (value) => (value > 0 ? value.toLocaleString() : null), font: { weight: "bold", size: 10 }, color: "#333" },
      },
      scales: {
        x: { beginAtZero: true, title: { display: true, text: "Upload Count", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 10 }, callback: (value) => value.toLocaleString() } },
        y: { title: { display: true, text: "Product Title", font: { size: 11 } }, grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    };
    const mergedOptions = { ...defaultOptions, ...options };
    try {
      this.instance = new window.Chart(ctx.getContext("2d"), { type: "bar", data, options: mergedOptions });
      console.log("TopProductTitlesChart created successfully via chart2.js");
      return this.instance;
    } catch (e) { console.error("Error creating TopProductTitlesChart:", e); return null; }
  },
  update(newData) { if (this.instance) { this.instance.data = newData; this.instance.update(); } },
  destroy() { if (this.instance) { this.instance.destroy(); this.instance = null; } },
  changeType(newType) { if (this.instance) { this.instance.config.type = newType; this.instance.update(); } },
  updateOptions(newOptions) { if (this.instance) { Object.assign(this.instance.options, newOptions); this.instance.update(); } },
};
window.TopProductTitlesChart = TopProductTitlesChart;
console.log("chart2.js loaded: TopProductTitlesChart is now global.");