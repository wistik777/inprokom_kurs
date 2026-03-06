@extends('layouts.react')

@section('title', 'Добавление менеджера')

@section('content')
    <script>
        window.adminFormOld = @json($oldValues ?? []);
    </script>
    <div id="app" data-page="admin-create-manager"></div>
@endsection
