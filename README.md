# Testowanie i jakość oprogramowania

## Autor
Kajetan Nowak

## Temat projektu
Aplikacja gym-fit

## Opis projektu
***Aplikacja webowa Gym fit ma na celu dostarczenie użytkownikom informacji o treningach w danym obiekcie sportowym.*** \
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
Testy jednostkowe zostały zdefiniowane w plikach `.spec.ts` w folderach `gym-users` weryfikujące poprawne działanie metod związanych z operacjami na danych użytkowników oraz `trainings` - operacje na danych treningów.

*Gym-users*
- [Pobieranie użytkowników](backend/src/gym-users/gym-user.controller.spec.ts#L56) - pobranie wszystkich użytkowników systemu
- [Pobieranie użytkowników po roli](backend/src/gym-users/gym-user.controller.spec.ts#L67) - pobranie użytkowników po roli z wykorzystaniem parametryzacji argumentu role
- [Zapisanie użytkownika na trening](backend/src/gym-users/gym-user.controller.spec.ts#L83) - zapisanie użytkownika na dany trening, rezultat - lista użytkowników danego treningu zawiera nowego użytkownika 
  
*Trainings*
- [Pobranie treningów](backend/src/trainings/training.controller.spec.ts#L72) - pobranie wszystkich treningów w systemie
- [Pobranie treningów po nazwie](backend/src/trainings/training.controller.spec.ts#L81) - pobranie treningów spełniających filtry wyszukiwania po nazwie treningu
- [Pobranie treningów po typie treningu](backend/src/trainings/training.controller.spec.ts#L93) - pobranie treningów spełniających filtry wyszukiwania po typie treningu
- [Pobranie treningów po nazwie oraz typie treningu](backend/src/trainings/training.controller.spec.ts#L105) - pobranie treningów spełniających oba filtry wyszukiwania - po nazwie oraz typie treningu
- [Dodanie nowego treningu](backend/src/trainings/training.controller.spec.ts#L118) - dodanie nowego treningu przez trenera
- [Aktualizacja treningu](backend/src/trainings/training.controller.spec.ts#L141) - aktualizacja treningu o nazwę, datę oraz typ treningu

### Integracyjne
Testy integracyjne zostały zdefiniowane w plikach `.ispec.ts` w folderach `test/users` oraz `test/trainings`. Dodatkowo plik `fixtures.ts` zawiera predefiniowane dane, które są używane w żądaniach i odpowiedziach HTTP. W folderze `mocks` zdefiniowane są atrapy guardów - auth oraz roles. W pliku `setup.ts` tworzony jest dynamicznie kontener bazy danych, a w pliku `teardown.ts` jest on niszczony.

*Gym-users*
- [Pobranie wszystkich użytkowników](backend/test/users/users-retrieving.ispec.ts#L33) - żądanie HTTP pod endpoint /users powinno zwrócić status 200 oraz wszystkich użytkowników
- [Pobranie użytkowników po roli](backend/test/users/users-retrieving.ispec.ts#41) - żądanie HTTP pod endpoints /users?role= powinno zwrócić status 200 oraz użytkowników spełniających warunki filtrów
- [Zapisanie na trening](backend/test/users/users-manipulation.ispec.ts#L69) - żądanie HTTP pod endpoint /users/:email/training/:trainingId z ważnym JWT powinno zwrócić status 200 oraz dane związane z treningiem oraz użytkownikami

*Trainings*
- [Pobranie wszystkich treningów](backend/test/trainings/trainings-retrieving.ispec.ts#L42) - żądanie HTTP pod endpoint /trainings powinno zwrócić status 200 oraz wszystkie treningi
- [Pobranie treningów po nazwie](backend/test/trainings/trainings-retrieving.ispec.ts#L50) - żądanie HTTP pod endpoint /trainings?name= powinno zwrócić treningi spełniające wymagania filtra wyszukiwania po nazwie treningu
- [Pobranie treningów po nazwie oraz typie](backend/test/trainings/trainings-retrieving.ispec.ts#L60) - żądanie HTTP pod endpoint /trainings?name=&workoutType= powinno zwrócić treningi spełniające wymagania filtra po nazwie oraz typie
- [Pobranie treningów po typie](backend/test/trainings/trainings-retrieving.ispec.ts#L70) - żądanie HTTP pod endpoint /trainings?workoutType= powinno zwrócić treningi spełniające wymagania filtra wyszukiwania po typie treningu
- [Dodanie nowego treningu](backend/test/trainings/trainings-manipulation.ispec.ts#L57) - żądanie HTTP pod endpoint /training z ważnym JWT powinno zwrócić status 201 i nowo dodany trening
- [Dodanie nowego treningu z niepoprawnym JWT](backend/test/trainings/trainings-manipulation.ispec.ts#L81) - żądanie HTTP pod endpoint /training z błędnym JWT powinno zwrócić status 403
- [Aktualizacja treningu](backend/test/trainings/trainings-manipulation.ispec.ts#L95) - żądanie HTTP pod endpoint /trainings/:trainingId powinno zwrócić status 200 oraz zaktualizować trening
- [Usuwanie treningu](backend/test/trainings/trainings-manipulation.ispec.ts#L108) - żądanie HTTP pod endpoint /trainings/:trainingId powinno zwrócić status 200 oraz usunąć trening

## Przypadki testowe dla testera manualnego
Plik `test-cases.pdf` w katalogu głównym.

## Technologie użyte w projekcie
![tech-stack](./tech.drawio.png)
