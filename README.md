# Vaasan Eläinsuoja ry - Adoptiojärjestelmä

Digitaalinen ratkaisu eläinten adoptiohakemusten helpottamiseksi.

## Ominaisuudet

- Eläinlistaus: Selaa kaikkia adoptoitavia eläimiä korttimuodossa
- Suodatus: Filtteröi eläimet tyypin mukaan (koirat/kissat)
- Yksityiskohtasivut: Katso eläimen kaikki tiedot
- Adoptiohakemukset: Jätä hakemus sähköisesti
- Vahvistussivu: Saa välitön vahvistus hakemuksesta

## Teknologiat

### Frontend
- React 18
- React Router v6
- CSS3

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- Axios

### Infrastruktuuri
- Docker ja Docker Compose
- Nginx

## Arkkitehtuuri

```
Frontend (React) --> Server A (Gateway) --> Server B (Adoptiot)
   :3000              :3001                   :3002
                         |                       |
                   SQLite (Eläimet)        SQLite (Adoptiot)
```

### Adoptiohakemuksen kulku

1. Frontend lähettää hakemuksen Server A:lle (POST /animals/:id/adopt)
2. Server A validoi ja välittää Server B:lle (POST /adoptions)
3. Server B tallentaa hakemuksen
4. Server B palauttaa vahvistuksen Server A:lle
5. Server A päivittää eläimen statuksen ja palauttaa frontendille
6. Frontend ohjaa käyttäjän kiitos-sivulle

## Asennus ja käynnistys

### Docker (suositeltu)

```bash
git clone https://github.com/Xaraex/vaasan-elainsuoja.git
cd vaasan-elainsuoja
docker-compose up --build
```

Sovellus käynnistyy:
- Frontend: http://localhost:3000
- Server A: http://localhost:3001
- Server B: http://localhost:3002

### Ilman Dockeria

Käynnistä palvelut järjestyksessä:

```bash
# Server B
cd server-b
npm install
npm start

# Server A (uusi terminaali)
cd server-a
npm install
npm start

# Frontend (uusi terminaali)
cd frontend
npm install
npm run dev
```

## API-dokumentaatio

### Server A - Pääpalvelin (port 3001)

| Metodi | Endpoint | Kuvaus |
|--------|----------|--------|
| GET | /animals | Palauttaa kaikki eläimet |
| GET | /animals/:id | Palauttaa yhden eläimen tiedot |
| POST | /animals/:id/adopt | Vastaanottaa adoptiohakemuksen |
| GET | /health | Health check |

### Server B - Adoptiopalvelin (port 3002)

| Metodi | Endpoint | Kuvaus |
|--------|----------|--------|
| POST | /adoptions | Vastaanottaa hakemuksen Server A:lta |
| GET | /adoptions | Listaa kaikki hakemukset |
| GET | /health | Health check |

### Esimerkkipyynnöt

GET /animals vastaus:
```json
[
  {
    "id": 1,
    "name": "Luna",
    "type": "kissa",
    "age": 3,
    "breed": "Eurooppalainen lyhytkarva",
    "description": "Rauhallinen ja hellä kissa...",
    "image_url": "https://...",
    "status": "available"
  }
]
```

POST /animals/:id/adopt pyyntö:
```json
{
  "applicant_name": "Matti Meikäläinen",
  "applicant_email": "matti@email.fi",
  "applicant_phone": "040 123 4567",
  "message": "Haluaisin adoptoida..."
}
```

## Projektikansiorakenne

```
vaasan-elainsuoja/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── AnimalCard.jsx
│   │   │   └── AnimalCard.css
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.css
│   │   │   ├── AnimalPage.jsx
│   │   │   ├── AnimalPage.css
│   │   │   ├── ThankYouPage.jsx
│   │   │   └── ThankYouPage.css
│   │   ├── App.jsx
│   │   └── App.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── server-a/
│   ├── src/
│   │   ├── index.js
│   │   └── database.js
│   ├── data/
│   ├── Dockerfile
│   └── package.json
├── server-b/
│   ├── src/
│   │   ├── index.js
│   │   └── database.js
│   ├── data/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Tekijä

Janne Kolehmainen - VAMK

## Lisenssi

MIT License
