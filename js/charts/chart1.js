// Chart 1: Top Users by Products (Horizontal Bar Chart)
const TopUsersChart = {
  instance: null,

  create(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.warn(`Canvas with ID ${canvasId} not found.`);
      return null;
    }

    if (!window.Chart) { // Pastikan Chart.js dari CDN sudah dimuat
      console.error("Chart.js not loaded from CDN.");
      return null;
    }
    // Chart.js dan chartjs-plugin-datalabels sudah global
    // Chart.register(ChartDataLabels); // Tidak perlu jika plugin dimuat via CDN setelah Chart.js

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.7)",
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
          padding: 10,
        },
        datalabels: { // Konfigurasi dari chartjs-plugin-datalabels
          anchor: "end",
          align: "right",
          formatter: (value) => (value > 0 ? value.toLocaleString() : null),
          font: { weight: "bold", size: 10 },
          color: "#333",
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: "Number of Products", font: { size: 11 } },
          grid: { color: "rgba(0,0,0,0.05)" },
          ticks: { font: { size: 10 }, callback: (value) => value.toLocaleString() },
        },
        y: {
          title: { display: true, text: "User / Author", font: { size: 11 } },
          grid: { display: false },
          ticks: { font: { size: 10 } },
        },
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      this.instance = new window.Chart(ctx.getContext("2d"), { // Gunakan window.Chart
        type: "bar",
        data,
        options: mergedOptions,
      });
      console.log("TopUsersChart created successfully via chart1.js");
      return this.instance;
    } catch (error) {
      console.error("Error creating TopUsersChart:", error);
      return null;
    }
  },

  update(newData) {
    if (this.instance) {
      this.instance.data = newData;
      this.instance.update();
    }
  },

  destroy() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  },

  changeType(newType) {
    if (this.instance) {
      this.instance.config.type = newType;
      this.instance.update();
    }
  },

  updateOptions(newOptions) {
    if (this.instance) {
      Object.assign(this.instance.options, newOptions);
      this.instance.update();
    }
  },
};

window.TopUsersChart = TopUsersChart; // Buat objek tersedia secara global
console.log("chart1.js loaded: TopUsersChart is now global.");