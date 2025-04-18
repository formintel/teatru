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
  const [showTimes, setShowTimes] = useState([]);
  const [newShowTime, setNewShowTime] = useState({
    date: "",
    availableSeats: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShowTimeChange = (e) => {
    setNewShowTime({
      ...newShowTime,
      [e.target.name]: e.target.value,
    });
  };

  const addShowTime = () => {
    if (newShowTime.date && newShowTime.availableSeats) {
      setShowTimes([...showTimes, { ...newShowTime }]);
      setNewShowTime({ date: "", availableSeats: "" });
    }
  };

  const removeShowTime = (index) => {
    setShowTimes(showTimes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verifică dacă toate câmpurile obligatorii sunt completate
    const requiredFields = ['title', 'description', 'posterUrl', 'sala', 'numarLocuri', 'pret', 'regizor', 'durata', 'gen'];
    const missingFields = requiredFields.filter(field => !inputs[field] || inputs[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Te rog completează următoarele câmpuri obligatorii: ${missingFields.join(', ')}`);
      return;
    }

    // Verifică dacă numărul de locuri și prețul sunt numere valide
    if (isNaN(inputs.numarLocuri) || inputs.numarLocuri <= 0) {
      alert('Numărul de locuri trebuie să fie un număr pozitiv');
      return;
    }

    if (isNaN(inputs.pret) || inputs.pret <= 0) {
      alert('Prețul trebuie să fie un număr pozitiv');
      return;
    }

    if (isNaN(inputs.durata) || inputs.durata <= 0) {
      alert('Durata trebuie să fie un număr pozitiv');
      return;
    }

    // Verifică dacă există cel puțin o reprezentație programată
    if (showTimes.length === 0) {
      alert('Te rog adaugă cel puțin o reprezentație');
      return;
    }

    // Pregătește datele pentru trimitere
    const movieData = {
      title: inputs.title.trim(),
      description: inputs.description.trim(),
      posterUrl: inputs.posterUrl.trim(),
      releaseDate: inputs.releaseDate || new Date().toISOString(),
      featured: inputs.featured,
      sala: inputs.sala.trim(),
      numarLocuri: Number(inputs.numarLocuri),
      pret: Number(inputs.pret),
      regizor: inputs.regizor.trim(),
      durata: Number(inputs.durata),
      gen: inputs.gen.trim(),
      actors: actors.map(actor => actor.trim()),
      showTimes: showTimes.map(time => ({
        date: new Date(time.date).toISOString(),
        availableSeats: Number(time.availableSeats)
      }))
    };

    console.log('Date trimise către backend:', movieData);
    
    addMovie(movieData)
      .then((res) => {
        console.log('Răspuns de la server:', res);
        alert('Spectacolul a fost adăugat cu succes!');
        // Resetăm formularul
        setInputs({
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
        setActors([]);
        setShowTimes([]);
      })
      .catch((err) => {
        console.error('Eroare la adăugarea spectacolului:', err);
        alert(err.message || 'A apărut o eroare la adăugarea spectacolului');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
          Adaugă Spectacol Nou
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titlu
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Număr de Locuri
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
                Preț (RON)
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
                Durata (minute)
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Premierei
              </label>
              <input
                type="date"
                name="releaseDate"
                value={inputs.releaseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descriere
            </label>
            <textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                placeholder="Nume actor"
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
            <div className="mt-2 flex flex-wrap gap-2">
              {actors.map((actor, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date și Ore Disponibile
            </label>
            <div className="flex space-x-2">
              <input
                type="datetime-local"
                name="date"
                value={newShowTime.date}
                onChange={handleShowTimeChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="number"
                name="availableSeats"
                value={newShowTime.availableSeats}
                onChange={handleShowTimeChange}
                placeholder="Locuri disponibile"
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={addShowTime}
                className="px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-800 transition-colors duration-300"
              >
                Adaugă
              </button>
            </div>
            
              <div className="mt-4">
                <h4 className="font-medium mb-2">Reprezentații programate:</h4>
                <div className="space-y-2">
                  {showTimes.map((time, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">
                          {new Date(time.date).toLocaleString('ro-RO', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="ml-4 text-gray-600">
                          {time.availableSeats} locuri disponibile
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeShowTime(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={inputs.featured}
              onChange={(e) => setInputs({ ...inputs, featured: e.target.checked })}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Spectacol Recomandat
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