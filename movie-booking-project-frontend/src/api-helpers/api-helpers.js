// src/api-helpers/api-helpers.js
import axios from "axios";

// Configurare pentru axios
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Funcție pentru a obține header-ul de autentificare
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Preluare toate spectacolele
export const getAllMovies = async (inCurs = false) => {
  try {
    const res = await axios.get(`/movie?inCurs=${inCurs}`);
    if (res.status !== 200) {
      throw new Error("Eroare la preluarea spectacolelor");
    }
    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea spectacolelor:", err);
    throw err;
  }
};

// Preluare detalii spectacol
export const getMovieDetails = async (id) => {
  try {
    const res = await axios.get(`/movie/${id}`);
    if (res.status !== 200) {
      throw new Error("Eroare la preluarea detaliilor spectacolului");
    }
    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea detaliilor spectacolului:", err);
    throw err;
  }
};

// Autentificare utilizator
export const sendUserAuthRequest = async (inputs, signup) => {
  try {
    console.log("Încercăm să trimitem request către:", `/user/${signup ? "signup" : "login"}`);
    console.log("Date trimise:", inputs);

    const res = await axios.post(`/user/${signup ? "signup" : "login"}`, inputs);
    console.log("Răspuns primit:", res);

    if (signup && res.status === 201) {
      return { message: "Înregistrare reușită! Te poți autentifica acum.", success: true };
    }

    return {
      ...res.data,
      role: "user", // Adaugă rolul
    };
  } catch (err) {
    console.log("Eroare la autentificare - detalii complete:", {
      error: err,
      response: err.response,
      data: err.response?.data,
      status: err.response?.status,
    });

    if (!err.response) {
      throw { message: "Nu s-a putut conecta la server. Verifică dacă serverul backend este pornit." };
    }

    if (err.response?.data?.message) {
      throw { message: err.response.data.message };
    }

    if (err.response?.data?.error?.code === 11000) {
      throw { message: "Acest email este deja înregistrat. Te rugăm să folosești alt email sau să te autentifici." };
    }

    throw { message: "Email sau parolă incorecte" };
  }
};

// Autentificare admin
export const sendAdminAuthRequest = async (data) => {
  try {
    console.log("Încercăm să trimitem request către /admin/login");
    console.log("Date trimise:", data);

    const res = await axios.post("/admin/login", {
      email: data.email,
      password: data.password,
    });

    console.log("Răspuns primit:", res);
    
    // Salvăm ID-ul adminului în localStorage
    if (res.data.id) {
      localStorage.setItem("adminId", res.data.id);
    }

    return {
      ...res.data,
      role: "admin", // Adaugă rolul
    };
  } catch (err) {
    console.log("Eroare la autentificare admin - detalii complete:", {
      error: err,
      response: err.response,
      data: err.response?.data,
      status: err.response?.status,
    });

    if (!err.response) {
      throw { message: "Nu s-a putut conecta la server. Verifică dacă serverul backend este pornit." };
    }

    if (err.response?.data?.message) {
      throw { message: err.response.data.message };
    }

    throw { message: "Email sau parolă incorecte" };
  }
};

// Adaugă un spectacol
export const addMovie = async (data) => {
  try {
    console.log("Încercăm să adăugăm spectacolul:", data);
    
    const res = await axios.post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        posterUrl: data.posterUrl,
        releaseDate: data.releaseDate,
        featured: data.featured || false,
        actors: data.actors || [],
        showTimes: data.showTimes || [],
        sala: data.sala,
        numarLocuri: data.numarLocuri,
        pret: data.pret,
        regizor: data.regizor,
        durata: data.durata,
        gen: data.gen
      },
      {
        headers: getAuthHeader(),
      }
    );

    if (res.status !== 201) {
      throw new Error("Eroare la adăugarea spectacolului");
    }

    console.log("Spectacol adăugat cu succes:", res.data);
    return res.data;
  } catch (err) {
    console.error("Eroare la adăugarea spectacolului:", err.response?.data || err);
    throw err.response?.data || { message: "Eroare la adăugarea spectacolului" };
  }
};

// Actualizează un spectacol
export const updateMovie = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    console.log("Date trimise către backend:", data);

    // Pregătim datele pentru actualizare
    const updateData = {
      title: data.title,
      description: data.description,
      posterUrl: data.posterUrl,
      pret: data.pret,
      gen: data.gen,
      regizor: data.regizor,
      durata: data.durata,
      sala: data.sala,
      numarLocuri: data.numarLocuri,
      actors: data.actors,
      showTimes: data.showTimes.map(showTime => ({
        _id: showTime._id,
        date: new Date(showTime.date).toISOString(),
        availableSeats: showTime.availableSeats || data.numarLocuri
      }))
    };

    console.log("Date procesate pentru actualizare:", updateData);

    const response = await axios.put(
      `${axios.defaults.baseURL}/movie/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Eroare la actualizarea spectacolului:", err);
    throw err;
  }
};

// Șterge un spectacol
export const deleteMovie = async (id) => {
  try {
    const res = await axios.delete(`/movie/${id}`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la ștergerea spectacolului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la ștergerea spectacolului:", err);
    throw err;
  }
};

// Anulează un spectacol
export const cancelMovie = async (id) => {
  try {
    const res = await axios.post(
      `/movie/${id}/cancel`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    if (res.status !== 200) {
      throw new Error("Eroare la anularea spectacolului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la anularea spectacolului:", err);
    throw err;
  }
};

// Creează o rezervare
export const newBooking = async (data) => {
  try {
    const res = await axios.post("/booking", {
      movie: data.movie,
      seatNumber: data.seatNumber,
      date: data.date,
      user: localStorage.getItem("userId"),
      showTimeId: data.showTimeId,
    });

    if (res.status !== 201) {
      throw new Error("Eroare la crearea rezervării");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la crearea rezervării:", err);
    throw err;
  }
};

// Preluare locurile ocupate
export const getOccupiedSeats = async (movieId, showTimeId) => {
  try {
    const res = await axios.get(`/booking/occupied-seats?movieId=${movieId}&showTimeId=${showTimeId}`);
    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea locurilor ocupate:", err);
    throw err;
  }
};

// Preluare rezervările utilizatorului
export const getUserBooking = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/bookings/${id}`);

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea rezervărilor utilizatorului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea rezervărilor utilizatorului:", err);
    throw err;
  }
};

// Șterge o rezervare
export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/booking/${id}`);

    if (res.status !== 200) {
      throw new Error("Eroare la ștergerea rezervării");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la ștergerea rezervării:", err);
    throw err;
  }
};

// Preluare detalii utilizator
export const getUserDetails = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await axios.get(`/user/${id}`);

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea detaliilor utilizatorului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea detaliilor utilizatorului:", err);
    throw err;
  }
};

// Preluare detalii admin
export const getAdminById = async () => {
  try {
    const adminId = localStorage.getItem("userId"); // Folosim userId (unificat)
    const res = await axios.get(`/admin/${adminId}`);

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea detaliilor adminului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea detaliilor adminului:", err);
    throw err;
  }
};

// Preluare toate rezervările (pentru admin)
export const getAllBookings = async () => {
  try {
    const res = await axios.get("/admin/bookings", {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea rezervărilor");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea rezervărilor:", err);
    throw err;
  }
};

// Preluare statistici (pentru admin)
export const getStatistics = async () => {
  try {
    const res = await axios.get("/admin/statistics", {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea statisticilor");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea statisticilor:", err);
    throw err;
  }
};

// Obține datele adminului
export const getAdminData = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      throw new Error("Nu există admin autentificat");
    }

    const res = await axios.get(`/admin/${adminId}`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea datelor adminului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea datelor adminului:", err);
    throw err;
  }
};

// Obține rezervările adminului
export const getAdminBookings = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      throw new Error("Nu există admin autentificat");
    }

    const res = await axios.get(`/admin/${adminId}/bookings`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea rezervărilor");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea rezervărilor:", err);
    throw err;
  }
};

// Obține statisticile adminului
export const getAdminStatistics = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      throw new Error("Nu există admin autentificat");
    }

    const res = await axios.get(`/admin/${adminId}/statistics`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea statisticilor");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea statisticilor:", err);
    throw err;
  }
};