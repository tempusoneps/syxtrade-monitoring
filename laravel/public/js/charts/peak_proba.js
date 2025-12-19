function renderPeakProbaChart(data = null) {
    const peakProbaChart = LightweightCharts.createChart(
        document.getElementById('peakProbaChart'),
        {
            layout: { background: { color: '#fff' }, textColor: '#333' },
            rightPriceScale: {
                visible: true,
                scaleMargins: { top: 0.2, bottom: 0.2 },
            },
            timeScale: { timeVisible: true, secondsVisible: false },
        }
    );

    const peakProbaSeries = peakProbaChart.addLineSeries({
        color: '#7E57C2',
        lineWidth: 2,
    });

    peakProbaSeries.setData(data);
    peakProbaChart.timeScale().fitContent();
    peakProbaSeries.createPriceLine({
        price: 0.876,
        color: '#46be2aff',
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        title: '',
    });
    return { peakProbaChart, peakProbaSeries };
}