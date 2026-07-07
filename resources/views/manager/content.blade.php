@extends('layouts.react')

@section('title', 'Контент сайта')

@section('content')
    <script>
        window.managerNewsPosts = @json($newsPosts ?? []);
        window.managerVacancies = @json($vacancies ?? []);
        window.managerSuccess = @json($success ?? null);
        window.managerOld = @json($oldValues ?? []);
    </script>
    <div id="app" data-page="manager-content"></div>
@endsection
