@extends('layouts.auth')

@section('content')
<style>
    .login-header {
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .login-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
    }

    .form-control {
        display: block;
        width: 100%;
        padding: 0.625rem 0.75rem; /* adjusted padding */
        font-size: 0.875rem;
        line-height: 1.5;
        color: #111827;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        box-sizing: border-box; /* ensure padding doesn't affect width */
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .form-control:focus {
        border-color: #2563eb;
        outline: 0;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .error-msg {
        color: #dc2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }

    .btn-primary {
        display: block;
        width: 100%;
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.5;
        color: #fff;
        background-color: #2563eb;
        border: 1px solid transparent;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.15s ease-in-out;
    }

    .btn-primary:hover {
        background-color: #1d4ed8;
    }

    .form-check {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }

    .form-check-input {
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #d1d5db;
        cursor: pointer;
    }

    .form-footer {
        margin-top: 1rem;
        text-align: center;
        font-size: 0.875rem;
    }
    
    .link-primary {
        color: #2563eb;
        text-decoration: none;
    }
    
    .link-primary:hover {
        text-decoration: underline;
    }
</style>

<div class="login-header">
    <h2>Sign in to your account</h2>
</div>

<!-- Session Status -->
@if (session('status'))
    <div style="color: #059669; font-size: 0.875rem; margin-bottom: 1rem; text-align: center;">
        {{ session('status') }}
    </div>
@endif

<form method="POST" action="{{ route('login') }}">
    @csrf

    <!-- Email Address -->
    <div class="form-group">
        <label for="email" class="form-label">Email address</label>
        <input id="email" class="form-control" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username">
        @error('email')
            <div class="error-msg">{{ $message }}</div>
        @enderror
    </div>

    <!-- Password -->
    <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input id="password" class="form-control" type="password" name="password" required autocomplete="current-password">
        @error('password')
            <div class="error-msg">{{ $message }}</div>
        @enderror
    </div>

    <!-- Remember Me -->
    <div class="form-check">
        <input id="remember_me" type="checkbox" class="form-check-input" name="remember">
        <label for="remember_me" style="font-size: 0.875rem; color: #374151; cursor: pointer;">Remember me</label>
    </div>

    <div class="form-group">
        <button type="submit" class="btn-primary">
            Sign in
        </button>
    </div>
    
    <div class="form-footer">
        @if (Route::has('password.request'))
            <a class="link-primary" href="{{ route('password.request') }}">
                Forgot your password?
            </a>
        @endif
    </div>
</form>
@endsection
