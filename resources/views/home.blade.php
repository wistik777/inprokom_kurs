@extends('layouts.react')

@section('title', 'Главная')

@section('content')
    <script>
        window.siteNewsItems = @json($siteNewsItems ?? []);
    </script>
    <div id="app" data-page="home"></div>
@endsection
