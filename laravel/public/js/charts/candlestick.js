function renderCandlestickChart(data = null, markers = null) {
    const priceChart = LightweightCharts.createChart(
        document.getElementById('candlestickChart'),
        {
            layout: {
                background: { color: '#fff' },
                textColor: '#333',
            },
            rightPriceScale: {
                visible: true,
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                rightBarStaysOnScroll: false,
                rightOffset: 0,
                barSpacing: 8,
                minBarSpacing: 4,
            },
        }
    );

    const candleSeries = priceChart.addCandlestickSeries();
    candleSeries.setData(data);
    priceChart.timeScale().fitContent();
    candleSeries.setMarkers(markers);
    return { priceChart, candleSeries };
}