<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogUserActivity
{
    private static array $skipActions = [
        'notifications.unread',
        'language.update',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($request->user() && $request->isMethod('GET') && !$request->expectsJson()) {
            $routeName = $request->route()?->getName();

            if ($routeName && !in_array($routeName, self::$skipActions) && !str_starts_with($routeName, 'admin.')) {
                ActivityLog::create([
                    'user_id'    => $request->user()->id,
                    'action'     => 'page_view',
                    'description'=> $routeName,
                    'url'        => $request->url(),
                    'ip_address' => $request->ip(),
                    'user_agent' => substr($request->userAgent() ?? '', 0, 255),
                ]);
            }
        }

        return $response;
    }
}
