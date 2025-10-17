import { Link } from '@inertiajs/react';
import { FaHandshake } from 'react-icons/fa';
import { HiOutlineBuildingStorefront, HiOutlineHomeModern } from 'react-icons/hi2';

const services = [
    {
        title: 'Achat de maisons',
        description:
            "Trouvez la maison idéale parmi nos nombreuses offres. Nous vous accompagnons tout au long du processus d'achat, en toute sécurité et transparence.",
        icon: <HiOutlineHomeModern className="text-4xl text-green-500" />,
        link: '/properties',
        linkText: 'Louer un bien',
    },
    {
        title: 'Locations',
        description:
            "Vous cherchez à louer un appartement, une maison ou un local commercial ? Nous avons ce qu'il vous faut, adapté à votre budget et à votre style de vie.",
        icon: <HiOutlineBuildingStorefront className="text-4xl text-green-500" />,
        link: '/properties',
        linkText: 'Louer un bien',
    },
    {
        title: 'Ventes / Locations',
        description:
            'Vous désirez vendre ou louer un bien ? Notre équipe vous aide à valoriser votre propriété et à conclure rapidement une vente au meilleur prix.',
        icon: <FaHandshake className="text-4xl text-green-500" />,
        link: '/register/proprietaire',
        linkText: 'Devenir propriétaire',
    },
];

export default function ServicesSection() {
    return (
        <section className="bg-gray-50 py-16" id="services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-4">
                {/* Title */}
                <div className="mb-12 text-left">
                    <h2 className="inline-block border-b-4 border-green-500 pb-2 text-3xl font-bold text-gray-800">Nos Services</h2>
                </div>

                {/* Cards */}
                <div className="grid gap-8 md:grid-cols-3">
                    {services.map((service, index) => (
                        <div key={index} className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-4">
                                <div>{service.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                            </div>
                            <p className="mb-4 text-gray-600">{service.description}</p>
                            <Link
                                href={service.link}
                                className="rounded-lg bg-[#2E7D32] px-6 py-2 text-center font-medium text-white transition duration-300 hover:bg-green-600"
                            >
                                {service.linkText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
