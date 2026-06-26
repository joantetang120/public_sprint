<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link rel="icon" type="image/jpeg" href="{{ asset('logo/minilogowhite.jpg') }}">
        <link rel="shortcut icon" href="{{ asset('logo/minilogowhite.jpg') }}">
        <link rel="apple-touch-icon" href="{{ asset('logo/minilogowhite.jpg') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @if(auth()->check() && auth()->user()->is_admin)
        <script>window.__adminPath = '{{ config('admin.portal_path', 'xk9-control-panel') }}';</script>
        @endif
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
