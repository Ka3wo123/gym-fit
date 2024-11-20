# Testowanie i jakość oprogramowania

## Autor
Kajetan Nowak

## Temat projektu
Aplikacja gym-fit

## Opis projektu
    Aplikacja webowa Gym fit ma na celu dostarczenie użytkownikom informacji o treningach w danym obiekcie sportowym. 
Użytkownik, który chce zapisać się na dany trening musi zarejestrować się podając swoje dane osobowe, adres e-mail, hasło oraz, opcjonalnie, preferencje w typie treningów. Zalogowany użytkownik ma dostęp do treningów, na które się zapisał. \
Trener, chcąc dodać lub zarządzać swoimi treningami musi utworzyć konto podając swoje dane osobowe, adres e-mail, hasło oraz być zalogowanym w systemie. Ma możliwość dodawania treningu podając nazwę, typ oraz datę treningu i opcjonalnie ilość dostępnych miejsc, aktualizacji danego treningu oraz jego usunięcia. Trenerzy nie mają możliwości zapisywania się na swoje lub inne treningi. \
Administrator systemu musi zalogować się na fabrycznie ustawione dane - adres e-mail oraz hasło. Ma dostęp do wszystkich funkcji systemu oraz dodatkowo panelu administratora, z którego ma możliwość zarządzania użytkownikami i trenerami w systemie (blokowanie, usuwanie użytkowników etc.)

## Uruchomienie projektu

| Typ konfiguracji        | Kroki                                                                                                        |
|-------------------|--------------------------------------------------------------------------------------------------------------|
| **Docker Compose** | 1. Przejdź do folderu `docker/`<br> 2. Uruchom komendę `docker compose up -d`<br> 3. Aplikacja webowa dostępna jest pod [http://localhost:3002/](http://localhost:3002/) |
| **Dev Setup**     | 1. Uruchom bazę danych poprzez komendę `docker run --name mariadb-gym-fit -e MARIADB_ROOT_PASSWORD=password -e MYSQL_DATABASE=gym-fitness -p 3306:3306 -d mariadb`<br> 2. W folderach `frontend/` oraz `backend/` uruchom polecenie `yarn && yarn start`<br> 3. Aplikacja webowa dostępna jest pod [http://localhost:4200/](http://localhost:4200/), a dokumentacja API pod [http://localhost:3000/api/](http://localhost:3000/api/) |

## Opis testów
### Jednostkowe
Opis testów jednostkowych  
[Test](backend/src/auth/auth.controller.ts)

### Integracyjne
Opis testów integracyjnych

## Przypadki testowe dla testera manualnego

## Technologie użyte w projekcie
![tech-stack](./tech.drawio.png)
