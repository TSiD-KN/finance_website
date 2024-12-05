
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

// Modify existing code to integrate the new filter and comparison
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = JSON.parse(event.target.result);
            const filteredData = filterLast24Hours(data); // Apply filter here

            // Calculate percentage changes for the fund data
            const fundPercentageChanges = calculatePercentageChange(filteredData);

            // Placeholder for S&P 500 data; replace this with actual data loading logic
            const sp500Data = [...filteredData]; // Assume similar structure for example purposes
            const sp500PercentageChanges = calculatePercentageChange(sp500Data);

            const timestamps = filteredData.slice(1).map(item => new Date(item.timestamp).toLocaleTimeString());

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
                    maintainAspectRatio: true
                }
            });
        };
        reader.readAsText(file);
    }
});
