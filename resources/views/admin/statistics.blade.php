@extends('layouts.react')

@section('title', 'Статистика сайта')

@section('content')
    <script>
        window.adminSiteStats = @json($siteStats ?? []);
        window.adminStatsPeriod = @json($selectedPeriod ?? 'all');
    </script>
    <div id="app" data-page="admin-statistics"></div>
@endsection
