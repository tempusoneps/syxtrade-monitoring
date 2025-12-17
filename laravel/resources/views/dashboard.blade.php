@extends('layouts.app')

@section('content')
<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 style="margin: 0;">Dashboard</h2>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="btn-primary" style="background: #ef4444; width: auto;">Log Out</button>
        </form>
    </div>

    <!-- Chart Container -->
    <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; margin-bottom: 1rem;">
        <div id="chartContainer" style="height: 500px; width: 100%;"></div>
    </div>

    <div style="padding: 1rem; background: #f9fafb; border-radius: 0.5rem; border: 1px solid #e5e7eb; font-family: 'Inter', monospace; font-size: 0.9rem;">
        <div id="ohlc-legend" style="display: flex; gap: 1.5rem; color: #1f2937;">
            <span>--</span>
        </div>
    </div>
</div>

<!-- TradingView Lightweight Charts -->
<script src="https://unpkg.com/lightweight-charts@4.2.3/dist/lightweight-charts.standalone.production.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const chartOptions = { 
            layout: { 
                textColor: 'black', 
                background: { type: 'solid', color: 'white' } 
            },
            grid: {
                vertLines: { color: "#e1e1e1" },
                horzLines: { color: "#e1e1e1" },
            },
            rightPriceScale: {
                borderVisible: false,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.25, // Leave bottom 25% empty for volume
                },
            },
            width: document.getElementById('chartContainer').clientWidth,
            height: 500,
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
        };
        
        const chartContainer = document.getElementById('chartContainer');
        const chart = LightweightCharts.createChart(chartContainer, chartOptions);

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', 
            downColor: '#ef5350', 
            borderVisible: false, 
            wickUpColor: '#26a69a', 
            wickDownColor: '#ef5350'
        });

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

        // Generate Sample Data
        let data = [];
        let volumeData = [];
        let time = new Date(Date.UTC(2025, 0, 1, 0, 0, 0, 0)); // Start from Jan 1, 2025
        let lastClose = 150;

        for (let i = 0; i < 100; i++) {
            const open = lastClose + (Math.random() - 0.5) * 4;
            const close = open + (Math.random() - 0.5) * 4;
            const high = Math.max(open, close) + Math.random();
            const low = Math.min(open, close) - Math.random();
            const volume = Math.floor(Math.random() * 1000000) + 500000;

            // Format date as YYYY-MM-DD
            const isoString = time.toISOString().split('T')[0];
            
            data.push({
                time: isoString,
                open: open,
                high: high,
                low: low,
                close: close
            });

            volumeData.push({
                time: isoString,
                value: volume,
                color: close >= open ? '#26a69a' : '#ef5350', // Green if up, Red if down
            });

            lastClose = close;
            time.setDate(time.getDate() + 1);
        }

        candlestickSeries.setData(data);
        volumeSeries.setData(volumeData);

        // Add Example Markers (BUY/SELL Signals)
        const markers = [
            {
                time: data[data.length - 20].time, // 20 days ago
                position: 'belowBar',
                color: '#2196F3', // Blue
                shape: 'arrowUp',
                text: 'BUY',
                size: 2
            },
            {
                time: data[data.length - 5].time, // 5 days ago
                position: 'aboveBar',
                color: '#e91e63', // Red
                shape: 'arrowDown',
                text: 'SELL',
                size: 2
            }
        ];
        
        candlestickSeries.setMarkers(markers);

        chart.timeScale().fitContent();

        // Responsive Resizing
        new ResizeObserver(entries => {
            if (entries.length === 0 || entries[0].target !== chartContainer) { return; }
            const newRect = entries[0].contentRect;
            chart.applyOptions({ width: newRect.width });
        }).observe(chartContainer);

        // --- OHLCV Legend Logic ---
        const legend = document.getElementById('ohlc-legend');

        function formatValue(val, decimals = 2) {
            return val.toFixed(decimals);
        }

        function setLegendData(price, volume) {
            if (!price) { return; }
            legend.innerHTML = `
                <span style="font-weight: 600;">O</span> ${formatValue(price.open)}
                <span style="font-weight: 600;">H</span> ${formatValue(price.high)}
                <span style="font-weight: 600;">L</span> ${formatValue(price.low)}
                <span style="font-weight: 600;">C</span> ${formatValue(price.close)}
                <span style="font-weight: 600;">V</span> ${Math.round(volume).toLocaleString()}
            `;
        }

        // Initialize with last bar
        const lastIndex = data.length - 1;
        setLegendData(data[lastIndex], volumeData[lastIndex].value);

        chart.subscribeCrosshairMove(param => {
            if (param.time) {
                const priceData = param.seriesData.get(candlestickSeries);
                const volData = param.seriesData.get(volumeSeries);
                if (priceData && volData) {
                    setLegendData(priceData, volData.value);
                }
            } else {
                // Determine if we should clear or keep last known (user preference, keeping last known is often better or reset to latest)
                // Resetting to latest bar for consistency when mouse leaves
                setLegendData(data[lastIndex], volumeData[lastIndex].value);
            }
        });
    });
</script>
@endsection
