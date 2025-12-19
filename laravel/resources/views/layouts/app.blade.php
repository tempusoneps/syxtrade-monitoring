<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Tempus OnePS') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            color: #1f2937;
        }

        .app-container {
            width: 100%;
            max-width: 1200px; /* Requested width ~1200px */
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .card {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
            padding: 0.5rem 1rem;
            background-color: #2563eb;
            color: white;
            border-radius: 0.375rem;
            border: none;
            cursor: pointer;
            font-weight: 500;
        }
        
        .btn-primary:hover {
            background-color: #1d4ed8;
        }
    </style>
</head>
<body>
    <div class="app-container">
        @yield('content')
    </div>
</body>
</html>
