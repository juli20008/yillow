## 🚀 Yillow Project - Running the Application

### Prerequisites Completed ✅

- Python virtual environment created
- All dependencies installed
- SQLite database initialized
- Flask app configured

---

## **Step 1: Activate Virtual Environment**

```powershell
cd c:\Users\Hrana\OneDrive\MiaSoft\yillow
venv_yillow\Scripts\Activate.ps1
```

---

## **Step 2: Start the Backend (Flask)**

In PowerShell/Terminal 1:

```powershell
flask run
```

The Flask server will start at: **[http://localhost:5000](http://localhost:5000)**

---

## **Step 3: Start the Frontend (React)**

In PowerShell/Terminal 2:

```powershell
cd react-app
npm start
```

The React app will start at: **[http://localhost:3000](http://localhost:3000)**

---

## **Accessing the Application**

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## **Fast Demo Deploy**

If you only want to show the app, the easiest path is to deploy the Docker image on Render:

1. Push this repo to GitHub.
2. In Render, create a new Blueprint from `render.yaml`.
3. Set `SECRET_KEY` when Render prompts you.
4. Deploy the `yillow-demo` service.

This deploy path uses the app's SQLite fallback, so you do not need to set up Postgres first.
The Docker image also runs `flask db upgrade` and `flask seed all` during build, so the demo opens with sample data.

---

## **Optional: Seed Database with Sample Data**

To add sample data for testing:

```powershell
flask seed all
```

---

## **Quick Start (One Command Per Terminal)**

### Terminal 1:

```powershell
cd c:\Users\Hrana\OneDrive\MiaSoft\yillow; venv_yillow\Scripts\Activate.ps1; flask run
```

### Terminal 2:

```powershell
cd c:\Users\Hrana\OneDrive\MiaSoft\yillow\react-app; npm start
```

---

**You're all set! 🎉**