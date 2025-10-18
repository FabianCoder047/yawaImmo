import {
    ArrowDownWideNarrow,
    ArrowUpWideNarrow,
    Building,
    DollarSign,
    Edit,
    Filter,
    Home,
    MapPin,
    Plus,
    Trash2,
    Lock,
    X,
    Image as ImageIcon,
    RefreshCw
} from 'lucide-react';
import { useState, FC, FormEvent, ChangeEvent, MouseEvent } from 'react';
import Swal from 'sweetalert2';
import PropertyCard from './propertyCard';

interface Category {
    id: number;
    name: string;
}

interface PropertyFormData {
    title: string;
    type: string;
    location: string;
    price: string;
    description: string;
    category: string;
    categorie: string;
    images: string[];
    imageFiles: FileList | null;
}

interface Property {
    id: number;
    title: string;
    price: number;
    status: string;
    location: string;
    type: string;
    description?: string;
    offre?: string;
    image: string;
    additional_images?: string[];
    category?: Category;
    categorie?: {
        id: number;
        name: string;
    };
    reactivation_requested?: boolean;
    reactivation_reason?: string;
    reactivation_requested_at?: string;
}

interface PropertyListProps {
    properties: Property[];
    categories: Category[];
}

const PropertyList: FC<PropertyListProps> = ({ properties: initialProperties, categories }) => {
    // États du composant
    const [properties, setProperties] = useState<Property[]>(initialProperties || []);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
    const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showFilters, setShowFilters] = useState(false);
    const [formData, setFormData] = useState<PropertyFormData>({
        title: '',
        type: '',
        location: '',
        price: '',
        description: '',
        category: '',
        categorie: '',
        images: [],
        imageFiles: null
    });

const openEditModal = (property: any) => {
    setEditingProperty(property);
    
    // Initialiser le tableau d'images
    let images: string[] = [];
    
    // 1. Ajouter l'image principale si elle existe
    if (property.image) {
        const mainImage = property.image.startsWith('http') || property.image.startsWith('/') 
            ? property.image 
            : `/storage/${property.image}`;
        if (!images.includes(mainImage)) {
            images.push(mainImage);
        }
    }
    
    // 2. Ajouter les images supplémentaires à partir de additional_images
    if (property.additional_images) {
        try {
            // Si c'est une chaîne, essayer de la parser en JSON
            let additionalImages: any[] = [];
            
            if (typeof property.additional_images === 'string') {
                try {
                    const parsed = JSON.parse(property.additional_images);
                    additionalImages = Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    // Si le parsing échoue, traiter comme une chaîne simple
                    additionalImages = [property.additional_images];
                }
            } else if (Array.isArray(property.additional_images)) {
                additionalImages = property.additional_images;
            } else if (typeof property.additional_images === 'object' && property.additional_images !== null) {
                // Si c'est un objet, le convertir en tableau
                additionalImages = Object.values(property.additional_images);
            }
            
            // S'assurer que c'est bien un tableau avant d'itérer
            if (Array.isArray(additionalImages)) {
                additionalImages.forEach((img: any) => {
                    if (!img) return;
                    
                    let imgUrl = '';
                    if (typeof img === 'object' && img !== null) {
                        // Si c'est un objet avec une propriété url
                        if (img.url) {
                            imgUrl = img.url;
                        }
                        // Si c'est un objet avec une propriété path (Laravel)
                        else if (img.path) {
                            imgUrl = img.path.startsWith('http') || img.path.startsWith('/')
                                ? img.path
                                : `/storage/${img.path}`;
                        }
                    } else if (typeof img === 'string') {
                        imgUrl = img.startsWith('http') || img.startsWith('/')
                            ? img
                            : `/storage/${img}`;
                    }
                    
                    // Nettoyer l'URL et vérifier les doublons
                    if (imgUrl) {
                        const cleanUrl = imgUrl.replace(/^"|"$/g, ''); // Enlever les guillemets si présents
                        if (!images.some(i => i === cleanUrl || i.endsWith(cleanUrl) || cleanUrl.endsWith(i))) {
                            images.push(cleanUrl);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Erreur lors du traitement des images supplémentaires:', error);
        }
    }
    
    // 3. Ajouter les URLs d'images supplémentaires (depuis l'API)
    if (property.additional_images_urls) {
        let additionalImageUrls = [];
        
        if (typeof property.additional_images_urls === 'string') {
            try {
                additionalImageUrls = JSON.parse(property.additional_images_urls);
            } catch (e) {
                console.error('Erreur lors du parsing des URLs d\'images supplémentaires:', e);
                additionalImageUrls = [property.additional_images_urls];
            }
        } else if (Array.isArray(property.additional_images_urls)) {
            additionalImageUrls = property.additional_images_urls;
        }
        
        additionalImageUrls.forEach((url: any) => {
            const imgUrl = typeof url === 'object' ? url.url : url;
            if (imgUrl && !images.some(i => i === imgUrl || i.endsWith(imgUrl))) {
                images.push(imgUrl);
            }
        });
    }
    
    // 4. Si aucune image n'a été trouvée, essayer avec image_url
    if (images.length === 0 && property.image_url) {
        const imageUrl = property.image_url.startsWith('http') || property.image_url.startsWith('/')
            ? property.image_url
            : `/storage/${property.image_url}`;
        if (!images.includes(imageUrl)) {
            images.push(imageUrl);
        }
    }

    // Mise à jour du formulaire avec toutes les valeurs
    setFormData(prev => {
        // Récupérer le type de bien depuis différentes propriétés possibles
        const propertyType = property.type || 
                           property.categorie?.name || 
                           property.category?.name ||
                           property.categorie ||
                           property.category ||
                           '';
        
        // Récupérer l'offre (vente/location)
        const propertyOffre = property.offre || 
                            (property.categorie?.name === 'En vente' || property.categorie?.name === 'En location' ? property.categorie.name : '') ||
                            (property.category?.name === 'En vente' || property.category?.name === 'En location' ? property.category.name : '') ||
                            (property.categorie === 'En vente' || property.categorie === 'En location' ? property.categorie : '') ||
                            (property.category === 'En vente' || property.category === 'En location' ? property.category : '');
        
        return {
            ...prev,
            title: property.title || '',
            type: propertyType,
            location: property.location || '',
            price: property.price ? property.price.toString() : '',
            description: property.description || '',
            // Gestion des catégories
            category: property.category?.id?.toString() || 
                     property.categorie?.id?.toString() || 
                     (property.categorie ? property.categorie.toString() : ''),
            categorie: propertyOffre,
            // Images
            images: images,
            imageFiles: null
        };
    });
    
    setShowEditPropertyModal(true);
};
    const resetForm = (): void => {
        setFormData({
            title: '',
            type: '',
            location: '',
            price: '',
            description: '',
            category: '',
            categorie: '',
            images: [],
            imageFiles: null,
        });
    };

    const closeAddModal = (): void => {
        setShowAddPropertyModal(false);
        resetForm();
    };

    const closeEditModal = (): void => {
        setShowEditPropertyModal(false);
        setEditingProperty(null);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, replaceIndex: number | null = null) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newImageUrls = files.map(file => URL.createObjectURL(file));
            
            const dataTransfer = new DataTransfer();
            const currentFiles = formData.imageFiles ? Array.from(formData.imageFiles) : [];
            
            if (replaceIndex !== null) {
                // Remplacer une image existante
                currentFiles[replaceIndex] = files[0];
                currentFiles.forEach(file => dataTransfer.items.add(file));
                
                setFormData(prev => {
                    const updatedImages = [...prev.images];
                    // Libérer l'ancienne URL d'image
                    URL.revokeObjectURL(updatedImages[replaceIndex]);
                    // Remplacer par la nouvelle image
                    updatedImages[replaceIndex] = newImageUrls[0];
                    
                    return {
                        ...prev,
                        imageFiles: dataTransfer.files,
                        images: updatedImages
                    };
                });
            } else {
                // Ajouter de nouvelles images
                currentFiles.forEach(file => dataTransfer.items.add(file));
                files.forEach(file => dataTransfer.items.add(file));
                
                setFormData(prev => ({
                    ...prev,
                    imageFiles: dataTransfer.files,
                    images: [...prev.images, ...newImageUrls]
                }));
            }
            
            e.target.value = '';
        }
    };

    const handleReplaceImage = (index: number) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => handleImageChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index);
        input.click();
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            const newImageFiles = prev.imageFiles ? Array.from(prev.imageFiles) : [];
            
            // Libérer l'URL de l'image supprimée
            URL.revokeObjectURL(newImages[index]);
            
            // Supprimer l'image des tableaux
            newImages.splice(index, 1);
            newImageFiles.splice(index, 1);
            
            // Créer un nouveau FileList en utilisant un DataTransfer
            const dataTransfer = new DataTransfer();
            newImageFiles.forEach(file => {
                dataTransfer.items.add(file);
            });
            
            // Créer un nouvel objet qui correspond à l'interface attendue
            const newFormData = {
                ...prev,
                images: newImages,
                imageFiles: dataTransfer.files
            };
            
            return newFormData as PropertyFormData;
        });
    };


    const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProperty) {
        console.error('Aucun bien en cours de modification');
        return;
    }

    // Validation côté client
    if (!formData.title || !formData.type || !formData.location || !formData.price || !formData.categorie) {
        await Swal.fire({
            icon: 'error',
            title: 'Erreur de validation',
            text: 'Veuillez remplir tous les champs obligatoires',
        });
        return;
    }

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const formDataToSend = new FormData();
        
        // Ajouter les champs de base
        formDataToSend.append('_method', 'PUT');
        formDataToSend.append('_token', csrfToken);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('description', formData.description || '');
        formDataToSend.append('categorie', formData.categorie);
        
        // Ajouter les images
        if (formData.images && formData.images.length > 0) {
            // Envoyer d'abord les URLs des images existantes
            formData.images.forEach((image, index) => {
                if (typeof image === 'string' && !image.startsWith('blob:')) {
                    // C'est une URL existante, on l'envoie comme URL
                    formDataToSend.append(`existing_images[]`, image);
                }
            });
            
            // Puis ajouter les nouveaux fichiers
            if (formData.imageFiles) {
                Array.from(formData.imageFiles).forEach((file: File, index: number) => {
                    // Vérifier si c'est un nouveau fichier (commence par blob:)
                    if (file instanceof File) {
                        console.log('Ajout du fichier:', file.name, 'taille:', file.size, 'type:', file.type);
                        formDataToSend.append(`new_images[]`, file);
                    }
                });
            }
        }

        console.log('Envoi de la requête de mise à jour...');
        const response = await fetch(`/proprietaire/mes-biens/${editingProperty.id}`, {
            method: 'POST',  // Important: utiliser POST avec _method=PUT
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: formDataToSend,
        });

        console.log('Réponse reçue, statut:', response.status);
        let data;
        try {
            data = await response.json();
            console.log('Données de la réponse:', data);
        } catch (jsonError) {
            console.error('Erreur lors du parsing de la réponse JSON:', jsonError);
            throw new Error('Réserve du serveur invalide');
        }

        if (!response.ok) {
            console.error('Erreur du serveur:', {
                status: response.status,
                statusText: response.statusText,
                data: data
            });
            
            let errorMessage = data.message || `Erreur ${response.status} lors de la mise à jour du bien`;
            if (data.errors) {
                errorMessage = Object.values(data.errors).flat().join('\n');
            }
            throw new Error(errorMessage);
        }

        // Mettre à jour la liste des propriétés
        if (data.property) {
            console.log('Mise à jour du bien dans l\'état local');
            setProperties(prev => 
                prev.map(property => 
                    property.id === editingProperty.id ? data.property : property
                )
            );
        }
        
        // Fermer la modale et réinitialiser le formulaire
        setShowEditPropertyModal(false);
        setEditingProperty(null);
        resetForm();
        
        await Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: data.message || 'Le bien a été mis à jour avec succès',
        });
        
    } catch (error) {
        console.error('Erreur détaillée:', {
            error,
            message: error instanceof Error ? error.message : 'Erreur inconnue',
            stack: error instanceof Error ? error.stack : undefined
        });
        
        await Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error instanceof Error ? error.message : 'Une erreur est survenue lors de la mise à jour du bien',
        });
    }
};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation des champs obligatoires
        if (!formData.title || !formData.type || !formData.location || 
            !formData.price || !formData.categorie || !formData.images || 
            formData.images.length === 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Erreur de validation',
                text: 'Veuillez remplir tous les champs obligatoires et sélectionner au moins une image',
            });
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const formDataToSend = new FormData();
            
            // Ajouter les champs de base
            formDataToSend.append('_token', csrfToken);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('categorie', formData.categorie);
            
            // Ajouter les images
            if (formData.imageFiles) {
                Array.from(formData.imageFiles).forEach((file: File, index: number) => {
                    formDataToSend.append(`images[${index}]`, file);
                });
            }
            
            const response = await fetch('/proprietaire/mes-biens', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formDataToSend,
                credentials: 'same-origin',
            });
            
            const data = await response.json().catch(() => ({}));
            
            if (!response.ok) {
                let errorMessage = data.message || 'Erreur lors de la soumission du formulaire';
                if (data.errors) {
                    errorMessage = Object.values(data.errors).flat().join('\n');
                }
                throw new Error(errorMessage);
            }
            
            // Mettre à jour la liste des propriétés
            if (data.property) {
                setProperties(prev => [...prev, data.property]);
            }
            
            // Fermer la modale et réinitialiser le formulaire
            setShowAddPropertyModal(false);
            resetForm();
            
            await Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: data.message || 'Le bien a été ajouté avec succès',
            });
            
            // Rediriger si nécessaire
            if (data.redirect) {
                window.location.href = data.redirect;
            }
            
        } catch (error) {
            console.error('Erreur lors de l\'ajout du bien:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout du bien',
            });
        }
    };

    const handleDisable = async (propertyId: number) => {
        const { value: formValues, isConfirmed } = await Swal.fire({
            title: 'Désactiver ce bien en location',
            html:
                '<p>Veuillez entrer les informations du locataire :</p>' +
                '<input id="swal-input1" class="swal2-input" placeholder="Nom du locataire" required>' +
                '<input id="swal-input2" class="swal2-input" placeholder="Prénom du locataire" required>' +
                '<input id="swal-input3" class="swal2-input" placeholder="Téléphone du locataire" required>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#eab308',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Confirmer la désactivation',
            cancelButtonText: 'Annuler', 
            preConfirm: () => {
                return {
                    nom: (document.getElementById('swal-input1') as HTMLInputElement)?.value,
                    prenom: (document.getElementById('swal-input2') as HTMLInputElement)?.value,
                    telephone: (document.getElementById('swal-input3') as HTMLInputElement)?.value
                };
            },
            willOpen: () => {
                // Ajouter la validation des champs
                const inputs = Swal.getPopup()?.querySelectorAll('input');
                if (inputs) {
                    inputs.forEach(input => {
                        input.required = true;
                    });
                }
            }
        });

        if (isConfirmed && formValues) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const response = await fetch(`/proprietaire/mes-biens/${propertyId}/disable`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        client_nom: formValues.nom,
                        client_prenom: formValues.prenom,
                        client_telephone: formValues.telephone
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.message || 'Erreur lors de la désactivation du bien');
                }

                // Mettre à jour l'état local pour refléter la désactivation
                setProperties(prev => 
                    prev.map(property => 
                        property.id === propertyId 
                            ? { ...property, status: 'Désactivé' } 
                            : property
                    )
                );
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Désactivé!',
                    text: data.message || 'Le bien a été désactivé avec succès.',
                });
            } catch (error) {
                console.error('Erreur lors de la désactivation du bien:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error instanceof Error ? error.message : 'Une erreur est survenue lors de la désactivation du bien',
                });
            }
        }
    };

    const handleReactivationRequest = async (propertyId: number) => {
        const { value: reason, isConfirmed } = await Swal.fire({
            title: 'Demande de republication',
            input: 'textarea',
            inputLabel: 'Pourquoi souhaitez-vous remettre ce bien en location ?',
            inputPlaceholder: 'Décrivez brièvement la raison de votre demande...',
            inputAttributes: {
                'aria-label': 'Décrivez brièvement la raison de votre demande',
                required: 'true'
            },
            showCancelButton: true,
            confirmButtonText: 'Envoyer la demande',
            cancelButtonText: 'Annuler',
            inputValidator: (value) => {
                if (!value) {
                    return 'Veuillez indiquer une raison pour votre demande';
                }
                if (value.length < 10) {
                    return 'La raison doit contenir au moins 10 caractères';
                }
                return null;
            }
        });

        if (isConfirmed && reason) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const response = await fetch(`/proprietaire/mes-biens/${propertyId}/request-reactivation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        reactivation_reason: reason
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Mettre à jour la liste des propriétés avec la nouvelle valeur
                    setProperties(properties.map(p => 
                        p.id === propertyId 
                            ? { 
                                ...p, 
                                status: 'En attente de réactivation',
                                reactivation_requested: true,
                                reactivation_reason: reason
                            } 
                            : p
                    ));
                    
                    await Swal.fire({
                        icon: 'success',
                        title: 'Demande envoyée',
                        text: 'Votre demande de republication a été envoyée avec succès. Elle sera examinée par un administrateur.',
                        confirmButtonColor: '#3085d6',
                    });
                } else {
                    throw new Error(data.message || 'Erreur lors de l\'envoi de la demande');
                }
            } catch (error) {
                console.error('Erreur lors de la demande de republication:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'envoi de votre demande',
                    confirmButtonColor: '#d33',
                });
            }
        }
    };

    const handleDirectDelete = async (propertyId: number) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Supprimer définitivement ce bien ?',
            text: 'Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce bien ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        });

        if (isConfirmed) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const response = await fetch(`/proprietaire/mes-biens/${propertyId}/delete-direct`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erreur lors de la suppression du bien');
                }

                // Mettre à jour l'état local en supprimant le bien
                setProperties(prev => prev.filter(property => property.id !== propertyId));
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Supprimé!',
                    text: data.message || 'Le bien a été supprimé avec succès.',
                });
            } catch (error) {
                console.error('Erreur lors de la suppression du bien:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression du bien'
                });
            }
        }
    };

    const handleDelete = async (propertyId: number) => {
        const { value: formValues, isConfirmed } = await Swal.fire({
            title: 'Supprimer ce bien',
            html:
                '<p>Veuillez entrer les informations de l\'acquéreur :</p>' +
                '<input id="swal-input1" class="swal2-input" placeholder="Nom de l\'acquéreur" required>' +
                '<input id="swal-input2" class="swal2-input" placeholder="Prénom de l\'acquéreur" required>' +
                '<input id="swal-input3" class="swal2-input" placeholder="Téléphone de l\'acquéreur" required>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Confirmer la suppression',
            cancelButtonText: 'Annuler',
            preConfirm: () => {
                return {
                    nom: (document.getElementById('swal-input1') as HTMLInputElement)?.value,
                    prenom: (document.getElementById('swal-input2') as HTMLInputElement)?.value,
                    telephone: (document.getElementById('swal-input3') as HTMLInputElement)?.value
                };
            }
        });

        if (isConfirmed && formValues) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const response = await fetch(`/proprietaire/mes-biens/${propertyId}/delete-with-client`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        client_nom: formValues.nom,
                        client_prenom: formValues.prenom,
                        client_telephone: formValues.telephone
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erreur lors de la vente du bien');
                }

                // Mettre à jour l'état local pour refléter le changement de statut
                setProperties(prev => 
                    prev.map(property => 
                        property.id === propertyId 
                            ? { 
                                ...property, 
                                status: 'Vendu',
                                client_name: formValues.nom,
                                client_surname: formValues.prenom,
                                client_phone: formValues.telephone
                            } 
                            : property
                    )
                );
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Vendu!',
                    text: data.message || 'Le bien a été marqué comme vendu avec succès.',
                });
            } catch (error) {
                console.error('Erreur lors de la suppression du bien:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression du bien'
                });
            }
        }
    };

    const filteredProperties = (Array.isArray(properties) ? properties : [])
        .filter((prop: Property) => prop && `${prop.title || ''} ${prop.location || ''}`.toLowerCase().includes((searchTerm || '').toLowerCase()))
        .filter((prop: Property) => (selectedStatus ? prop.offre === selectedStatus : true))
        .sort((a: Property, b: Property) => {
            return sortOrder === 'asc' ? (a.id || 0) - (b.id || 0) : (b.id || 0) - (a.id || 0);
        });

    return (
        <div>
            <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                <h2 className="mb-2 text-2xl font-bold">Liste de mes biens</h2>
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowAddPropertyModal(true)}
                        className="flex items-center gap-2 rounded-md border px-5 py-2 font-bold text-gray-600 hover:bg-gray-100"
                    >
                        <Plus className="h-4 w-4 self-center" />
                        Ajouter un bien
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        placeholder="Rechercher un bien..."
                        className="w-full rounded border px-4 py-2 font-bold md:w-1/2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button
                        className="flex items-center gap-2 rounded-md border px-5 py-2 font-bold text-gray-600 hover:bg-gray-100"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4" />
                        Filtres
                    </button>

                    <button
                        className="flex items-center gap-2 rounded-md border px-4 py-2 font-bold text-gray-600 hover:bg-gray-100"
                        onClick={() => setSortOrder('asc')}
                    >
                        <ArrowUpWideNarrow className="h-4 w-4" />
                        Plus récent
                    </button>

                    <button
                        className="flex items-center gap-2 rounded-md border px-4 py-2 font-bold text-gray-600 hover:bg-gray-100"
                        onClick={() => setSortOrder('desc')}
                    >
                        <ArrowDownWideNarrow className="h-4 w-4" />
                        Plus ancien
                    </button>
                </div>

                {/* Bannière de filtre */}
                {showFilters && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedStatus('')}
                            className={`rounded-full px-4 py-1 text-sm font-semibold ${
                                selectedStatus === '' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            Tous
                        </button>
                        <button
                            onClick={() => setSelectedStatus('En vente')}
                            className={`rounded-full px-4 py-1 text-sm font-semibold ${
                                selectedStatus === 'En vente' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                            En vente
                        </button>
                        <button
                            onClick={() => setSelectedStatus('En location')}
                            className={`rounded-full px-4 py-1 text-sm font-semibold ${
                                selectedStatus === 'En location' ? 'bg-[#2E7D32] text-white' : 'bg-green-100 text-green-700'
                            }`}
                        >
                            En location
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProperties.map((property) => (
                        <div key={property.id} className="relative">
                            <PropertyCard property={property} />
                            <div className="absolute top-2 right-2 flex gap-2">
                                {property.status === 'Loué' ? (
                                    <button
                                        onClick={() => handleReactivationRequest(property.id)}
                                        className="rounded-full bg-green-500 p-2 text-white hover:bg-green-600"
                                        title="Demander la republication"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                ) : property.status === 'Vendu' ? (
                                    <div className="rounded-full bg-green-500 p-2 text-white hover:bg-green-600">
                                        Ce bien est vendu
                                    </div>
                                ) : property.status === 'En attente' ? (
                                    <>
                                    <button
                                        onClick={() => openEditModal(property)}
                                        className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                                        title="Modifier"
                                        >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDirectDelete(property.id)}
                                        className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                                        title="Supprimer définitivement"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                        </>
                                ) : property.status === 'Rejeté' ? (
                                    <div className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600">
                                        Ce bien est rejeté
                                    </div>
                                ) : property.status !== 'Approuvé' ? (
                                    <button
                                        onClick={() => handleReactivationRequest(property.id)}
                                        className="rounded-full bg-green-500 p-2 text-white hover:bg-green-600"
                                        title="Demander la republication"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                ) : property.status !== 'Approuvé' ? (
                                    <button
                                        onClick={() => openEditModal(property)}
                                        className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                                        title="Modifier"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                ) : (
                                    property.offre === 'En location' ? (
                                        <button
                                            onClick={() => handleDisable(property.id)}
                                            className="rounded-full bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                                            title="Désactiver"
                                        >
                                            <Lock className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal d'ajout de bien */}
            {showAddPropertyModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-200 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-xl font-bold">Ajouter un nouveau bien</h3>
                            <button
                                onClick={() => {
                                    setShowAddPropertyModal(false);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 p-6">
                            <div className="mb-4 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Titre du bien</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Home className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Ex: Appartement de luxe..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Catégorie de bien</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center py-2.5 pl-3">
                                            <Building className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Sélectionner un type</option>
                                            {Array.isArray(categories) && categories.map((category) => (
                                                <option key={category.id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                                    <select
                                        name="categorie"
                                        value={formData.categorie}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        <option value="En vente">En vente</option>
                                        <option value="En location">En location</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Localisation</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center py-2.5 pl-3">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Ex: Lomé, Bè"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center py-2.5 pl-3">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Ex: 2500000"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Description du bien</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="block min-h-[100px] w-full rounded-md border-gray-300 px-3 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Décrivez votre bien en détail..."
                                />
                            </div>

                            <div className="mb-6 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Image du bien</label>

                                {formData.images && formData.images.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img 
                                                    src={image} 
                                                    alt={`Aperçu ${index + 1}`} 
                                                    className="h-40 w-full rounded-md object-cover" 
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Supprimer l'image"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                                        <div className="space-y-1 text-center">
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none hover:text-blue-500"
                                                >
                                                    <span>Télécharger une image</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageChange}
                                                        required
                                                    />
                                                </label>
                                                <p className="pl-1">ou glissez-déposez</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddPropertyModal(false);
                                        resetForm();
                                    }}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de modification de bien */}
            {showEditPropertyModal && editingProperty && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-xl font-bold">Modifier le bien</h3>
                            <button
                                onClick={() => {
                                    setShowEditPropertyModal(false);
                                    setEditingProperty(null);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Lock className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4 p-6" encType="multipart/form-data">
                            <div className="mb-4 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Titre du bien</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Home className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Ex: Appartement de luxe..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Type de bien</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center py-2.5 pl-3">
                                            <Building className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Sélectionner un type</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                                    <select
                                        name="categorie"
                                        value={formData.categorie}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        <option value="En vente">En vente</option>
                                        <option value="En location">En location</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Localisation</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center py-2.5 pl-3">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Ex: Lomé, Bè"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center py-2.5 pl-3">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-md border-gray-300 py-2.5 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Ex: 2500000"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Description du bien</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Décrivez votre bien en détail..."
                                />
                            </div>

                            <div className="mb-6 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Images du bien
                                </label>
                                
                                <div className="space-y-4">
                                    {/* Affichage des images existantes */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {formData.images && formData.images.length > 0 ? (
                                            formData.images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img 
                                                        src={image} 
                                                        alt={`Aperçu ${index + 1}`} 
                                                        className="h-32 w-full object-cover rounded-md"
                                                    />
                                                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleReplaceImage(index);
                                                            }}
                                                            className="bg-blue-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Remplacer l'image"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveImage(index);
                                                            }}
                                                            className="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Supprimer l'image"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 col-span-3 text-center py-4">
                                                Aucune image pour le moment
                                            </p>
                                        )}
                                    </div>

                                    {/* Bouton pour ajouter des images */}
                                    <div>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-medium text-blue-600 hover:text-blue-500">Cliquez pour télécharger</span> ou glissez-déposez
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF jusqu'à 10MB</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                multiple 
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditPropertyModal(false);
                                        setEditingProperty(null);
                                        resetForm();
                                    }}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Modifier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertyList;
