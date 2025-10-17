import React from "react";

export default function About() {
  return (
    <>
      {/* Intro Single Section */}
      <section className="py-24 bg-white md:py-32 md:px-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="lg:w-2/3 mb-2 lg:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 border-l-4 border-[#2E7D32] pl-4 h-fit">
                Merci de nous avoir fait confiance.
              </h1>
            </div>
            <div className="lg:w-1/3 flex justify-start lg:justify-end items-center">
              <nav aria-label="breadcrumb">
                <ol className="flex space-x-2 text-sm text-gray-600">
                  <li>
                    <a href="/" className="hover:underline">
                      Accueil
                    </a>
                  </li>
                  <li>/</li>
                  <li className="text-green-600 font-semibold">A propos</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 md:px-24">
        <div className="container mx-auto px-4 space-y-12">
          {/* Top Image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/assets/img/slide-about-1.jpg"
                alt="Slide about"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute top-8 left-8 bg-white px-6 py-4 shadow-md">
              <h3 className="text-xl font-bold text-gray-800">
                YawaImmo
                <span className="block h-1 w-10 bg-[#2E7D32] my-2"></span>
                <br />
                + 10 ans d'expérience
              </h3>
              <p className="text-sm text-gray-500">Spécialisée dans la vente et la location de biens immobiliers</p>
            </div>
          </div>

          {/* Lower Content */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Image */}
            <div className="lg:w-1/2">
              <img
                src="/assets/img/about-1.jpg"
                alt="About image"
                className="w-full h-100 object-cover rounded-lg"
              />
            </div>

            {/* Text Content */}
            <div className="lg:w-1/2">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  YawaImmo
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Spécialisée dans la vente et la location de biens immobiliers
              </p>
              <p className="text-gray-600">
                YawaImmo est une agence immobilière spécialisée dans la vente et la location de biens immobiliers. 
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
