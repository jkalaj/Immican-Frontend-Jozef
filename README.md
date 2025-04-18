# Immican App - Usage Guide

This guide provides instructions on how to set up and run the Immican application backend and frontend.

## Prerequisites

*   Python (>= 3.8 recommended)
*   pip (Python package installer)
*   Node.js and npm (or yarn) for the frontend
*   PostgreSQL Database Server (running locally or accessible)
*   Git (optional, for cloning)

## Backend Setup (`backend` directory)

1.  **Navigate to Backend Directory:**
    ```bash
    cd path/to/Immican-app/backend
    ```

2.  **Create and Activate Virtual Environment (Recommended):**
    ```bash
    python -m venv venv
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    .\venv\Scripts\activate
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: You might need to manually fix line endings in `requirements.txt` if you encountered issues during the refactoring step).* 

4.  **Configure Environment Variables:**
    *   Create a `.env` file in the `backend` directory (if it doesn't exist).
    *   Copy the contents from `.env.example` (if one exists) or add the following, adjusting values as necessary:
        ```dotenv
        # Database Connection (Adjust for your PostgreSQL setup)
        DATABASE_URL=postgresql://postgres:postgres@localhost:5432/immican

        # Flask Settings
        FLASK_DEBUG=True
        FLASK_ENV=development
        SECRET_KEY=your_strong_random_secret_key_here # Generate a real secret key!

        # JWT Settings
        JWT_SECRET_KEY=your_strong_random_jwt_secret_key # Generate a real JWT secret key!

        # File Upload Path (default relative to backend dir)
        # FILE_UPLOAD_PATH=src/fileUploadDirectory
        ```
    *   **Important:** Replace placeholder secret keys with strong, randomly generated values.
    *   Ensure your PostgreSQL server is running and the `immican` database exists with the specified user/password.

5.  **Database Migrations:**
    *   Set the Flask app environment variable:
        ```bash
        # On macOS/Linux:
        export FLASK_APP=backend
        # On Windows:
        set FLASK_APP=backend
        ```
    *   Initialize the migration directory (only needed once per project):
        ```bash
        flask db init
        ```
    *   Generate the initial migration script (based on your models):
        ```bash
        flask db migrate -m "Initial database schema"
        ```
        *(Review the generated script in `migrations/versions/`)*
    *   Apply the migration to create tables in your database:
        ```bash
        flask db upgrade
        ```
    *   For subsequent model changes, repeat `flask db migrate` and `flask db upgrade`.

6.  **Run the Backend Server:**
    ```bash
    flask run --host=0.0.0.0 --port=5001
    ```
    *   Or simply `python backend/__init__.py` (if `__main__` block is configured to run `app.run`).
    *   The backend API should now be running, typically at `http://localhost:5001`.

## Frontend Setup (`MyUnimo-Frontend-main` directory)

1.  **Navigate to Frontend Directory:**
    ```bash
    cd path/to/Immican-app/MyUnimo-Frontend-main
    ```

2.  **Install Dependencies:**
    ```bash
    # Using npm
    npm install
    # OR using yarn
    # yarn install
    ```

3.  **Configure Environment Variables (if necessary):**
    *   Check for a `.env.local` or similar file.
    *   Ensure the frontend knows where the backend API is running. Often this is configured via an environment variable like `NEXT_PUBLIC_API_URL`.
    *   If needed, create a `.env.local` file and add:
        ```dotenv
        NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
        ```
        *(Adjust the variable name and URL based on the frontend's actual configuration).* 

4.  **Run the Frontend Development Server:**
    ```bash
    # Using npm
    npm run dev
    # OR using yarn
    # yarn dev
    ```
    *   The frontend should now be running, typically at `http://localhost:3000` (or another port specified by the frontend setup).

## Connecting Frontend and Backend

*   The frontend makes API calls to the backend URL (e.g., `http://localhost:5001/api/v1`).
*   Ensure the `NEXT_PUBLIC_API_URL` (or equivalent) in the frontend configuration points correctly to the running backend server.
*   The backend uses Flask-CORS (`CORS(app)`) which *should* allow requests from the default frontend development server (`http://localhost:3000`). If you encounter CORS errors, you may need to configure CORS more specifically in `backend/__init__.py` to allow the frontend's origin.

## Running Tests (Backend)

1.  **Navigate to the root project directory** (or ensure `pytest` can find the `backend` directory).
2.  **Run pytest:**
    ```bash
    pytest
    ```
    *   This will discover and run the tests defined in the `backend/tests` directory. 