# Patronage
## Frontend Zadanie 1

## Opis:

- Strona powinna się składać z listy pizz (na środku) oraz koszyka (po prawej stronie)
- Każdy element na liście pizz powinien zawierać obrazek, nazwę, cenę, listę składników
oraz przycisk „zamów”
- Lista pizz powinna być pobierana dynamicznie na starcie z
https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json
- Przycisk „zamów” dodaje pizzę do koszyka
- Jedna pizza może być dodana wiele razy do koszyka
- Każdy element w koszyku powinien zawierać nazwę, cenę, ilość oraz przycisk „usuń”
- Przycisk „usuń” kasuje pizzę z koszyka, jeżeli była dodana wiele razy to zmniejsza się
ilość o 1
- W koszyku powinna być wyświetlona cena całkowita za zamówienie
- Jeżeli pizza jest dodawana do koszyka lub z niego kasowana to cena całkowita jest
przeliczona na nowo
- Jeżeli koszyk jest pusty to cena całkowita jest ukryta i w koszyku wyświetla się napis
„Głodny? Zamów naszą pizzę”
- Koszyk jest tymczasowy, przeładowanie strony czyści koszyk

## Działanie:
![frontZad1](https://user-images.githubusercontent.com/38572172/142958582-7847930d-9d32-4813-b849-d13343ca11ef.png)


## Frontend Zadanie 2

## Opis:
Zadanie polega na rozszerzeniu aplikacji webowej dla pizzerii, wymagania:
- Aplikacja powinna byc responsywna zgodnie z zasadą „mobile first”
- Koszyk powinien być zapisywany – po odświeżeniu strony dodane elementy sa dalej w 
koszyku (należy skorzystać z „localStorage”)
- Filtrowanie po składnikach – wpisanie składnika odświeża listę dostępnych pizz, 
filtrowanie powinno być automatyczne, czyli użytkownik wpisuje i lista powinna się 
odświeżyć bez dodatkowych przycisków/akcji. Użytkownik może podać wiele 
składników odzielając je przecinkiem. Porównywanie powinno być proste, bazując 
jedynie na tym czy składnik zawiera wpisany tekst.
- Sortowanie po nazwie rosnąco (A-Z) (domyślne sortowanie – otwierając strone 
produkty powinny być już posortowane), nazwie malejąco (Z-A), cenie malejąco i cenie 
rosnąco
- Sortowanie/Filtrowanie nie jest zapisywane po odświeżeniu strony
- Przycisk „wyczyść koszyk” – kasuje wszystkie pizze z koszyka
- Pliki *.js posiadają 'use strict’

## Działanie:
