@extends('layouts.react')

@section('title', 'Каталог')

@section('content')
    <script>
        window.catalogProducts = @json($products);
    </script>
    <div id="app" data-page="catalog"></div>
@endsection
