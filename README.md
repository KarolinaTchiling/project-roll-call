### Frontend:

- **React**
- **TypeScript**: Javascript with static typing
- **Vite**: Javascript package bundler

### Backend:

- **Python**: Programming Language
- **Flask**: Web Server framework for Python
- **MongoDB**: NoSQL Document Database

## Quick Start
```
git clone https://github.com/EECS3311F24/project-roll-call.git
```

### Running on your machine:

**Frontend**

1. Install node.js https://nodejs.org/en/download/prebuilt-installer

2. Install dependencies
```
cd frontend
npm install
```

3. Run Frontend
```
npm run dev
```

**Backend (Server)**
1. Install python https://www.python.org/downloads

2. Create and activate the virtual environment
```
cd backend/flask_app
python -m venv venv
```

On Windows:
```
venv\Scripts\activate
```

On MacOS/Linux:
```
source venv/bin/activate
```

3. Install dependencies
```
pip install -r requirements.txt
```

4. Set Up Your Own Environment Variables


5. Start the Server
```
flask run
```
or 
```
python app.py
```

**Backend (Database)**
1. Install MongoDB https://www.mongodb.com/try/download/community?tck=docs_server

2. On MongoDB Compass (GUI) select "Add new connection", then ensure that under "URI" the following is shown: "mongodb://localhost:27017/". Now click "Connect".
