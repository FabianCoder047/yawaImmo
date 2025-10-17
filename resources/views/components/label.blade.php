@props([
    'for' => null,
    'value' => null,
])

<label 
    {{ $for ? 'for='.$for : '' }} 
    {{ $attributes->merge(['class' => 'block text-sm font-medium text-gray-700 dark:text-gray-300']) }}
>
    {{ $value ?? $slot }}
</label>
