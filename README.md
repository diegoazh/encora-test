# Econra test

REST API for a blog

## Requirements

- Docker

## How to run it

```sh
docker compose up -V
```

After that run the following command

```sh
docker exec -it starter_nestjs bash
```

Inside the container run

```sh
pnpm run migrate && pnpm run seed:all
```

If something weird happens you can run

```sh
pnpm run seed:undo:all && pnpm run migrate:undo:all && pnpm run migrate && pnpm run seed:all
```

- Visit the API documentation on [`http://localhost:3000/api`](http://localhost:3000/api)
- Visit the frontend on [`http://localhost:5173/`](http://localhost:5173/)
