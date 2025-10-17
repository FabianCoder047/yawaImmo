  import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-10 text-gray-700">
      {/* Section principale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-1 justify-center place-items-center">
          {/* Bloc 1 */}
          <div>
            <h3 className="text-xl font-semibold text-[#2E7D32] mb-4"><span className="text-black">Yawa</span>Immo</h3>
            <p className="text-gray-600 mb-4">
              YawaImmo est une plateforme de vente et de location de biens immobiliers.
            </p>
            <ul className="text-sm space-y-2">
              <li><span className="font-medium">Phone:</span> +228 92 21 33 73</li>
              <li><span className="font-medium">Email:</span> contact@example.com</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bas de page */}
      <div className="border-t border-gray-200 mt-10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-4 text-center">
          {/* Liens */}
          <nav>
            <ul className="flex flex-wrap justify-center space-x-4 text-sm text-[#2E7D32]">
              {["Accueil", "A propos", "Logement", "Blog", "Contact"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-green-500 transition">{item}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Réseaux sociaux */}
          <div className="flex space-x-4 text-[#2E7D32] text-xl">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
