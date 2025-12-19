function renderVolumeChart(chart, data = null) {
    if (!chart) {
        console.error("renderVolumeChart requires a chart instance.");
        return null;
    }

    const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: 'volume', // Use strict named scale
    });

    // Configure the Volume Scale to sit at the bottom
    chart.priceScale('volume').applyOptions({
        scaleMargins: {
            top: 0.8, // Start at 80% down
            bottom: 0,
        },
    });

    if (data) {
        volumeSeries.setData(data);
    }

    return volumeSeries;
}