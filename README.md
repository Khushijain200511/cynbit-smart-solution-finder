# Cynbit Smart Solution Finder

A full-stack prototype that helps visitors identify a suitable technology service and submit a project inquiry.

## Stack
- Frontend: React + Vite
- Backend: Python + FastAPI
- Database: MongoDB (PyMongo)
- API docs: FastAPI Swagger UI

## Features
- Responsive landing page
- Six selectable technology service categories
- Project size, budget and timeline inputs
- Rule-based service recommendation API
- Inquiry form with validation
- Inquiry persistence in MongoDB

## Project structure
```text
cynbit-smart-solution-finder/
├── frontend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── app/
│   ├── .env.example
│   └── requirements.txt
├── .gitignore
└── README.md
```

## Requirements
Install:
- Python 3.10+
- Node.js 18+
- MongoDB Community Server, or a MongoDB Atlas connection string

## Run the backend (Windows PowerShell)
Open a terminal in the project root:

```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload --port 8000
```

Backend:
- API: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

Edit `backend/.env` and set your MongoDB URL if needed.

## Run the frontend
Open a second terminal in the project root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173

## Environment variables

Backend (`backend/.env`):
```env
MONGODB_URL=mongodb://127.0.0.1:27017
DATABASE_NAME=cynbit_solutions
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://127.0.0.1:8000
```

Never commit `.env` files or credentials. Only commit `.env.example`.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome |
| GET | `/health` | API and MongoDB health |
| GET | `/api/services` | List services |
| POST | `/api/recommendations` | Get recommendation |
| POST | `/api/inquiries` | Save an inquiry |

### Example recommendation request
```json
{
  "requirement": "ai-automation",
  "project_size": "small",
  "budget": "under-1000",
  "timeline": "1-3-months"
}
```

## Important before public deployment
- Set a strong, private MongoDB Atlas connection string in the hosting provider's environment variables.
- Set `FRONTEND_ORIGINS` to your deployed frontend domain.
- Set `VITE_API_URL` to your deployed backend URL and rebuild the frontend.
- Add authentication, rate limiting, spam protection and privacy/consent wording before using this for real customer data.
- This is an independent internship prototype. Do not imply it is an official Cynbit product or alter the live Cynbit website without authorization.
