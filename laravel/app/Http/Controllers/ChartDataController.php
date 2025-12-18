<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChartDataController extends Controller
{
    //


    public function index()
    {
        $signals = \App\Models\SyxtradeSignal::whereNotNull('cs_time')->orderBy('cs_time', 'asc')->get();

        // Use associative array to deduplicate by timestamp (last signal wins)
        $uniqueData = [];
        $uniqueVolume = [];
        
        // Markers can have multiple entries per timestamp if needed, but usually one per bar is best.
        // However, for markers we'll append all valid ones.
        $markers = [];

        foreach ($signals as $signal) {
            $isoString = $signal->cs_time->format('Y-m-d H:i:s');
            // We use timestamp as key for deduplication of candles/volume
            $timestamp = $signal->cs_time->timestamp;

            $uniqueData[$timestamp] = [
                'time' => $isoString,
                'open' => (float)$signal->open,
                'high' => (float)$signal->high,
                'low' => (float)$signal->low,
                'close' => (float)$signal->close,
            ];

            $uniqueVolume[$timestamp] = [
                'time' => $isoString,
                'value' => (float)$signal->volume,
                'color' => $signal->close >= $signal->open ? '#26a69a' : '#ef5350',
            ];

            // Example Marker Logic based on available signals
            if (strtolower($signal->ema_signal) === 'buy' || strtolower($signal->couple_cs_signal) === 'buy' || strtolower($signal->macd_reverse_signal) === 'buy' || strtolower($signal->momentum_signal) === 'buy') {
                $markers[] = [
                    'time' => $isoString,
                    'position' => 'belowBar',
                    'color' => '#2196F3',
                    'shape' => 'arrowUp',
                    'text' => 'BUY',
                    'size' => 2
                ];
            } elseif (strtolower($signal->ema_signal) === 'sell' || strtolower($signal->couple_cs_signal) === 'sell' || strtolower($signal->macd_reverse_signal) === 'sell' || strtolower($signal->momentum_signal) === 'sell') {
                $markers[] = [
                    'time' => $isoString,
                    'position' => 'aboveBar',
                    'color' => '#e91e63',
                    'shape' => 'arrowDown',
                    'text' => 'SELL',
                    'size' => 2
                ];
            }
        }

        // Ensure sorted by timestamp
        ksort($uniqueData);
        ksort($uniqueVolume);

        return response()->json([
            // re-index to simple array
            'candlestick' => array_values($uniqueData),
            'volume' => array_values($uniqueVolume),
            'markers' => $markers
        ]);
    }
}
