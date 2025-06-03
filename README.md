# Board Backend

This is the backend service for a board/forum application, built with NestJS, a progressive Node.js framework, and utilizing Sequelize as an ORM for database interactions with MySQL. It provides robust API endpoints for managing board functionalities, user authentication, and more.


## Features
-   **RESTful API Endpoints**: Structured and efficient API endpoints for various board operations.
-   **User Authentication & Authorization**: Secure user management using JWT (JSON Web Tokens) and bcrypt for password hashing.
-   **Database Integration**: Seamless interaction with MySQL database via Sequelize ORM.
-   **Modular Structure**: Organized codebase following NestJS best practices.
-   **Type-safe Development**: Written in TypeScript for enhanced code quality and maintainability.

## Technologies Used

-   **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
-   **Sequelize**: A powerful and widely used ORM (Object-Relational Mapper) for Node.js, supporting MySQL.
-   **MySQL2**: MySQL client for Node.js.
-   **Passport.js**: Authentication middleware for Node.js, used with JWT and HTTP strategies.
-   **bcrypt**: Library for hashing passwords.
-   **rxjs**: Reactive Extensions for JavaScript.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Jest**: A delightful JavaScript Testing Framework.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have met the following requirements:

-   **Node.js**: `^20.x` or higher (Check with `node -v`)
-   **npm** or **Yarn**: (Check with `npm -v` or `yarn -v`)
-   **MySQL Database**: A running MySQL server instance.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd board-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```
3.  **Database Configuration:**
    Create a `.env` file in the root of your project. This file will contain your database connection details and other environment variables.
    ```
    # Database Configuration
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=your_database_name
  
    ```
    *Make sure to create the specified `your_database_name` database in your MySQL server.*

### Running the Application

-   **Development Mode (with watch):**
    This mode watches for file changes and automatically restarts the server.
    ```bash
    npm run start:dev
    # OR
    yarn start:dev
    ```
    The application will typically run on `http://localhost:3000` (or the port configured in your `main.ts`).

-   **Production Mode:**
    First, build the project:
    ```bash
    npm run build
    # OR
    yarn build
    ```
    Then, start the production server:
    ```bash
    npm run start:prod
    # OR
    yarn start:prod
    ```

-   **Debug Mode:**
    ```bash
    npm run start:debug
    # OR
    yarn start:debug
    ```

## Scripts

The `package.json` includes several useful scripts:

-   `npm run build`: Compiles the TypeScript source code into JavaScript.
-   `npm run format`: Formats code using Prettier.
-   `npm run start`: Starts the application (production build).
-   `npm run start:dev`: Starts the application in development mode with hot-reloading.
-   `npm run start:debug`: Starts the application in debug mode.
-   `npm run start:prod`: Runs the compiled production build.
-   `npm run lint`: Lints the codebase and fixes issues.
-   `npm run test`: Runs all unit tests.
-   `npm run test:watch`: Runs tests in watch mode.
-   `npm run test:cov`: Runs tests and generates a coverage report.
-   `npm run test:debug`: Runs tests in debug mode.
-   `npm run test:e2e`: Runs end-to-end tests.

## Testing

This project uses `Jest` for testing.

-   **Unit Tests:**
    ```bash
    npm run test
    ```
-   **Coverage Report:**
    ```bash
    npm run test:cov
    ```
    This will generate a `coverage` directory with an HTML report.

