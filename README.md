# ConvertPro

ConvertPro is a web application that allows users to upload images and convert them to AVIF format. The project consists of two main parts: a React frontend (UI) and a Flask backend (Server).

## Prerequisites

- Node.js and npm (for the React frontend)
- Python 3.x (for the Flask backend)
- pip (Python package installer)
- git (for cloning the repository)

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/convertpro.git
cd convertpro
```

### 2. Setup Frontend (React)
```sh
cd UI
npm install
```

### 3. Setup Backend (Flask)
```sh
cd ../server
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
```

## Running the Application

### 1. Start the Flask Backend
```sh
cd server
# Activate virtual environment if not already activated
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
python app.py
```
The Flask server will start running at http://localhost:5000

### 2. Start the React Frontend
In a new terminal window:
```sh
cd ../UI
npm run dev
```

The React development server will start running at http://localhost:5173.

## Usage
Open your web browser and navigate to http://localhost:5173.
1. Use the upload form to upload an image (PNG, JPG, JPEG).
2. The image will be converted to AVIF format.
3. Once the conversion is complete, you can download the converted image.
4. Once the conversion is complete, you can download the converted image.
