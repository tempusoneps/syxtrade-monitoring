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

function formatDate(time) {
    if (!time) return '--';

    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'UTC',
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(new Date(time * 1000));
}

function formatProba(val, threshold) {
    if (val >= threshold) {
        return `<span class="legend-value proba">${formatValue(val, 4)}</span>`;
    } else {
        return `<span class="legend-value">${formatValue(val, 4)}</span>`;
    }
}

function formatSignal(signalBar) {
    if (signalBar.ema_signal || signalBar.couple_cs_signal || signalBar.macd_reverse_signal || signalBar.momentum_signal) {
        return `<span class="legend-value proba">Yes</span>`;
    } else {
        return `<span class="legend-value">No</span>`;
    }
}



function updateReportDetail(time, data) {
    const singleBarData = data.find(d => d.time === time);
    const legend = document.getElementById('report-detail');
    if (singleBarData) {
        legend.innerHTML = `
            <div class="legend-item">
                <span class="legend-label">Time</span>
                <span class="legend-value" data-val=${singleBarData.time}>${formatDate(singleBarData.time)}</span>
            </div>
            <div class="legend-item">
                <span class="legend-label">Open</span>
                <span class="legend-value">${formatValue(singleBarData.open)}</span>
            </div>
            <div class="legend-item">
                <span class="legend-label">High</span>
                <span class="legend-value">${formatValue(singleBarData.high)}</span>
            </div>
            <div class="legend-item">
                <span class="legend-label">Low</span>
                <span class="legend-value">${formatValue(singleBarData.low)}</span>
            </div>
            <div class="legend-item">
                <span class="legend-label">Close</span>
                <span class="legend-value">${formatValue(singleBarData.close)}</span>
            </div>
            <div class="legend-item">
                <span class="legend-label">Volume</span>
                <span class="legend-value">${Math.round(singleBarData.volume).toLocaleString()}</span>
            </div>
            <div class="legend-item">
                <span class="legend-label">Signal</span>
                ${formatSignal(singleBarData)}
            </div>
            <div class="legend-item">
                <span class="legend-label">Peak Proba</span>
                ${formatProba(singleBarData.daily_peak_proba, singleBarData.peak_proba_threshold)}
            </div>
        `;
    }
}

const syncVisibleRange = (source, target) => {
    source.timeScale().subscribeVisibleTimeRangeChange(range => {
        target.timeScale().setVisibleRange(range);
    });
};

// Sync Crosshair
const syncCrosshair = (source, target, targetSeries, targetData, valueGetter) => {
    source.subscribeCrosshairMove(param => {
        if (!param || !param.time) {
            target.clearCrosshairPosition();
            return;
        }
        const point = targetData.find(d => d.time === param.time);
        if (point) {
            target.setCrosshairPosition(valueGetter(point), param.time, targetSeries);
        } else {
            target.clearCrosshairPosition();
        }
    });
};

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/chart-data')
        .then(response => response.json())
        .then(responseData => {
            const candlestickData = prepareCandlestickChartData(responseData.bar_data);
            const peakProbaData = preparePeakProbaData(responseData.bar_data);
            const volumeData = prepareVolumeData(responseData.bar_data);
            const markers = responseData.markers;
            const { priceChart, candleSeries } = renderCandlestickChart(candlestickData, markers);
            const { peakProbaChart, peakProbaSeries } = renderPeakProbaChart(peakProbaData);
            const { volumeChart, volumeSeries } = renderVolumeChart(volumeData);
            // Sync Visible Range
            syncVisibleRange(priceChart, peakProbaChart);
            syncVisibleRange(priceChart, volumeChart);
            priceChart.subscribeClick(param => {
                if (param.time) {
                    updateReportDetail(param.time, responseData.bar_data);
                }
            });
            syncCrosshair(priceChart, peakProbaChart, peakProbaSeries, peakProbaData, d => d.value);
            syncCrosshair(priceChart, volumeChart, volumeSeries, volumeData, d => d.value);

            // Initialize legend with last data
            if (candlestickData.length > 0) {
                const lastData = responseData.bar_data[responseData.bar_data.length - 1];
                updateReportDetail(lastData.time, responseData.bar_data);
            }
        })
        .catch(error => console.error('Error fetching chart data:', error));
});


// Auto-refresh
setInterval(function () {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 9 && hours < 15) {
        window.location.reload();
    }
}, 300000);