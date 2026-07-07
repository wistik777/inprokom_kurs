@extends('layouts.react')

@section('title', 'Пресс-центр')

@section('content')
    <script>
        window.siteNewsItems = @json($siteNewsItems ?? []);
    </script>
    <div id="app" data-page="press-center"></div>
@endsection
