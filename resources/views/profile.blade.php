@extends('layouts.react')

@section('title', 'Профиль')

@section('content')
    <script>
        window.profileOrders = @json($orders ?? []);
    </script>
    <div id="app" data-page="profile"></div>
@endsection
