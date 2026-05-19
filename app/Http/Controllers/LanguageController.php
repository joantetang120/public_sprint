<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'language' => ['required', 'in:en,fr'],
        ]);

        $language = $validated['language'];

        $request->session()->put('locale', $language);

        if ($request->user()) {
            $request->user()->forceFill([
                'language' => $language,
            ])->save();
        }

        app()->setLocale($language);

        if ($request->expectsJson()) {
            return response()->json(['language' => $language]);
        }

        return back();
    }
}
