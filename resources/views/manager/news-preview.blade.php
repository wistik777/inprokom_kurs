@extends('layouts.react')

@section('title', 'Предпросмотр новости')

@section('content')
    <script>
        window.newsId = {{ (int) ($newsId ?? 0) }};
        window.siteNewsItems = @json($siteNewsItems ?? []);
    </script>
    <div id="app" data-page="manager-news-preview"></div>
@endsection
