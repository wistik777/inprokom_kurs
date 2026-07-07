<?php

namespace App\Http\Controllers;

use App\Models\AdminAuditLog;
use App\Models\User;
use App\Services\AdminSiteStatistics;
use App\Services\StatisticsPeriod;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $managers = User::query()
            ->where('rule', 'manager')
            ->latest('id')
            ->get(['id', 'login', 'email', 'phone', 'created_at']);

        $auditLogs = AdminAuditLog::query()
            ->with(['actor:id,login', 'revertedBy:id,login'])
            ->latest('id')
            ->limit(100)
            ->get()
            ->map(function (AdminAuditLog $log) {
                $before = $log->before_state ?? [];
                $after = $log->after_state ?? [];
                $target = $after['login'] ?? $before['login'] ?? null;

                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'target_login' => $target,
                    'actor_login' => $log->actor?->login,
                    'created_at' => optional($log->created_at)->format('d.m.Y H:i'),
                    'is_reverted' => (bool) $log->reverted_at,
                    'reverted_at' => optional($log->reverted_at)->format('d.m.Y H:i'),
                    'reverted_by_login' => $log->revertedBy?->login,
                ];
            })
            ->values()
            ->all();

        return view('admin.index', [
            'managers' => $managers->map(fn ($manager) => [
                'id' => $manager->id,
                'login' => $manager->login,
                'email' => $manager->email,
                'phone' => $manager->phone,
                'created_at' => optional($manager->created_at)->format('d.m.Y H:i'),
            ]),
            'auditLogs' => $auditLogs,
            'success' => session('success'),
            'oldValues' => old(),
        ]);
    }

    public function statistics(Request $request, AdminSiteStatistics $siteStatistics)
    {
        $period = StatisticsPeriod::normalize($request->query('period'));

        return view('admin.statistics', [
            'siteStats' => $siteStatistics->build($period),
            'selectedPeriod' => $period,
        ]);
    }

    public function createManager()
    {
        return redirect('/admin');
    }

    public function storeManager(Request $request)
    {
        $validated = $request->validate([
            'login' => 'required|min:6|unique:users,login',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone' => 'required|regex:/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/',
        ], [
            'login.min' => 'Логин должен быть не менее 6 символов',
            'login.unique' => 'Такой логин уже существует',
            'email.email' => 'Почта некорректна',
            'email.unique' => 'Такая почта уже существует',
            'password.min' => 'Пароль должен быть не менее 6 символов',
            'phone.regex' => 'Телефон должен соответствовать +7(XXX)-XXX-XX-XX',
        ]);

        $manager = User::create([
            'login' => $validated['login'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'],
            'rule' => 'manager',
            'role' => false,
            'is_active' => true,
            'blocked_at' => null,
        ]);

        $this->logAdminAction(
            'create_manager',
            'user',
            $manager->id,
            null,
            $this->snapshotUser($manager)
        );

        return redirect('/admin')->with('success', 'Менеджер успешно создан');
    }

    public function destroyManager(User $manager)
    {
        if ($manager->rule !== 'manager') {
            return redirect('/admin')->with('success', 'Удалять можно только менеджеров');
        }

        $beforeState = $this->snapshotUser($manager);
        $manager->delete();

        $this->logAdminAction(
            'delete_manager',
            'user',
            $beforeState['id'] ?? null,
            $beforeState,
            null
        );

        return redirect('/admin')->with('success', 'Менеджер успешно удален');
    }

    public function rollbackAuditLog(AdminAuditLog $auditLog)
    {
        if ($auditLog->reverted_at) {
            return redirect('/admin')->with('success', 'Это действие уже было откачено');
        }

        $wasRolledBack = false;

        DB::transaction(function () use ($auditLog, &$wasRolledBack) {
            if ($auditLog->action === 'create_manager') {
                $after = $auditLog->after_state ?? [];
                $userId = $after['id'] ?? null;

                $manager = null;
                if ($userId) {
                    $manager = User::query()->where('id', $userId)->first();
                }

                if (!$manager && !empty($after['login'])) {
                    $manager = User::query()->where('login', $after['login'])->first();
                }

                if ($manager && $manager->rule === 'manager') {
                    $manager->delete();
                    $wasRolledBack = true;
                }
            } elseif ($auditLog->action === 'delete_manager') {
                $before = $auditLog->before_state ?? [];
                if (empty($before)) {
                    return;
                }

                $existsByLogin = User::query()->where('login', $before['login'] ?? '')->exists();
                $existsByEmail = User::query()->where('email', $before['email'] ?? '')->exists();
                if ($existsByLogin || $existsByEmail) {
                    return;
                }

                DB::table('users')->insert([
                    'id' => $before['id'] ?? null,
                    'login' => $before['login'] ?? null,
                    'email' => $before['email'] ?? null,
                    'password' => $before['password'] ?? null,
                    'phone' => $before['phone'] ?? null,
                    'rule' => $before['rule'] ?? 'manager',
                    'role' => (bool) ($before['role'] ?? false),
                    'is_active' => (bool) ($before['is_active'] ?? true),
                    'blocked_at' => $before['blocked_at'] ?? null,
                    'remember_token' => null,
                    'created_at' => $before['created_at'] ?? now(),
                    'updated_at' => now(),
                ]);
                $wasRolledBack = true;
            }

            if (!$wasRolledBack) {
                return;
            }

            $auditLog->reverted_at = now();
            $auditLog->reverted_by_user_id = auth()->id();
            $auditLog->save();
        });

        if (!$wasRolledBack) {
            return redirect('/admin')->with('success', 'Откат не выполнен: целевая запись отсутствует или уже занята');
        }

        return redirect('/admin')->with('success', 'Изменение успешно откачено');
    }

    private function logAdminAction(
        string $action,
        ?string $targetType,
        ?int $targetId,
        ?array $beforeState,
        ?array $afterState
    ): void {
        AdminAuditLog::create([
            'actor_user_id' => auth()->id(),
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'before_state' => $beforeState,
            'after_state' => $afterState,
        ]);
    }

    private function snapshotUser(User $user): array
    {
        return [
            'id' => $user->id,
            'login' => $user->login,
            'email' => $user->email,
            'password' => $user->password,
            'phone' => $user->phone,
            'rule' => $user->rule,
            'role' => (bool) $user->role,
            'is_active' => (bool) $user->is_active,
            'blocked_at' => optional($user->blocked_at)->toDateTimeString(),
            'created_at' => optional($user->created_at)->toDateTimeString(),
            'updated_at' => optional($user->updated_at)->toDateTimeString(),
        ];
    }

}
