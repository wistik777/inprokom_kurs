@extends('layouts.react')

@section('title', 'Менеджеры')

@section('content')
    <script>
        window.adminManagers = @json($managers ?? []);
        window.adminSuccess = @json($success ?? null);
    </script>
    <div id="app" data-page="admin-managers"></div>
@endsection
