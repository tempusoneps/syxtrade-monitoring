function renderVolumeChart(data = null) {
    const volumeChart = LightweightCharts.createChart(
        document.getElementById('volumeChart'),
        {
            height: 120,
            layout: {
                background: { color: '#fff' },
                textColor: '#333',
            },
            rightPriceScale: {
                visible: true,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0,
                },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                rightBarStaysOnScroll: false,
                rightOffset: 0,
                barSpacing: 8,
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
        }
    );
    const volumeSeries = volumeChart.addHistogramSeries({
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: 'right',
    });

    volumeSeries.setData(data);
    volumeChart.timeScale().fitContent();
    return { volumeChart, volumeSeries };

}