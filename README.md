# Parkinson Center: A Healthcare Mobile Application for Voice-Based Detection on Parkinson’s Disease Recognition

## Overview
This project aims to develop a mobile application that uses audio classification technology to detect Parkinson’s disease. The application also includes educational section to help users learn about Parkinson’s disease.

## Features

- *Parkinson’s Disease Detection*:
  - Record voice samples.
  - Upload existing voice recordings.
  - Audio classification.
  - Display analysis results and recommend professional help if needed.
  - Book appointments with medical specialists if symptoms are detected.
  - View and manage booked appointments.

- *User Authentication*:
  - Register new users.
  - Login and manage user profiles.
  - View avatar and logout functionalities.

- *Educational Section*:
  - Learn about Parkinson’s disease.
  - Access information on treatments and prevention.
  - Search and filter topics related to Parkinson’s disease.

## Installation

### Prerequisites

- *Node.js and npm*: Node.js (version 14.x or later), npm (version 6.x or later)
- *Python*: Python 3.9 or later
- *MongoDB*: MongoDB 4.4 or later
- *Expo CLI*: Expo CLI 0.7.3 or later
- *FastAPI*: FastAPI 0.108 or later
- *Conda*: Anaconda or Miniconda (latest version)

### Prerequisite Installation

1. *Install Node.js and npm*:
    - Download and install from [Node.js official website](https://nodejs.org/).

2. *Install MongoDB*:
    - Download and install from [MongoDB official website](https://www.mongodb.com/try/download/community).

3. *Install Conda*:
    - Download and install from [Conda official website](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html).

4. *Install Expo CLI*:
    ```sh
    npm install -g expo-cli@latest
    ```

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/parkinson-center.git
    cd parkinson-center/backend
    ```

2. Create and activate a Conda environment:
    ```sh
    conda create --name parkinson-center python=3.8
    conda activate parkinson-center
    ```

3. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Start MongoDB server:
    ```sh
    mongod
    ```

5. Run the FastAPI server:
    ```sh
    uvicorn main:app --reload
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the Expo server:
    ```sh
    npm start
    ```

## Usage

To use the application, both the backend and frontend servers must be running:

1. Ensure the FastAPI backend server is running:
    ```sh
    uvicorn main:app --reload
    ```

2. Ensure the Expo frontend server is running:
    ```sh
    npm start
    ```

3. Launch the app on your mobile device using Expo Go.
4. Register a new user or login with existing credentials.
5. Navigate through the app to:
    - *Detect*: Record, upload, and analyze voice samples.
    - *Learn*: Access educational resources to learn about Parkinson’s disease.
    - *Profile*: Manage your profile.
    - *Appointment*: Book and manage appointments with specialists.

## Project Structure

```plaintext
Thesis/
├── backend/
│   ├── api/
│   ├── dal/
│   ├── dto/
│   ├── models/
│   ├── PDmodel/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   ├── exceptions.py
│   └── server.py
├── frontend/
│   ├── .expo/
│   ├── assets/
│   ├── node_modules/
│   ├── src/
│   │   ├── contexts/
│   │   ├── screens/
│   │   └── constants.js
│   ├── .gitignore
│   ├── App.js
│   ├── app.json
│   ├── babel.config.js
│   ├── package.json
│   └── package-lock.json
└── README.md 
```

## Future Work
- Improving the accuracy of the audio classification model.

- Expanding the application to support additional languages.

- Enhancing the reliability of voice analysis.


## License
This project is licensed under the MIT License. See the This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. file for details.


