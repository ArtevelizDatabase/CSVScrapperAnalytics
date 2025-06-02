// Chart 5: Status Distribution (Vertical Bar Chart)
const StatusChart = {
  instance: null,
  create(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (!window.Chart) return null;
    const defaultOptions = {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "rgba(0,0,0,0.7)", titleFont: { size: 12 }, bodyFont: { size: 11 }, padding: 10 },
        datalabels: { anchor: "end", align: "top", formatter: (value) => (value > 0 ? value.toLocaleString() : null), font: { weight: "bold", size: 10 }, color: "#333" },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Number of Products", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 10 }, callback: (value) => value.toLocaleString() } },
        x: { title: { display: true, text: "Status", font: { size: 11 } }, grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    };
    const mergedOptions = { ...defaultOptions, ...options };
    try {
      this.instance = new window.Chart(ctx.getContext("2d"), { type: "bar", data, options: mergedOptions });
      console.log("StatusChart created successfully via chart5.js");
      return this.instance;
    } catch (e) { console.error("Error creating StatusChart:", e); return null; }
  },
  update(newData) { if (this.instance) { this.instance.data = newData; this.instance.update(); } },
  destroy() { if (this.instance) { this.instance.destroy(); this.instance = null; } },
  changeType(newType) { if (this.instance) { this.instance.config.type = newType; this.instance.update(); } },
  updateOptions(newOptions) { if (this.instance) { Object.assign(this.instance.options, newOptions); this.instance.update(); } },
};
window.StatusChart = StatusChart;
console.log("chart5.js loaded: StatusChart is now global.");