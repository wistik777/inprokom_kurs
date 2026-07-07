@extends('layouts.react')

@section('title', 'Новости')

@section('content')
    <script>
        window.siteNewsItems = @json($siteNewsItems ?? []);
    </script>
    <div id="app" data-page="press-news"></div>
@endsection
