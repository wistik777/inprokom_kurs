@extends('layouts.react')

@section('title', 'Обращения клиентов')

@section('content')
    <script>
        window.managerFeedback = @json($feedbackMessages ?? []);
        window.managerVacancyApplications = @json($vacancyApplications ?? []);
        window.managerSuccess = @json($success ?? null);
    </script>
    <div id="app" data-page="manager-inbox"></div>
@endsection
