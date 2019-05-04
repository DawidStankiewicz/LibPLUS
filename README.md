# LibPLUS
Rozszerzenie do przeglądarki Google Chrome pozwalające wyświetlić średnią ucznia w systemie Librus, nawet jeżeli podgląd został wyłączony przez administrację.

## Obecne funkcje (v3.0)
- podgląd średniej ważonej ucznia
- podgląd średniej ważonej z każdego przedmiotu (I semestr, II semestr, całoroczna) 
- podgląd średniej z ocen śródrocznych, przewidywanych rocznych i rocznych
- licznik ocen ucznia
- eksport ocen do Excela
- wyświetlanie ocen i średniej z wybranego okresu

## Instalacja
Instalacja rozszerzenia LibPLUS w Google Chrome jest bardzo prosta.

1. Przejdź do https://goo.gl/tOqmg2
2. Kliknij "DODAJ DO CHROME"

Gotowe. 


## Eksport ocen do Excela
W wersji 3.0 funkcja eksportu ocen została usunięta.

## Demo - konto testowe
Po instalacji rozszerzenie można przetestować logując się na konto testowe [portal.librus.pl](https://portal.librus.pl/rodzina/synergia/loguj)

- login: `demorodzic` lub `13335` 
- hasło: `librus11`

## Zgłaszanie błędów
 Wszelkie błędy można zgłaszać poprzez:
 - [zakładkę 'Issues' na Githubie](https://github.com/DawidStankiewicz/LibPLUS/issues)
 - [sklep Google Store](https://chrome.google.com/webstore/detail/libplus-podgl%C4%85d-%C5%9Bredniej/logdgpobdggdjliepjjfmnggmbpohmka/support?hl=pl&gl=PL)
 - [Messengera](https://m.me/StankiewiczDawid)

## Zmiany:

### v3.0.0

### v2.2.1 (06.06.2017)
- naprawione liczenie średniej z ocen rocznych

### v2.2.0 (01.06.2017)
- liczenie średniej z ocen przewidywanych i rocznych

### v2.1.2 (20.03.2017)
- poprawiony błąd powodujący problemy z wyświetlaniem średniej w drugim półroczu
- zmiana określania semestru dla oceny - semestr jest teraz definiowany w głównej pętli tworzącej listę wszystkich ocen (findAllGrades)

### v2.1.1 (06.02.2017)
- włączenie dla trybu "od ostatniego logowania"
- rozwiązanie problemu z uruchomieniem rozszerzenia[?] (rozszerzenie mogło się nie uruchamiać z powodu błędnego wykrywania trybu "od ostatniego logowania")

### v2.1 (02.02.17)
- wsparcie drugiego semestru
- średnia przedmiotu z drugiego semestru
- średnia przedmiotu całoroczna

### v2.0 (12.01.17)
- nowe funkcje
- eksport ocen do Excela
- wyświetlanie średniej z ocen śródrocznych (I semestr)
- wyświetlanie ocen i średniej z wybranego okresu (BETA)
- prawidłowe liczenie średniej ważonej (funkcja zliczająca była źle napisana)
- prawidłowe zliczanie wszystkich ocen ucznia
- adres do zgłaszania błęów w menu pop-up
- uruchamianie tylko w trybie wszystkich ocen

### v1.6 
- poprawa błędu "NaN" w przypadku braku ocen z przedmiotu (tylko plusy, minusy lub 'np')

### v1.5 
- naprawiony błąd z kodowaniem znaków

### v1.3
- naprawiony błąd "NaN" 

### v1.2
- naprawiony błąd z "np" 
- naprawiony błąd z ocenami które nie liczą się do średniej
- nowy wygląd menu pop-up

### v1.1
- podgląd średniej ważonej ze wszystkich ocen
- podgląd średniej ważonej wybranych przedmiotów
- licznik ocen






