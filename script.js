
// Function to calculate percentage change
function calculatePercentageChange(data) {
    return data.slice(1).map((entry, index) => {
        const prev = parseFloat(data[index].bid_price);
        const current = parseFloat(entry.bid_price);
        return ((current - prev) / prev) * 100;
    });
}

// Function to filter data from the last 24 hours
function filterLast24Hours(data) {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return data.filter(entry => {
        const entryTime = new Date(entry.timestamp);
        return entryTime > last24Hours;
    });
}

// Global variables to store uploaded data
let fundData = null;
let sp500Data = null;

// Function to render the chart
function renderChart() {
    if (fundData && sp500Data) {
        const filteredFundData = filterLast24Hours(fundData);
        const fundPercentageChanges = calculatePercentageChange(filteredFundData);

        const filteredSP500Data = filterLast24Hours(sp500Data);
        const sp500PercentageChanges = calculatePercentageChange(filteredSP500Data);

        const timestamps = filteredFundData.slice(1).map(item => new Date(item.timestamp).toLocaleTimeString());

        const ctx = document.getElementById('priceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Fund Hourly % Change',
                        data: fundPercentageChanges,
                        borderColor: 'blue',
                        fill: false
                    },
                    {
                        label: 'S&P 500 Hourly % Change',
                        data: sp500PercentageChanges,
                        borderColor: 'green',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.raw.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Event listener for fund data
document.getElementById('fund-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            fundData = JSON.parse(event.target.result);
            renderChart();
        };
        reader.readAsText(file);
    }
});

// Event listener for S&P 500 data
document.getElementById('sp500-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            sp500Data = JSON.parse(event.target.result);
            renderChart();
        };
        reader.readAsText(file);
    }
});
