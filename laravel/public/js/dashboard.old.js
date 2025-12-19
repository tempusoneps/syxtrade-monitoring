document.addEventListener('DOMContentLoaded', function () {

    // --- Initialize Charts ---
    // Candlestick Chart (Main)
    const { chart, candlestickSeries } = renderCandlestickChart();

    // Volume Chart (Attached to Main Chart)
    const volumeSeries = renderVolumeChart(chart);

    // Peak Proba Chart
    const { probaChart, probaSeries } = renderPeakProbaChart();

    // RSI Chart (Demo)
    renderRSIChart();

    // Sync Time Scales (Main <-> Proba)
    const mainTimeScale = chart.timeScale();
    const probaTimeScale = probaChart.timeScale();

    mainTimeScale.subscribeVisibleTimeRangeChange((range) => {
        probaTimeScale.setVisibleRange(range);
    });

    probaTimeScale.subscribeVisibleTimeRangeChange((range) => {
        mainTimeScale.setVisibleRange(range);
    });

    // --- Data Fetching & Processing ---
    let chartData = [];
    let chartVolumeData = [];
    let probaDataMap = new Map();

    fetch('/api/chart-data')
        .then(response => response.json())
        .then(responseData => {
            console.log('API Response:', responseData);

            const toTimestamp = (str) => {
                const iso = str.replace(' ', 'T') + 'Z';
                const date = new Date(iso);

                if (isNaN(date)) {
                    console.error('Invalid date string:', str);
                    return null;
                }

                return Math.floor(date.getTime() / 1000);
            };

            // Process Candlestick Data
            chartData = responseData.bar_data.map(item => ({
                ...item,
                time: toTimestamp(item.time)
            })).filter(item => item.time !== null && item.open != null && item.high != null && item.low != null && item.close != null);

            // Process Volume Data
            chartVolumeData = responseData.bar_data.map(item => ({
                time: toTimestamp(item.time),
                value: item.volume,
                color: item.color
            })).filter(item => item.time !== null && item.value != null);

            // Process Peak Proba Data
            const probaData = responseData.bar_data.map(item => ({
                time: toTimestamp(item.time),
                value: item.daily_peak_proba
            })).filter(item => item.time !== null && item.value != null);

            const markers = responseData.markers.map(item => ({
                ...item,
                time: toTimestamp(item.time)
            })).filter(item => item.time !== null);

            // Sort Data
            chartData.sort((a, b) => a.time - b.time);
            chartVolumeData.sort((a, b) => a.time - b.time);
            probaData.sort((a, b) => a.time - b.time);

            // Update Series
            candlestickSeries.setData(chartData);
            volumeSeries.setData(chartVolumeData);
            candlestickSeries.setMarkers(markers);
            probaSeries.setData(probaData);

            // Populate Map for quick lookup
            probaData.forEach(d => probaDataMap.set(d.time, d.value));

            // Initialize legend
            if (chartData.length > 0) {
                const lastIndex = chartData.length - 1;
                const lastTime = chartData[lastIndex].time;
                const lastProba = probaDataMap.get(lastTime);
                setLegendData(chartData[lastIndex], chartVolumeData[lastIndex].value, lastProba);
            }

            // Fit content
            chart.timeScale().fitContent();
        })
        .catch(error => console.error('Error loading chart data:', error));


    // --- Legend Logic ---
    const legend = document.getElementById('ohlc-legend');

    function formatValue(val, decimals = 2) {
        return val !== undefined && val !== null ? val.toFixed(decimals) : '--';
    }

    function setLegendData(price, volume, proba) {
        if (!price) { return; }
        // Note: RSI legend handled by rsi.js if needed, or here if we want to merge it.
        // For now, restoring Peak Proba legend item.
        legend.innerHTML = `
            <span style="font-weight: 600;">O</span> ${formatValue(price.open)}
            <span style="font-weight: 600;">H</span> ${formatValue(price.high)}
            <span style="font-weight: 600;">L</span> ${formatValue(price.low)}
            <span style="font-weight: 600;">C</span> ${formatValue(price.close)}
            <span style="font-weight: 600;">V</span> ${Math.round(volume).toLocaleString()}
            <span style="font-weight: 600; color: #2962FF; margin-left: 1rem;">Peak Proba</span> ${formatValue(proba, 4)}
        `;
    }

    function updateLegend(time) {
        const price = chartData.find(d => d.time === time);
        const vol = chartVolumeData.find(d => d.time === time);
        const proba = probaDataMap.get(time);

        if (price && vol) {
            setLegendData(price, vol.value, proba);
        }
    }

    // Subscribe to crosshair moves on both charts
    chart.subscribeCrosshairMove(param => {
        if (param.time) {
            updateLegend(param.time);
        } else {
            if (chartData.length > 0) {
                const lastIndex = chartData.length - 1;
                const lastTime = chartData[lastIndex].time;
                updateLegend(lastTime);
            }
        }
    });

    probaChart.subscribeCrosshairMove(param => {
        if (param.time) {
            updateLegend(param.time);
        } else {
            if (chartData.length > 0) {
                const lastIndex = chartData.length - 1;
                const lastTime = chartData[lastIndex].time;
                updateLegend(lastTime);
            }
        }
    });
});
