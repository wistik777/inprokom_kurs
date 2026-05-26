@extends('layouts.react')

@section('title', 'Новость')

@section('content')
    <script>
        window.newsId = {{ (int) ($newsId ?? 0) }};
    </script>
    <div id="app" data-page="press-news-article"></div>
@endsection
