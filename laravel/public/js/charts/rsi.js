const generateRSI = (candles) => {
    let lastRSI = 50;
    return candles.map(c => {
        lastRSI += (Math.random() - 0.5) * 10;
        lastRSI = Math.max(20, Math.min(80, lastRSI));

        return {
            time: c.time,
            value: +lastRSI.toFixed(2),
        };
    });
};

function renderRSIChart(data = null) {
    const rsiChart = LightweightCharts.createChart(
        document.getElementById('rsiChart'),
        {
            layout: { background: { color: '#fff' }, textColor: '#333' },
            rightPriceScale: {
                visible: true,
                scaleMargins: { top: 0.2, bottom: 0.2 },
            },
            timeScale: { timeVisible: true, secondsVisible: false },
        }
    );

    const rsiSeries = rsiChart.addLineSeries({
        color: '#7E57C2',
        lineWidth: 2,
    });


    rsiSeries.setData([
        { time: 1702704000, value: 45 },
        { time: 1702704300, value: 62 },
        { time: 1702704600, value: 71 },
    ]);

    rsiSeries.createPriceLine({
        price: 70,
        color: 'red',
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        title: 'Overbought',
    });

    rsiSeries.createPriceLine({
        price: 30,
        color: 'green',
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        title: 'Oversold',
    });

}