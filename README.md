# LibPLUS
Rozszerzenie do przeglądarki Google Chrome pozwalające wyświetlić średnią ucznia w systemie Librus, nawet jeżeli podgląd został wyłączony przez administrację.

## Obecne funkcje (v2.1)
- podgląd średniej ważonej ucznia
- podgląd średniej ważonej z każdego przedmiotu (I semestr, II semestr, całoroczna) 
- podgląd średniej z ocen śródrocznych
- licznik ocen ucznia
- eksport ocen do Excela
- wyświetlanie ocen i średniej z wybranego okresu

## Instalacja
Instalacja rozszerzenia LibPLUS w Google Chrome jest bardzo prosta.

1. Przejdź do https://goo.gl/tOqmg2
2. Kliknij "DODAJ DO CHROME"

Gotowe. 


## Eksport ocen do Excela
Żeby pobrać kopię swoich ocen, wystarczy użyć zielonego przycisku "Eksportuj".

Funkcja zrealizowana dzięki [ExcelPlus](http://aymkdn.github.io/ExcelPlus)

## Oceny z wybranego okresu
W wersji 2.0.0 wprowadzona została funkcja wyświetlania ocen i średniej z wybranego okresu. 
Po wybraniu daty początkowej oraz końcowej (w formacie miesiąć/dzień/rok) należy wcisnąć przycisk "POKAŻ". Wyświetlą się oceny i średnia tylko z wybranego okresu.

Funkcja może nie działać w pełni prawidłowo. Proszę zgłaszać błędy.

## Zgłaszanie błędów
 Wszelkie błędy można zgłaszać:
 - [przez GitHuba](https://github.com/DawidStankiewicz/LibPLUS/issues)
 - [w sklepie Google Store](https://chrome.google.com/webstore/detail/libplus-podgl%C4%85d-%C5%9Bredniej/logdgpobdggdjliepjjfmnggmbpohmka/support?hl=pl&gl=PL)

## Zmiany:

### v1.1
- podgląd średniej ważonej ze wszystkich ocen
- podgląd średniej ważonej wybranych przedmiotów
- licznik ocen

### v1.2
- naprawiony błąd z "np" 
- naprawiony błąd z ocenami które nie liczą się do średniej
- nowy wygląd menu pop-up

### v1.3
- naprawiony błąd "NaN" 

### v1.5 
- naprawiony błąd z kodowaniem znaków

### v1.6 
- poprawa błędu "NaN" w przypadku braku ocen z przedmiotu (tylko plusy, minusy lub 'np')

### v2.0 (12.01.17)
- nowe funkcje
- eksport ocen do Excela
- wyświetlanie średniej z ocen śródrocznych (I semestr)
- wyświetlanie ocen i średniej z wybranego okresu (BETA)
- prawidłowe liczenie średniej ważonej (funkcja zliczająca była źle napisana)
- prawidłowe zliczanie wszystkich ocen ucznia
- adres do zgłaszania błęów w menu pop-up
- uruchamianie tylko w trybie wszystkich ocen

### v2.1 (02.02.17)
- wsparcie drugiego semestru
- średnia przedmiotu z drugiego semestru
- średnia przedmiotu całoroczna

### v2.1.1 (06.02.2017)
- włączenie dla trybu "od ostatniego logowania"
- rozwiązanie problemu z uruchomieniem rozszerzenia[?] (rozszerzenie mogło się nie uruchamiać z powodu błędnego wykrywania trybu "od ostatniego logowania")

### v2.1.2 (20.03.2017)
- poprawiony błąd powodujący problemy z wyświetlaniem średniej w drugim półroczu
- zmiana określania semestru dla oceny - semestr jest teraz definiowany w głównej pętli tworzącej listę wszystkich ocen (findAllGrades)
