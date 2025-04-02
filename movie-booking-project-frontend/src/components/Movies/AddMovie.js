import React, { useState } from "react";
import { addMovie } from "../../api-helpers/api-helpers";

const AddMovie = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    posterUrl: "",
    releaseDate: "",
    featured: false,
    sala: "",
    numarLocuri: "",
    pret: "",
    regizor: "",
    durata: "",
    gen: "",
  });
  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs, actors);
    addMovie({ ...inputs, actors })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
          Adaugă Spectacol Nou
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titlu Spectacol
            </label>
            <input
              type="text"
              name="title"
              value={inputs.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descriere
            </label>
            <textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Poster
            </label>
            <input
              type="text"
              name="posterUrl"
              value={inputs.posterUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Spectacolului
              </label>
              <input
                type="datetime-local"
                name="releaseDate"
                value={inputs.releaseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sala
              </label>
              <input
                type="text"
                name="sala"
                value={inputs.sala}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Număr Locuri
              </label>
              <input
                type="number"
                name="numarLocuri"
                value={inputs.numarLocuri}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preț Bilet
              </label>
              <input
                type="number"
                name="pret"
                value={inputs.pret}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durată (min)
              </label>
              <input
                type="number"
                name="durata"
                value={inputs.durata}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Regizor
              </label>
              <input
                type="text"
                name="regizor"
                value={inputs.regizor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gen
              </label>
              <input
                type="text"
                name="gen"
                value={inputs.gen}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actori
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Adaugă actor"
              />
              <button
                type="button"
                onClick={() => {
                  if (actor.trim()) {
                    setActors([...actors, actor.trim()]);
                    setActor("");
                  }
                }}
                className="px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-800 transition-colors duration-300"
              >
                Adaugă
              </button>
            </div>
            {actors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {actors.map((actor, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center"
                  >
                    {actor}
                    <button
                      type="button"
                      onClick={() => setActors(actors.filter((_, i) => i !== index))}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={inputs.featured}
              onChange={(e) => setInputs({ ...inputs, featured: e.target.checked })}
              className="h-4 w-4 text-red-900 focus:ring-red-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Spectacol Featured
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-900 text-white rounded-md hover:bg-red-800 transition-colors duration-300 font-semibold"
          >
            Adaugă Spectacol
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
