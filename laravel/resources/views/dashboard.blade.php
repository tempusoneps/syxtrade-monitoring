@extends('layouts.app')

@section('content')
<link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">

<div class="card">
    <div class="dashboard-header">
        <h2 class="dashboard-title">Dashboard</h2>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="btn-primary btn-logout">Log Out</button>
        </form>
    </div>

    <!-- Chart Container -->
    <div class="chart-wrapper">
        <div id="candlestickChart" class="chart-container"></div>
        <div id="volumeChart" style="height:200px;"></div>
        <div id="peakProbaChart" style="height:200px;"></div>
    </div>

    <div class="legend-wrapper">
        <div id="report-detail" class="legend-content">
            <span>--</span>
        </div>
    </div>
</div>

<!-- TradingView Lightweight Charts -->
<script src="https://unpkg.com/lightweight-charts@4.2.3/dist/lightweight-charts.standalone.production.js"></script>
<script src="{{ asset('js/charts/candlestick.js') }}"></script>
<script src="{{ asset('js/charts/volume.js') }}"></script>
<script src="{{ asset('js/charts/peak_proba.js') }}"></script>
<script src="{{ asset('js/dashboard.js') }}"></script>
@endsection
