<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @php
        $authUserPayload = auth()->user()
            ? auth()->user()->only(['id', 'login', 'email', 'phone'])
            : null;
    @endphp
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title')</title>
    <style>
        #site-preloader{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#fff}
        html[data-skip-preloader] #site-preloader{display:none!important}
        html[data-skip-preloader] body.site-loading #app{opacity:1!important}
        html[data-skip-preloader] body.site-loading{overflow:visible!important}
        .site-preloader__inner{display:flex;flex-direction:column;align-items:stretch;width:min(88vw,380px);padding:0 20px}
        .site-preloader__logo{display:block;width:100%;height:auto}
        .site-preloader__bar{margin-top:22px;width:100%;height:3px;overflow:hidden;border-radius:999px;background:#7d211e}
        .site-preloader__bar-fill{display:block;height:100%;width:35%;border-radius:inherit;background:#fa4234}
        body.site-loading{overflow:hidden}
        body.site-loading #app{opacity:0}
    </style>
    <script>
        try {
            if (sessionStorage.getItem('inprokom.skipSitePreloader') === '1') {
                document.documentElement.dataset.skipPreloader = '1';
            }
        } catch (e) {}
    </script>
    <script>
        window.errors = @json($errors->toArray());
        window.oldInput = @json(session()->getOldInput());
        window.authUser = @json($authUserPayload);
    </script>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="site-loading">
    <div id="site-preloader" role="status" aria-live="polite" aria-label="Загрузка сайта">
        <div class="site-preloader__inner">
            <img
                class="site-preloader__logo"
                src="{{ asset('img/logo.svg') }}"
                width="262"
                height="70"
                alt="Инпроком"
                decoding="async"
            >
            <div class="site-preloader__bar" aria-hidden="true">
                <span class="site-preloader__bar-fill"></span>
            </div>
        </div>
    </div>
    @yield('content')
    <script>
        if (document.documentElement.dataset.skipPreloader === '1') {
            document.body.classList.remove('site-loading');
            document.body.classList.add('site-ready');
            document.getElementById('site-preloader')?.remove();
        }
    </script>
</body>
</html>
