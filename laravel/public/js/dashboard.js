function prepareCandlestickChartData(data) {
    const chartData = data.map(item => ({
        time: item.time,
        open: item.open,
        close: item.close,
        high: item.high,
        low: item.low
    }));
    return chartData;
}

function prepareVolumeData(data) {
    const chartData = data.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.color
    }));
    return chartData;
}

function preparePeakProbaData(data) {
    const chartData = data.map(item => ({
        time: item.time,
        value: item.daily_peak_proba
    }));
    return chartData;
}

function formatValue(val, decimals = 2) {
    return val !== undefined && val !== null ? val.toFixed(decimals) : '--';
}

function updateReportDetail(time, data) {
    const singleBarData = data.find(d => d.time === time);
    const legend = document.getElementById('report-detail');
    if (singleBarData) {
        legend.innerHTML = `
            <span style="font-weight: 600;">O</span> ${formatValue(singleBarData.open)}
            <span style="font-weight: 600;">H</span> ${formatValue(singleBarData.high)}
            <span style="font-weight: 600;">L</span> ${formatValue(singleBarData.low)}
            <span style="font-weight: 600;">C</span> ${formatValue(singleBarData.close)}
            <span style="font-weight: 600;">V</span> ${Math.round(singleBarData.volume).toLocaleString()}
            <span style="font-weight: 600; color: #2962FF; margin-left: 1rem;">Peak Proba</span> ${formatValue(singleBarData.daily_peak_proba, 4)}
        `;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/chart-data')
        .then(response => response.json())
        .then(responseData => {
            const candlestickData = prepareCandlestickChartData(responseData.bar_data);
            const peakProbaData = preparePeakProbaData(responseData.bar_data);
            const markers = responseData.markers;
            const { priceChart, candleSeries } = renderCandlestickChart(candlestickData, markers);
            renderPeakProbaChart(peakProbaData);
            priceChart.subscribeClick(param => {
                if (param.time) {
                    updateReportDetail(param.time, responseData.bar_data);
                }
            });
        })
        .catch(error => console.error('Error fetching chart data:', error));
});