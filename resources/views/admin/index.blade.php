@extends('layouts.react')

@section('title', 'Админ-панель')

@section('content')
    <script>
        window.adminManagers = @json($managers ?? []);
        window.adminSuccess = @json($success ?? null);
        window.adminFormOld = @json($oldValues ?? []);
    </script>
    <div id="app" data-page="admin-home"></div>
@endsection
