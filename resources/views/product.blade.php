@extends('layouts.react')

@section('title', $product->name)

@section('content')
    <script>
        window.productData = @json($product);
    </script>
    <div id="app" data-page="product"></div>
@endsection
