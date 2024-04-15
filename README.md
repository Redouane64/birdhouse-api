# Birdhouse API

Birdhouse API is implement according the requirements and design decisions described in task document.

- Initially, a data model were planned with attributes, foreign keys, database indices and relationships based on endpoints described in the task document. data modeling is executed using TypeORM and Postgres with database migrations. A relational model for storage makes sense for this setup as it is simple and fits historical data such that for birdhouse occupancy history.

- Application is split into the following directories according to technical concerns and features:

  - `config`: Configuration environment variable are setup and exported to the outside modules. Configuration are split into sections using NestJS config namespace feature. Additionally, a `env.d.ts` file is included to expose typing for environment variable expected from `process.env` object for smooth DX.

  - `database`: Database module encapsulate TypeORM configuration and database schema migrations setup. A custom query logger is configured to log database queries to built-in NestJS logger.

  - `logging`: Logging module encapsulate logging infrastructure setup. `pino-pretty` transport is configured to log HTTP request/response to terminal/application. Logging configuration is exported to setup `LoggerModule` in `AppModule`.

  - `birdhouse`: Birdhouse module encapsulate birdhouse service features. it includes API controller, business logic service and input/output DTOs, interfaces and database entities. Additionally, a Cron job service is configured using `@nestjs/scheduler` package for executing birdhouse pruning job.

- The following rules were satisfied:

  1. Birdhouse name should be between 4-16 character long. Validation is implemented using `class-validator` annotations.
  2. Endpoints that receive information for birdhouse are secured with X-UBID header. The header is verified using custom `UbidAuthGuard` NestJS Guard. The verification validate the header and check birdhouse ubid existence in database.
  3. Birdhouse occupancy history is kept in database table `occupancy_history`.
  4. Bulk birdhouses registration endpoint is implemented under path `house/seed`. The endpoint is secured with Basic http auth schema which is implemented in `BasicAuthGuard`. a username and password can be configured as app environment variables (see `.env.development`).
  5. Old birdhouses pruning is implemented by running a Cron job in `JobService`. By default it is configured to run everyday at midnight. Pruning interval can be configured with `CRON_PRUNE_BIRDHOUSE_PERIOD` environment variable. For testing in development, the pruning period set to trigger every 10 seconds.
  6. In the app, I made the following assumptions:
      - UBID returned from register `POST /house` endpoint is used for `ubid` value in API parameter for `GET house/ubid`, `PATCH house/ubid` and `POST house/ubid/occupancy` endpoints. The same `ubid` value is also used for `X-UBID` authentication header.

**Note:** environment variables defined in `.env.development` must be set in order to run the API service correctly.

## Getting Started

- dependencies: NodeJS 20.x, Docker, Postgres

1. Install dependecies:

```console
npm i
```

2. Run Docker Postgres database container:

```console
docker compose -f ./docker/docker-compose.yml up
```

**Note:** A database can be configured without using the provided Docker Compose setup and connection must configured inside `.env.development` file by setting `DB_*` variables correctly.

3. Run the API:

```console
npm run start # or npm run start:dev
```

- Swagger docs available at: `http://<localhost>:<port>/swagger`

## Database Migrations (Optional)

API are ready to run without any database configuration. However, if it is necessary to work with database schema, a set of TypeORM commands are configured in `package.json` scripts.

- apply migrations: `npm run migration:run`

- other commands available in `package.json`
