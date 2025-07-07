# IME
## 1. Težava
Trenutni pristopi k načrtovanju in odpiranju rudnikov so zelo dragi in dolgotrajni. To se še poslabša z vsako nepričakovano geološko ali tehnično oviro, kar na koncu vodi v nižji donos na investicijo.
## 2. Rešitev
Digitalni dvojček rudnika je rešitev s primarno spletnim vmesnikom in namizno aplikacijo za administrativno delo s podatki v podatkovni bazi.
### 2.1 Spletna rešitev:
Spletna aplikacija je namenjena predvsem uporabnikom. Omogoča registracijo/prijavo, po kateri lahko uporabnik na zemljevidu zariše svoj rudnik. Ko uporabnik vnese meje rudnika, pridobi podatke o mineralih na tem geografskem območju. Zatem si lahko ustvari rudnik, doda minerale, delavce in infrastrukturo. Po uspešno dodanem rudniku ima možnost urejanja podatkov o rudniku.
### 2.2 Namizna aplikacija:
Namizna aplikacija je primarno namenjena internemu upravljanju podatkovne baze. Omogoča dodajanje, odstranjevanje in urejanje rudnikov, generiranje naključnih rudnikov ter zajem (scrapanje) podatkov s spleta.
## 3. Rešitve po zahtevah posameznih predmetov
### 3.1 Sistemska administracija
Pri predmetu Sistemska administracija smo spletno aplikacijo in zaledni del gostili na strežniku Microsoft Azure. Ustvarili smo Dockerfile in zgradili slike, preko katerih smo zaganjali zaledni in čelni del. Vzpostavili smo CI/CD preko GitHub Actions, kjer smo preverili zaganjanje sistema na operacijskih sistemih macOS in Linux, resetirali Azure strežnik ter naložili sliko na DockerHub.
### 3.2 Principi programskih jezikov
Pri predmetu Principi programskih jezikov smo morali pridobiti podatke s pomočjo spletnega pajka (web scraperja). Ko smo podatke pridobili, smo jih prilagodili glede na strukturo naše podatkovne baze in jih shranili. Zgradili smo tudi namizno aplikacijo za delo s temi podatki (dodajanje, urejanje, odstranjevanje) ter dodali funkcionalnost za generiranje naključnih podatkov.
### 3.3 Prevajanje programskih jezikov
Pri predmetu Prevajanje programskih jezikov smo ustvarili gramatiko za jezik, ki opisuje rudnik (njegovo strukturo in pozicijo), jo pretvorili v LL(1) in razvili leksikalni analizator (lexer), analizator (parser) ter abstraktno sintaksno drevo (AST).
### 3.4 Spletno programiranje
Pri predmetu Spletno programiranje smo razvili spletno aplikacijo za ustvarjanje, urejanje in brisanje rudnikov. Dodane so bile naslednje funkcionalnosti:
- JWT (za preverjanje avtentikacije),
- WebSockets (pri dodajanju rudnika se pošlje obvestilo vsem uporabnikom),
- animacije,
- statistika,
- geografsko-prostorske poizvedbe,
- API za CRUD operacije,
- API za preverjanje mineralov na določenem geografskem območju,
- dodajanje zgodovine izkopov posameznih rudnikov,
- registracija in prijava.
## 4. Navodila za namestitev
### 4.1 Zaledni del
Kloniraš repozitorij in zaženeš:
``` bash
  sudo docker build -t backend:latest .
  sudo docker run -d -p 3001:3001 --name backend-container backend:latest
```
### 4.2 Čelni del
Kloniraš repozitorij in zaženeš:
```bash
  sudo docker build -t frontend:latest .
  sudo docker run -d -p 3000:80 --name frontend-container frontend:latest
```
### 4.3 Prevajalnik jezika

Ta dokument vsebuje navodila za prevajanje in zagon projekta "rudniki_jezik" s pomočjo CMake. Predpostavljamo, da ste izvorno kodo projekta že pridobili (npr. preko `git clone` ali `git pull`).

#### Predpogoji

Preden nadaljujete, se prepričajte, da imate na svojem sistemu nameščeno naslednje:

1.  **C++ Prevajalnik**: Prevajalnik, ki podpira C++17 (npr. GCC, Clang, MSVC).
2.  **CMake**: Minimalna priporočena različica je 3.10.
3.  **Internetna povezava**: Morda potrebna, če vaš sistem potrebuje posodobitev upraviteljev paketov za namestitev C++ prevajalnika ali CMake.

#### Postopek prevajanja in zagona s CMake

1.  **Odprite terminal ali ukazno vrstico.**

2.  **Pomaknite se v korensko mapo projekta** (mapa, ki vsebuje datoteko `CMakeLists.txt`):
    ```bash
    cd pot/do/projekta/rudniki_jezik
    ```

3.  **Konfigurirajte projekt s CMake.** Ta korak bo ustvaril gradbene datoteke v podmapi `build`.
    ```bash
    cmake -S . -B build
    ```

4.  **Prevedite projekt.** Ta ukaz bo zagnal dejanski proces prevajanja.
    ```bash
    cmake --build build
    ```
    *   Če želite zgraditi specifično konfiguracijo (npr. Debug ali Release), lahko dodate zastavico `--config`:
        *   Za Debug konfiguracijo: `cmake --build build --config Debug`
        *   Za Release konfiguracijo: `cmake --build build --config Release`
        (To je bolj relevantno za večkonfiguracijske generatorje, kot je Visual Studio. Pri enokonfiguracijskih generatorjih, kot so Makefiles, se konfiguracija običajno nastavi med korakom `cmake -S . -B build` z `-DCMAKE_BUILD_TYPE=Debug` ali `Release`.)

5.  **Zagon glavnega programa.**
    Izvedljiva datoteka `rudniki_jezik` (ali `rudniki_jezik.exe` na Windows) bo ustvarjena neposredno v mapi `build` (ali v podmapi, kot je `build/Debug` ali `build/Release`, če ste eksplicitno uporabili `--config` pri gradnji z večkonfiguracijskim generatorjem).

    *   Na Linux/macOS (iz mape `build`):
        ```bash
        ./rudniki_jezik
        ```
        (Če je v podmapi Debug: `./Debug/rudniki_jezik`)

    *   Na Windows (iz mape `build`):
        ```powershell
        .\rudniki_jezik.exe
        ```
        (Če je v podmapi Debug: `.\Debug\rudniki_jezik.exe`)
## 5. Ključni primeri uporabe
### 5.1 Prijava in registracija
**Kaj želimo doseči:** Registrirati ali prijaviti uporabnika.

1. Kliknemo na ikono uporabnika v desnem zgornjem kotu.
2. Preusmerjeni smo na stran prijave uporabnika:
   - Prijavimo se, ali
   - Kliknemo na gumb **"Registracija novega uporabnika"**
3. Po uspešni prijavi smo preusmerjeni na uporabniško stran.
### 5.2 Ustvarjanje rudnika

**Kaj želimo doseči:** Ustvariti nov rudnik.

1. Gremo na zemljevid in kliknemo gumb **"Dodaj rudnik"**.
2. Zarišemo meje rudnika.
3. Pridobimo oceno lokacije (vrednosti mineralov v okolici) in kliknemo **"Naprej"**.
4. Vnesemo podatke o rudniku in kliknemo **"Shrani"**.
### 5.3 Posodabljanje rudnika
**Kaj želimo doseči:** Posodobiti obstoječi rudnik.

1. Gremo na zavihek **"Rudniki"** in izberemo želeni rudnik.
2. Uredimo rudnik:
   - Dodamo/odstranimo minerale, delavce, infrastrukturo
   - Kliknemo **"Uredi osnovne podatke"**
     - Spremenimo osnovne podatke rudnika

## 6. Povezave do specifičnih delov infrastrukture
Dokumentacije vseh specifičnih delov so v mapi /docs navodila in postopek za namestitev pa v readme
- [Zaledni del](https://github.com/aneimarkovic/rudniki_backend)
- [Čelni del](https://github.com/darkosever-um/rudniki_frontend)
- [Jezik](https://github.com/aneimarkovic/rudniki_jezik)
- [Web scrapper](https://github.com/Anomi132/IME-Scraper)
