# Testowanie i jakość oprogramowania

## Autor
Kajetan Nowak

## Temat projektu
Aplikacja gym-fit

## Opis projektu
...

## Uruchominie projektu
*via docker-compose*

1. Przejdź do folderu `docker/`
2. Uruchom komendę `docker compose up -d`
3. Aplikacja webowa dostępna jest pod http://localhost:3002/

*dev*

1. Uruchom bazę danych poprzez komendę `docker run --name mariadb-gym-fit -e MARIADB_ROOT_PASSWORD=password -e MYSQL_DATABASE=gym-fitness -p 3306:3306 -d mariadb`
2. W folderach `frontend/` oraz `backend/` uruchom polecenie `yarn && yarn start`
3. Aplikacja webowa dostępna jest pod http://localhost:4200/, a dokumentacja API (Swagger.io) pod http://localhost:3000/api/

## Opis testów
### Jednostkowe
opis testów jednostkowych
[Test](backend/src/auth/auth.controller.ts)
### Integracyjne
opis testów integracyjnych

## Przypadki testowe dla testera manualnego

## Technologie użyte w projekcie

<div style="margin-bottom: 10px;">
  <img src="https://nestjs.com/img/logo_text.svg" height="50" alt="NestJS Logo" />
</div>

<div style="margin-bottom: 10px;">
  <img src="https://imgs.search.brave.com/jv9t2kGDYPy4b7pHpiOl7BAy3LBVC-ENKI8xH8KzRrI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy8w/LzA3L0FuZ3VsYXJf/TG9nb19TVkcuc3Zn" height="50" alt="Angular Logo" />
</div>

<div style="margin-bottom: 10px;">
  <img src="https://imgs.search.brave.com/yrTkSrQNyrLPiXd7VlxzD0JSJRHaUdNtcvgM1dzVOHQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy13b3JsZC5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MDIvRG9ja2VyLUxv/Z28tNzAweDM5NC5w/bmc" height="90" alt="Docker Logo" />
</div>

<div style="margin-bottom: 10px;">
  <img src="https://jestjs.io/img/jest.svg" width="150" alt="Jest Logo">
</div>

<div style="margin-bottom: 10px;">
  <img src="https://imgs.search.brave.com/g4lMYWlh4JmkH4jfB5kdaxzXXYlruBBUE_L7dOSbPU4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9naXRo/dWIuY29tL3lhcm5w/a2cvYXNzZXRzL3Jh/dy9tYXN0ZXIveWFy/bi1raXR0ZW4tZnVs/bC5wbmc_cmF3PXRy/dWU" height="50" alt="Yarn Logo" />
</div>

<div style="margin-bottom: 10px;">
  <img src="https://mariadb.com/wp-content/uploads/2019/11/mariadb-logo-vert_blue-transparent.png" width="80" alt="MariaDB Logo" />
</div>

