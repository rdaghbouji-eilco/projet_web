// utils/charts.js
export function createChart(ctxId, type, labels = [], data = [], options = {}) {
    const ctx = document.getElementById(ctxId).getContext('2d');
    return new Chart(ctx, {
        type,
        data: {
            labels,
            datasets: [{
                data,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
            }],
        },
        options,
    });
}

export function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}