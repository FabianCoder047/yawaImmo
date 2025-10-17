<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Mon Profil') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    @if (session('status'))
                        <div class="mb-6 p-4 bg-green-100 text-green-700 rounded">
                            {{ session('status') }}
                        </div>
                    @endif

                    @if ($errors->any())
                        <div class="mb-6 p-4 bg-red-100 text-red-700 rounded">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <div class="mb-8">
                        <div class="border-b border-gray-200">
                            <nav class="-mb-px flex space-x-8">
                                <button @click="activeTab = 'profile'" 
                                        :class="activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                                        class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                    Informations personnelles
                                </button>
                                <button @click="activeTab = 'password'"
                                        :class="activeTab === 'password' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                                        class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                    Changer le mot de passe
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div x-data="{ activeTab: 'profile' }">
                        <!-- Informations du profil -->
                        <div x-show="activeTab === 'profile'">
                            <form method="POST" action="{{ route('profile.update') }}" class="space-y-6">
                                @csrf
                                @method('PUT')

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <x-label for="nom" :value="__('Nom')" />
                                        <x-input id="nom" class="block mt-1 w-full" type="text" name="nom" :value="old('nom', $user->nom)" required autofocus />
                                    </div>

                                    <div>
                                        <x-label for="prenom" :value="__('Prénom')" />
                                        <x-input id="prenom" class="block mt-1 w-full" type="text" name="prenom" :value="old('prenom', $user->prenom)" required />
                                    </div>

                                    <div class="md:col-span-2">
                                        <x-label for="email" :value="__('Email')" />
                                        <x-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email', $user->email)" required />
                                    </div>
                                </div>

                                <div class="flex items-center justify-end mt-6">
                                    <x-button type="submit" class="ml-4">
                                        {{ __('Enregistrer les modifications') }}
                                    </x-button>
                                </div>
                            </form>
                        </div>

                        <!-- Modification du mot de passe -->
                        <div x-show="activeTab === 'password'">
                            <form method="POST" action="{{ route('profile.password') }}" class="space-y-6">
                                @csrf
                                
                                <div class="space-y-4">
                                    <div>
                                        <x-label for="current_password" :value="__('Mot de passe actuel')" />
                                        <x-input id="current_password" class="block mt-1 w-full" 
                                                type="password" 
                                                name="current_password" 
                                                required 
                                                autocomplete="current-password" />
                                    </div>

                                    <div>
                                        <x-label for="password" :value="__('Nouveau mot de passe')" />
                                        <x-input id="password" class="block mt-1 w-full" 
                                                type="password" 
                                                name="password" 
                                                required 
                                                autocomplete="new-password" />
                                        <p class="mt-1 text-sm text-gray-500">
                                            Le mot de passe doit contenir au moins 8 caractères.
                                        </p>
                                    </div>

                                    <div>
                                        <x-label for="password_confirmation" :value="__('Confirmer le mot de passe')" />
                                        <x-input id="password_confirmation" class="block mt-1 w-full" 
                                                type="password" 
                                                name="password_confirmation" 
                                                required 
                                                autocomplete="new-password" />
                                    </div>
                                </div>

                                <div class="flex items-center justify-end mt-6">
                                    <x-button type="submit" class="ml-4">
                                        {{ __('Mettre à jour le mot de passe') }}
                                    </x-button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('profile', () => ({
                activeTab: 'profile',
                
                init() {
                    // Vérifier s'il y a des erreurs de mot de passe pour afficher l'onglet approprié
                    @if($errors->has('current_password') || $errors->has('password'))
                        this.activeTab = 'password';
                    @endif
                }
            }));
        });
    </script>
    @endpush
</x-app-layout>
