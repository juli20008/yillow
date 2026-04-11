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

The Flask server will start at: **http://localhost:5000**

---

## **Step 3: Start the Frontend (React)**

In PowerShell/Terminal 2:
```powershell
cd react-app
npm start
```

The React app will start at: **http://localhost:3000**

---

## **Accessing the Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

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
