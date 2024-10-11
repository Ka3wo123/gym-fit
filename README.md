<div style="display: flex; justify-content: space-around; align-items: center;">
  <a href="https://mariadb.org/" target="_blank">
    <img src="https://mariadb.com/wp-content/uploads/2019/11/mariadb-logo-vert_blue-transparent.png" width="120" alt="MariaDB Logo" />
  </a>
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
  <a href="https://angular.io/" target="_blank">
    <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="120" alt="Angular Logo" />
  </a>
</div>

# Gym-fit webapp
Gym-fit is created with **MariaDB** database, **Nest.js** backend and **Angular** frontend.

## Start application
- `docker run --name mariadb-gym-fit -e MARIADB_ROOT_PASSWORD=password MYSQL_DATABASE=gym-fitness -p 3306:3306 -d mariadb:latest`
- in `backend/` folder run `yarn start`
- in `frontend/` folder run `ng serve`

## Swagger.io
Documentation of API is available under `http://localhost:3000/api`.
