import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt, FaShareAlt } from 'react-icons/fa'

export default function Contact() {
  return (
    <>
      {/* Intro Single */}
      <section className="py-24 bg-white md:py-32 md:px-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="lg:w-2/3 mb-6 lg:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 border-l-4 border-[#2E7D32] pl-4">Pour des questions, contactez-nous</h1>
              <p className="text-gray-600 leading-relaxed">
                Nous sommes à votre disposition pour répondre à vos questions et vous aider dans vos démarches immobilières.
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-start lg:justify-end items-center">
              <nav aria-label="breadcrumb">
                <ol className="flex space-x-2 text-sm text-gray-600">
                  <li><a href="/" className="hover:underline">Accueil</a></li>
                  <li>/</li>
                  <li className="text-[#2E7D32] font-semibold">Contact</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 md:px-24">
        <div className="container mx-auto px-4 space-y-12">

          {/* Google Map */}
          <div className="rounded-md overflow-hidden shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d623.535xxxxxx!2d1.1987173!3d6.1454916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10215f4d74be1d67%3A0x2d5b35a61f09598a!2sColl%C3%A8ge%20Protestant%20Lom%C3%A9%20Tokoin!5e0!3m2!1sfr!2stg!4v169xxxxxxx"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="w-full"
            ></iframe>
          </div>

          {/* Contact Form & Info */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Contact Form */}
            <div className="lg:w-2/3">
              <form className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <input type="text" name="name" placeholder="Votre Nom" required className="w-full p-3 border border-gray-300 rounded" />
                  <input type="email" name="email" placeholder="Votre Email" required className="w-full p-3 border border-gray-300 rounded" />
                </div>
                <input type="text" name="subject" placeholder="Objet" required className="w-full p-3 border border-gray-300 rounded" />
                <textarea name="message" rows={6} placeholder="Message" required className="w-full p-3 border border-gray-300 rounded"></textarea>

                {/* Feedback placeholders */}

                <div className="text-center">
                  <button type="submit" className="px-6 py-3 bg-[#2E7D32] text-white rounded hover:bg-green-700 transition">Envoyer</button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:w-1/3 space-y-6">
              <div className="flex items-start gap-4">
                <FaEnvelope className="text-2xl text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Contactez-nous</h4>
                  <p className="text-sm">Email: <span className="text-green-600">contact@example.com</span></p>
                  <p className="text-sm">Téléphone: <span className="text-green-600">+228 92 21 33 73</span></p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-2xl text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Trouvez-nous à</h4>
                  <p className="text-sm">Collège Protestant , Lomé, Togo</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaShareAlt className="text-2xl text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Réseaux sociaux</h4>
                  <div className="flex space-x-4 mt-2 text-gray-600 text-lg">
                    <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
                    <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
                    <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
                    <a href="#" className="hover:text-blue-700"><FaLinkedinIn /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
