<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'proprietaire/mes-biens',
        'proprietaire/mes-biens/*'
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     *
     * @throws \Illuminate\Session\TokenMismatchException
     */
    public function handle($request, \Closure $next)
    {
        // Vérifier si la requête est une requête API ou si elle est exemptée
        if ($this->isReading($request) || 
            $this->inExceptArray($request) || 
            $this->tokensMatch($request)) {
            return $this->addCookieToResponse($request, $next($request));
        }

        throw new \Illuminate\Session\TokenMismatchException('CSRF token mismatch.');
    }
}
