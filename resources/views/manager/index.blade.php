@extends('layouts.react')

@section('title', 'Панель менеджера')

@section('content')
    <script>
        window.managerProducts = @json($products ?? []);
        window.managerCategories = @json($categories ?? []);
        window.managerSuccess = @json($success ?? null);
        window.managerFormOld = @json($oldValues ?? []);
    </script>
    <div id="app" data-page="manager-home"></div>
@endsection
