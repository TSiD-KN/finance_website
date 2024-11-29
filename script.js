document.getElementById('file-input').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/json') {
        alert("Please upload a valid JSON file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = JSON.parse(e.target.result);
        buildGraph(data);
    };
    reader.readAsText(file);
}

function buildGraph(data) {
    // Parse the data
    const labels = [];
    const bidPrices = [];
    const offerPrices = [];

    // Extract hourly data from the last 24 hours
    const now = new Date();
    const cutoff = now.getTime() - 24 * 60 * 60 * 1000;

    data.forEach(item => {
        const timestamp = new Date(item.timestamp);
        if (timestamp.getTime() >= cutoff) {
            const hourLabel = timestamp.getHours() + ":" + (timestamp.getMinutes() < 10 ? '0' : '') + timestamp.getMinutes();
            labels.push(hourLabel);
            bidPrices.push(parseFloat(item.bid_price));
            offerPrices.push(parseFloat(item.offer_price));
        }
    });

    // Create the chart
    const ctx = document.getElementById('priceChart').getContext('2d');
    const priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bid Price',
                data: bidPrices,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                borderWidth: 2
            },
            {
                label: 'Offer Price',
                data: offerPrices,
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hour of Day'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price'
                    },
                    beginAtZero: false
                }
            }
        }
    });

    // Show download button
    document.getElementById('download-btn').style.display = 'block';
    document.getElementById('download-btn').addEventListener('click', () => downloadGraph(priceChart));
}

function downloadGraph(chart) {
    // Convert the chart to a PNG and download it
    const link = document.createElement('a');
    link.href = chart.toBase64Image();
    link.download = 'fund_data_graph.png';
    link.click();
}
