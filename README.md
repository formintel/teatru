# Aplicație de rezervare bilet la Teatru

## Descriere
Această aplicație web este o platformă pentru gestionarea spectacolelor de teatru, care permite utilizatorilor să vizualizeze spectacole, să cumpere bilete și să gestioneze rezervările.

## Tehnologii Utilizate
- Frontend: React.js, Material-UI, Redux Toolkit
- Backend: Node.js, Express.js, MongoDB
- Alte tehnologii: Axios, React Router, Leaflet (pentru hărți), QR Code generator

## Ghid de Instalare

### Cerințe Preliminare
1. Instalați Node.js (https://nodejs.org/)
2. Instalați MongoDB Community Server (https://www.mongodb.com/try/download/community)
3. (Opțional) Instalați MongoDB Compass pentru vizualizarea bazei de date

### Pași de Configurare

#### 1. Configurare Bază de Date
 **Import Bază de Date**
```bash
# Din directorul rădăcină al proiectului:
mongorestore --db proiectulMeu ./database-backup/proiectulMeu
```
Pentru buna rulare a acestei comenzi, este nevoie de instalat MongoDB Database Tools de la: https://www.mongodb.com/try/download/database-tools
Se dezarhiveaza pachetul se adauga calea folderului bin in variabila de mediu PATH.

#### 2. Configurare Backend
```bash
# 1. Navigați în directorul backend
cd backend

# 2. Instalați dependențele
npm install

# 3. Copiați .env.example în .env
cp .env.example .env

# 4. Porniți serverul
node app.js
```

#### 3. Configurare Frontend
```bash
# 1. Într-un terminal nou, navigați în directorul frontend
cd frontend

# 2. Instalați dependențele
npm install

# 3. Porniți aplicația
npm start
```

### Verificare Instalare
1. Backend-ul ar trebui să ruleze pe http://localhost:5000
2. Frontend-ul ar trebui să ruleze pe http://localhost:3000
3. În MongoDB Compass puteți verifica baza de date conectându-vă la: mongodb://localhost:27017

## Structura Bazei de Date
Baza de date conține următoarele colecții:
- **admins**: Conturi de administrator
- **users**: Utilizatori înregistrați
- **plays**: Spectacole de teatru -> nu mai sunt folosite in proiect 
- **bookings**: Rezervări
- **movies**: Spectacole de teatru

## Conturi pentru Testare
1. **Cont Administrator**
   - Email: r@y.com
   - Parolă: robertel

2. **Cont Utilizator**
   - Email: a@y.com
   - Parolă: 122

## Funcționalități

### 1. Pagina Principală (HomePage)
Pagina principală a aplicației oferă o experiență modernă și atractivă pentru vizitatori, cu următoarele elemente:

#### Hero Section
![Hero Section](./screenshots/hero-section.png)
- Imagine de fundal cu gradient dinamic
- Logo-ul teatrului (DramArena)
- Titlu principal și slogan
- Butoane de acțiune pentru:
  - Vizualizarea spectacolelor
  - Accesarea panoului de administrare (pentru admini)

#### Carousel de Spectacole
![Carousel de Spectacole](./screenshots/carousel.png)
- Afișare automată a spectacolelor în curs
- Design responsive (1-3 spectacole pe rând, în funcție de dimensiunea ecranului)
- Pentru fiecare spectacol se afișează:
  - Imaginea posterului
  - Titlul spectacolului
  - Genul și durata
  - Sala de spectacol
  - Rating-ul spectacolului
  - Regizorul
  - Descriere scurtă
  - Prețul biletului
  - Buton pentru detalii

#### Secțiunea de Caracteristici
![Secțiunea de Caracteristici](./screenshots/features.png)
- Trei card-uri care evidențiază avantajele platformei:
  - Spectacole Diverse
  - Rezervare Ușoară
  - Bilete Digitale

#### Harta de Localizare
![Harta de Localizare](./screenshots/map.png)
- Integrare cu Leaflet pentru afișarea locației teatrului
- Harta interactivă pentru ghidare

### Capturi de Ecran
Pentru a adăuga capturi de ecran în README:
1. Creați un director `screenshots` în rădăcina proiectului
2. Salvați imaginile în format PNG sau JPG
3. Adăugați referințele în README folosind sintaxa Markdown:
```markdown

```

Exemplu de structură recomandată pentru capturi de ecran:
```
screenshots/
├── homepage/
│   ├── hero-section.png
│   ├── carousel.png
│   ├── features.png
│   └── map.png
```

### 2. Sistem de Autentificare
- Înregistrare utilizator nou
- Autentificare
- Recuperare parolă

### 3. Gestionare Rezervări
- Selectare locuri
- Vizualizare istoric rezervări
- Generare bilet cu QR code

### 4. Panou Administrare
- Adăugare/Editare spectacole
- Gestionare utilizatori
- Vizualizare statistici rezervări

