import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
  } from "react-icons/fa";
  
  const agents = [
    {
      name: "Kossi Agbéyomé",
      image: "/assets/img/agent-1.jpg",
      phone: "+228 90 12 34 56",
      email: "kossi.agbeyome@immo.tg",
      link: "/agent/kossi",
      description:
        "Professionnel de l’immobilier avec plus de 10 ans d’expérience dans la vente de biens résidentiels à Lomé et ses environs.",
    },
    {
      name: "Afi Mensah",
      image: "/assets/img/agent-2.jpg",
      phone: "+228 91 23 45 67",
      email: "afi.mensah@immo.tg",
      link: "/agent/afi",
      description:
        "Spécialiste des locations haut de gamme et gestion locative, reconnue pour sa rigueur et son sens du détail.",
    },
    {
      name: "Yawovi Tchalla",
      image: "/assets/img/agent-3.jpg",
      phone: "+228 98 76 54 32",
      email: "yawovi.tchalla@immo.tg",
      link: "/agent/yawovi",
      description:
        "Expert dans l’immobilier commercial, accompagne les entreprises dans leur implantation stratégique au Togo.",
    },
  ];
  
  export default function BestAgents() {
    return (
      <section className="py-16 bg-gray-50" id="meilleurs-agents">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24">
  
          {/* Section header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 pb-2">
              Meilleurs Agents
            </h2>
            <a href="/agents" className="text-green-600 hover:underline mt-4 md:mt-0">
              Voir tous les agents →
            </a>
          </div>
  
          {/* Agent Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {agents.map((agent, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-lg overflow-hidden group transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 leading-tight">
                    <a href={agent.link} className="hover:text-green-600">
                      {agent.name}
                    </a>
                  </h3>
                  <p className="text-gray-600 text-sm">{agent.description}</p>
                  <div className="text-sm text-gray-700">
                    <p>
                      <strong>Téléphone :</strong> {agent.phone}
                    </p>
                    <p>
                      <strong>Email :</strong> {agent.email}
                    </p>
                  </div>
                  <div className="flex justify-center mt-4 space-x-4 text-green-600 text-lg">
                    <a href="#"><FaFacebookF /></a>
                    <a href="#"><FaTwitter /></a>
                    <a href="#"><FaInstagram /></a>
                    <a href="#"><FaLinkedinIn /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
        </div>
      </section>
    );
  }
  