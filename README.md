# Research Chat

This is a chat application specially designed to help professors and students conducting research at a university communicate effectively.

## Development

### Running the Application

The application has the following tech stack:

- Database: MariaDB
- Backend: Python with FastAPI, Pydantic and SQLAlchemy
- Frontend: Typescript with React, TanStack Router+Query+Form, and Shadcn

This application uses docker compose to run:

```bash
docker compose build
docker compose up
```

Then visit the application at [http://localhost:4173/](http://localhost:4173/).

### Testing

All tests are located in the `tests/` folder. This project uses Playwright for End-to-End (E2E) testing.

#### Prerequisites

Before running tests, ensure the application is running via Docker:

```bash
docker compose up -d
```

Then, install the testing dependencies inside the `tests` folder:

```bash
cd tests
npm install
npx playwright install
```

#### Running Tests

To run all E2E tests (can also be run with the Playwright UI):

```bash
npm run test
npm run test:ui
```

The Playwright test report can be viewed with:

```bash
npm run report
```

### Contributing

For new features, create a new branch and then develop your feature on that branch. Then open a pull request to the `dev` branch. For small changes and bug fixes, develop them directly on `dev`. Once `dev` is stable, open a pull request into the `main` branch.

The `main` branch will be used in the CI/CD pipeline, so developement should never be done directly on the branch, to reduce the chances of a broken version of the app being pushed to production.

Use `ruff` to format Python code and `prettier` for TypeScript. Set maximum line length to at least 140 and 4 spaces as indentation for both.

## Team

This application was made as a group project

- [Punit Turlapati](https://github.com/TheBobTheBlob)
- [Henrique de Amorim Sousa](https://github.com/hdthy)
- [Shem De Leon](https://github.com/ShemDeLeon)
