### Bookstore Backend Server

This is the backend server for the Library Book Store application, built with Node.js, Express, and MongoDB.

#### Prerequisites
- Node.js (v18+)
- MongoDB (v7.0+)

#### MongoDB Setup (macOS with Homebrew)
If you don't have MongoDB installed, follow these steps:

1.  **Install Homebrew** (if not already installed):
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

2.  **Tap the MongoDB Formula**:
    ```bash
    brew tap mongodb/brew
    ```

3.  **Install MongoDB**:
    ```bash
    brew install mongodb-community@7.0
    ```

4.  **Create Data Folder** (Optional for Homebrew, but good for manual management):
    By default, Homebrew manages the data folder. If you need to create it manually:
    ```bash
    sudo mkdir -p /usr/local/var/mongodb
    sudo chown -R $(whoami) /usr/local/var/mongodb
    ```

5.  **Start the MongoDB Instance**:
    To run MongoDB as a background service:
    ```bash
    brew services start mongodb-community@7.0
    ```
    *To stop the service: `brew services stop mongodb-community@7.0`*

6.  **Verify MongoDB is Running**:
    ```bash
    ps aux | grep mongod
    ```
    *You should see a `mongod` process running.*

---

#### First-Time Setup
If you are running the server for the first time, follow these steps:

1.  **Install Dependencies**:
    Navigate to the `server` directory and install the necessary packages.
    ```bash
    npm install
    ```

2.  **Configure Environment Variables**:
    Copy the example environment file and update it with your settings.
    ```bash
    cp .env.example .env
    ```
    *Ensure `MONGODB_URI` and `PORT` are correctly set.*

3.  **Seed the Database**:
    Initialize your MongoDB with default categories and books.
    ```bash
    npm run seed
    ```

---

#### Subsequent Runs
To start the server for development after the initial setup:

1.  **Start the Server**:
    Run the server in development mode with hot-reloading (via `tsx`).
    ```bash
    npm start
    ```
    *The server will be available at `http://localhost:3000`.*

2.  **Verify Connection**:
    You can check if the API is responding by visiting `http://localhost:3000/api/books` in your browser or using `curl`.

---

#### Available Scripts
- `npm start`: Runs the server with `tsx watch` for development.
- `npm run seed`: Clears the database and inserts initial mock data.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm test`: Runs the test suite (currently placeholder).

#### Standards & Quality
- **ESLint**: Enforces Node.js best practices and code style.
- **Global Error Handling**: Centralized middleware for managing exceptions.
- **Structured Logging**: Consistent logging across all routes and services.
