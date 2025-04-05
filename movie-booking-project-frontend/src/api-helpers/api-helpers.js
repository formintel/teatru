import axios from "axios";

// Configurare pentru axios
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.common["Content-Type"] = "application/json";

const BASE_URL = "http://localhost:5000";

export const getAllSpectacole = async () => {
  const res = await axios.get("/movie").catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("No Data");
  }

  const data = await res.data;
  return data;
};

export const getAllMovies = async () => {
  const res = await axios.get("/movie").catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("No Data");
  }

  const data = await res.data;
  return data;
};

export const sendUserAuthRequest = async (inputs, signup) => {
  try {
    console.log("Încercăm să trimitem request către:", `/user/${signup ? "signup" : "login"}`);
    console.log("Date trimise:", inputs);
    
    const res = await axios.post(`/user/${signup ? "signup" : "login"}`, inputs);
    console.log("Răspuns primit:", res);
    
    // Dacă este înregistrare reușită, returnăm un mesaj special
    if (signup && res.status === 201) {
      return { message: "Înregistrare reușită! Te poți autentifica acum.", success: true };
    }
    
    return res.data;
  } catch (err) {
    console.log("Eroare la autentificare - detalii complete:", {
      error: err,
      response: err.response,
      data: err.response?.data,
      status: err.response?.status
    });
    
    // Verificăm dacă serverul nu este pornit
    if (!err.response) {
      throw { message: "Nu s-a putut conecta la server. Verifică dacă serverul backend este pornit." };
    }
    
    // Verificăm dacă avem un mesaj de eroare specific
    if (err.response?.data?.message) {
      throw { message: err.response.data.message };
    }
    
    // Verificăm dacă este o eroare de duplicat
    if (err.response?.data?.error?.code === 11000) {
      throw { message: "Acest email este deja înregistrat. Te rugăm să folosești alt email sau să te autentifici." };
    }
    
    // Eroare generică
    throw { message: "Email sau parolă incorecte" };
  }
};

export const sendAdminAuthRequest = async (data) => {
  try {
    console.log("Încercăm să trimitem request către /admin/login");
    console.log("Date trimise:", data);
    
    const res = await axios.post("/admin/login", {
      email: data.email,
      password: data.password,
    });
    
    console.log("Răspuns primit:", res);
    return res.data;
  } catch (err) {
    console.log("Eroare la autentificare admin - detalii complete:", {
      error: err,
      response: err.response,
      data: err.response?.data,
      status: err.response?.status
    });
    
    // Verificăm dacă serverul nu este pornit
    if (!err.response) {
      throw { message: "Nu s-a putut conecta la server. Verifică dacă serverul backend este pornit." };
    }
    
    // Verificăm dacă avem un mesaj de eroare specific
    if (err.response?.data?.message) {
      throw { message: err.response.data.message };
    }
    
    // Eroare generică
    throw { message: "Email sau parolă incorecte" };
  }
};

export const getMovieDetails = async (id) => {
  const res = await axios.get(`/movie/${id}`).catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const getSpectacolDetails = async (id) => {
  const res = await axios.get(`/movie/${id}`).catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const newBooking = async (data) => {
  const res = await axios
    .post("/booking", {
      movie: data.movie,
      seatNumber: data.seatNumber,
      date: data.date,
      user: localStorage.getItem("userId"),
    })
    .catch((err) => console.log(err));

  if (res.status !== 201) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const getUserBooking = async () => {
  const id = localStorage.getItem("userId");
  const res = await axios
    .get(`/user/bookings/${id}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const deleteBooking = async (id) => {
  const res = await axios
    .delete(`/booking/${id}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unepxected Error");
  }

  const resData = await res.data;
  return resData;
};

export const getUserDetails = async () => {
  const id = localStorage.getItem("userId");
  const res = await axios.get(`/user/${id}`).catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const addMovie = async (data) => {
  const res = await axios
    .post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        posterUrl: data.posterUrl,
        fetaured: data.fetaured,
        actors: data.actors,
        admin: localStorage.getItem("adminId"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .catch((err) => console.log(err));

  if (res.status !== 201) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};

export const getAdminById = async () => {
  const adminId = localStorage.getItem("adminId");
  const res = await axios
    .get(`/admin/${adminId}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};

export const addSpectacol = async (data) => {
  const res = await axios
    .post("/spectacole", {
      titlu: data.titlu,
      descriere: data.descriere,
      actori: data.actori,
      dataPremierei: data.dataPremierei,
      imagineUrl: data.imagineUrl,
      sala: data.sala,
      numarLocuri: data.numarLocuri,
      pret: data.pret,
      regizor: data.regizor,
      durata: data.durata,
      gen: data.gen,
      featured: data.featured,
    })
    .catch((err) => console.log(err));

  if (res.status !== 201) {
    return console.log("Unexpected Error Occurred");
  }

  const resData = await res.data;
  return resData;
};
