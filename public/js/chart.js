document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('logChart').getContext('2d');
    const periodSelect = document.getElementById('periodSelect');

    let chart;

    async function fetchData(period = 'daily') {
        const response = await fetch(`/logs/stats?period=${period}`);
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("err");
        }
        return {
            labels: data.map(d => d._id || "Unknown"),
            values: data.map(d => d.totalHours || 0)
        };
    }

    async function updateChart(period = 'daily') {
      const { labels, values } = await fetchData(period);

      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: `Hours spent (${period})`,
            data: values,
            backgroundColor: 'rgba(75, 190, 190, 0.5)'
          }]
        }
      });
    }

    updateChart();

    periodSelect.addEventListener('change', function () {
      updateChart(this.value);
    });
  });
