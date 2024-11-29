
// GitHub URL to the data file

const GITHUB_FILE_URL = 'https://raw.githubusercontent.com/TSiD-KN/ruihan/main/fund_data.json';

// Fetch data and generate the graph
async function fetchDataAndCreateChart() {
    try {
        const response = await fetch(GITHUB_FILE_URL);
        const data = await response.json();  // Parse the JSON directly

        // Parse timestamps and prices
        const timestamps = data.map(row => row['timestamp']);
        const bidPrices = data.map(row => parseFloat(row['bid_price']));
        const offerPrices = data.map(row => parseFloat(row['offer_price']));

        // Create the chart
        createChart(timestamps, bidPrices, offerPrices);
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

// Create a chart using Chart.js
function createChart(labels, bidData, offerData) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Bid Price',
                    data: bidData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                },
                {
                    label: 'Offer Price',
                    data: offerData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Hourly Comparison of Bid and Offer Prices',
                },
            },
        },
    });
}

// Load the graph on page load
fetchDataAndCreateChart();
