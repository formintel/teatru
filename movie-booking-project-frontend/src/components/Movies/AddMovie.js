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
    console.log({ ...inputs, actors, showTimes });
    addMovie({ ...inputs, actors, showTimes })
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
          {/* Existing form fields */}
          
          {/* New ShowTimes Section */}
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
            
            {showTimes.length > 0 && (
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
            )}
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