
// GitHub URL to the data file
const GITHUB_FILE_URL = 'https://raw.githubusercontent.com/TSiD-KN/ruihan/main/data.xlsx';

// Fetch data and generate the graph
async function fetchDataAndCreateChart() {
    try {
        const response = await fetch(GITHUB_FILE_URL);
        const dataBlob = await response.blob();
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Parse timestamps and prices
            const timestamps = jsonData.map(row => row['Timestamp']);
            const bidPrices = jsonData.map(row => parseFloat(row['Bid Price']));
            const offerPrices = jsonData.map(row => parseFloat(row['Offer Price']));

            // Create the chart
            createChart(timestamps, bidPrices, offerPrices);
        };

        reader.readAsBinaryString(dataBlob);
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
