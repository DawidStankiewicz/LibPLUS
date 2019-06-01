# LibPlus
Rozszerzenie do przeglądarki pozwalające wyświetlić średnią ucznia w systemie Librus, nawet jeżeli podgląd został wyłączony przez administrację.

// todo zrzuty ekranu


## Instalacja

### Google Chrome
Instalacja rozszerzenia LibPlus w Google Chrome jest bardzo prosta.

1. Przejdź do https://goo.gl/tOqmg2
2. Kliknij przycisk "DODAJ DO CHROME"

Gotowe. 

### Opera
// todo

### Mozilla Firefox
// todo

## Obecne funkcje (v3.0)
- podgląd średniej ze wszystkich ocen
- podgląd średniej z każdego przedmiotu (I semestr, II semestr, całoroczna) 
- podgląd średniej z ocen proponowanych i śródrocznych
- podgląd średniej z wybranego okresu
- licznik ocen ucznia


## Demo - konto testowe
Po instalacji rozszerzenie można przetestować, logując się na konto testowe [portal.librus.pl](https://portal.librus.pl/rodzina/synergia/loguj)

- login: `demorodzic` lub `13335` 
- hasło: `librus11`

## Kontakt
Sugestie, błędy, oferty współpracy czy pytania: 
 - [Messenger](https://m.me/StankiewiczDawid)
 - email: dawid.stanki[at]gmail.com

## Zgłaszanie błędów
 Wszelkie błędy można zgłaszać poprzez:
 - [zakładkę 'Issues' na Githubie](https://github.com/DawidStankiewicz/LibPlus/issues)
 - [sklep Google Store](https://chrome.google.com/webstore/detail/libplus-podgl%C4%85d-%C5%9Bredniej/logdgpobdggdjliepjjfmnggmbpohmka/support?hl=pl&gl=PL)
 - [Messengera](https://m.me/StankiewiczDawid)
 
## Ryzyko związane z funkcją autologowania

Korzystanie z funkcji automatycznego logowania w obecnej postaci nie jest zalecane!
 
Rozszerzenia przeglądarkowe takie jak LibPlus nie posiadają 
wsparcia systemu bezpiecznego przechowywania danych autoryzacyjnych.
**Opcja autologowania przechowuje w przeglądarce dane logowania 
do Librusa w postaci niezabezpieczonej** (base64), które mogą zostać skradzione i wykorzystane przez 
niepowołane osoby.

Nie należy korzystać z opcji autologowania na komputerach w miejscach 
publicznych (takich jak szkoła czy biblioteka), a także, 
gdy do komputera mają dostęp inne osoby.

Aby ograniczyć ryzyko związane z opcją autologwania, zaleca się:
- instalowanie oprogramowania tylko z wiarygodnych źródeł
- reguralne aktualizowanie oprogramowania
- pełne szyfrowanie dysku twardego
- blokowanie ekranu na czas oddalenia się od komputera
- obserwowanie, z jakich adresów IP następują logowania do dziennika
- częste zmiany hasła
- stosowanie niepowtarzalnych haseł!

**Korzystając z opcji autologowania, 
akceptujesz ryzyko związane z możliwą kradzieżą Twojego loginu i hasła!**


## Eksport ocen do Excela
Od wersji 3.0 funkcja eksportu ocen do Excela nie jest dostępna.

## Zmiany

### v3.0.0 (01.06.2019)
- przepisanie kodu z użyciem Node.js oraz Webpacka
- nowy prosty interfejs na stronie oraz w menu popup
- odświeżenie menu popup
- dodanie podglądu średniej w menu popup (oraz panelu logowania)
- dodanie funkcji automatycznego logowania (storage bez szyfrowania)
- dodanie skryptów GA
- pobieranie danych z serwera co 60 minut

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






