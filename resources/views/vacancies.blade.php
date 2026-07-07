@extends('layouts.react')

@section('title', 'Вакансии')

@section('content')
    <script>
        window.siteVacancies = @json($siteVacancies ?? []);
    </script>
    <div id="app" data-page="vacancies"></div>
@endsection
