<h1 align="center">Reader's Record</h1>

## Az alkalmazás célja
Az alkalmazás Webprogramozás II tárgy beadandójaként jött létre. Képesek vagyunk könyveket keresni, azokat értékelni, kedvencként, illetve jelenleg olvasottnak vagy már elolvasottnak jelölni.

Tulajdonságok:
  - **Project nyelve:** A project SvelteKit segítségével íródott
  - **Adatbázis:** Az adatbázist az egyszerűség végett `sqlite` biztosítja. Emelett `Drizzle ORM` segít az alkalmazás és az adatbázis közötti kommunikáció lebonyolításában
  - **Autentikáció:** Az autentikáció megvalósításához `Auth.js`-t használtam.
---

### [Routes](https://github.com/XZD47P/ReadersRecord/tree/master/ReadersRecord/src/routes)
Az alkalmazás az alábbi végpontokat biztosítja a felhasználók számára:
- `/`: A webalkalmazás kezdőlapja, keresést biztosít cím alapján. Ha a keresés sikeres volt, a Book komponens segítéségel könyv mezőket jelenít meg a találat alapján
- `/login`: Betölti a LoginForm komponenst
- `/register`: Betölti a RegisterForm komponenst
- `/book/[id]`: Az adott ID-jú könyv részletes leírását jeleníti meg.
   - BookDetails komponens: A könyv leírását jeleníti meg
   - BookRating komponens: A könyv értékeléséért felelős
   - BookReviews komponens: A könyvhöz tartozó összes értékelését kezeli, ezt az oldal betöltésekor kérdezi le.
- `/profile`: A bejelentkezett felhasználóhoz tartozó adatokat jeleníti meg
  - ProfileCard komponens: A felhasználó "személyes" adatait jeleníti meg
  - Currently reading: A felhasználó által jelenleg olvasott könyvet mutatja, akkor tud csak újat jelölni, ha ezt a könyvet elolvasta már. Ilyenkor a könyv az elolvasott könyvekhez(readList) kerül. 
  - Books you read: A felhasználó által elolvasott könyveket tartalmazza
- `layout`: Maga az oldal egy navbar-t ad az összes oldalhoz, ami segítségével be/ki tudunk jelentkezni, valamint oldalak között tudunk váltani.
  - `layout.server.ts`: Betöltéskor a bejelentkezett felhasználó adatait a session változóba menti, így az bármely oldalon elérhető, valamint a pathname változóban tárolja az adott oldal URL címét 
---
### [API](https://github.com/XZD47P/ReadersRecord/tree/master/ReadersRecord/src/routes/api)
- `/api`: A webalkalmazáshoz tartozó API hívásokat tartalmazza
  - `/favourite`: A kedvenc könyvekhez tartozó műveleteket tartalmazza
    - `POST`: A kedvenc könyv felvételét és törlését tartalmazza. Szükséges adatok: userId, bookId, title, thumbnail, favourite(státusz). Ha a 'favourite' értéke true, akkor hozzáadjuk az elemet az adatbázishoz, ha false, akkor töröljük
    - `GET`: A kedvenc könyveket kéri le. Szükséges adatok: userId, bookId. Két állapota van:
      - Ha van bookId megadva, akkor lekérdezi, hogy az adott könyv szerepel-e a felhasználó kedvenc könyvei között
      - Ha nincs bookId megadva, akkor lekérdezi az összes kedvencnek jelölt könyvet, amit a felhasználó megjelölt
  - `/rating/[book_id]`: A könyvekhez tartozó értékeléseket kezeli
    - `POST`: A felhasználó által leadott értékelést menti el. Szükséges adatok: book_Id az URL-ből, session(ami tartalmazza a user adatait), rating, comment. Ha az adatbázisba való beküldés conflict-ol egy már létező bejegyzéssel, akkor azt frissíti
    - `GET`: A felhasználó adott értékelését kérdezi le az adott könyvhöz. A book_id-t itt is az URL-ből szerzi.
    - `DELETE`: A felhasználó adott értékelését törli ki az adatbázisból.
  - `/rating/[book_id]/all`:
    - `GET`: A könyvhöz tartozó összes értékelést kéri le, hogy aztán megjeleníthesse a `BookReviews` komponensben
  - `/reading_status`: A felhasználó képes megjelölni könyvet, amit éppen olvas. Ez max 1db könyv lehet, ha újat akar megjelölni, akkor az előzőt befejezettnek kell jelölnie
    - `POST`: Szükséges paraméterek: bookId, userId, title, thumbnail, reading. Először ellenőrzi, hogy van-e bejelentkezett felhasználó, illetve megvan-e a könyv id-ja. Ha igen és a "reading" paraméter true, akkor ellenőrzi, hogy van-e már a felhasználónak éppen olvasott könyve, ha van akkor hibát dob, ha nincs, akkor elmenti az adott könyvet éppen olvasottként. Ha a "reading" paraméter false, akkor a könyvet az elolvasottként menti, majd törli az éppen olvasott könyvek közül
    - `GET`: Szükséges paraméterek: userId, bookId. Ha a bookId létezik, akkor megkeresi az adott könyv állapotát. Ha nincs megadva a bookId, akkor lekérdezi a felhasználó jelenleg olvasott könyvét
  - `/reading_status/read`:
    - `GET`: Szükséges paraméter userId. Lekérdezi a felhasználó által elolvasott könyveket
  - `/register`:
    - `POST`: Szükséges paraméterek: username, email, password. Először ellenőrzi, hogy az adott email nincs-e már regisztrálva a rendszerben, ha van, akkor hibát dob. Ha nincs, akkor hash-eli az adott jelszót, majd elmenti az adatbázisba
---

### [Adatbázis](https://github.com/XZD47P/ReadersRecord/tree/master/ReadersRecord/src/lib/db)
- **Táblák**: A táblákat és a hozzájuk tartozó leírásokat, valamint az inicializáló parancsokat a [schema.ts](https://github.com/XZD47P/ReadersRecord/blob/master/ReadersRecord/src/lib/db/schema.ts) fájlban találhatóak
  - **Auth.js táblái**: Ezek a táblák vannak autentikációhoz használva. Az Auth.js számára szükséges táblák:
    - `user`: A felhasználó bejelentkezéséhez szükséges adatait tárolja. Oszlopai:
      - `id`: felhasználó egyedi azonosítója, típusa: text, elsődleges kulcs, alapértelmezett értékét a crypto.randomUUID függvény generálja
      - `name`: A felhasználó felhasználónevét tartalmazza, típusa: text
      - `email`: A felhasználó email-címét tartalmazza, típusa: text
      - `password`: A felhasználó hash-elt jelszavát tartalmazza, típusa: textt
      - `emailVerified`: Azt az adatot tartalmazza, hogy a felhasználó verifikálta-e az Emailjét !Nem implementált!
      - `image`: A felhasználó profilképét tartalmazza, típusa: text
    - `account`: A felhasználó OAuth fókjának adatait tartalmazza
      - `userId`: A felhasználó egyedi azonosítója, típusa: text, idegen kulcs: a user.id-t hivatkozza
      - `type`: A felhasználó regisztráció során használt adapterét tartalmazza. Lehet: oauth,oidc,email, webauthn
      - `provider`: Azt a szolgáltatót tartalmazza, amely az adatokat szolgáltatta. Típusa: text, elsődleges kulcs
      - `providerAccountId`: A szolgáltatónál a felhasználó ID-ja, típusa: text, elsődleges kulcs
      - `refresh_token`: Azt a tokent tartalmazza, amivel frissítheti az access_token-jét, típusa: text
      - `access_token`: A felhasználó szolgáltatóhoz való hozzáférését biztosító tokenje, típusa: text
      - `expires_at`: Lejárati dátumot tartalmaz, típusa: integer
      - `token_type`: A kapott token típusa, mező típusa: text
      - `scope`: A szolgáltatónál lekérendő adatok "kategóriája", típusa: text
    - `session`: Abban az esetben tárolna adatot, ha nem JWT tokent használnánk
  - **Általam létrehozott táblák**: Ezek a táblák a program funkcionalitását támogatják, az ahhoz szükséges adatokat tárolják
    - `book_rating`: A felhasználó által leadott értékeléseket tartalmazza
      - `user_id`: Az értékelő felhasználó azonosítóját tartalmazza, típusa: text, idegen kulcs: user.id-t hivatkozza, elsődleges kulcs
      - `book_id`: Az értékelt könyv egyedi azonosítóját tartalmazza, típusa: text, elsődleges kulcs
      - `rating`: Az értékelés mértéke, 1-5-ig a csillagok számát tartalmazza, típusa: integer
      - `comment`: Az értékeléshez fűzött hozzászólás, típusa: text
    - `favourite`: A felhasználók kedvenc könyveit tárolja
      - `user_id`: A felhasználó azonosítója, aki kedvencnek jelölte a könyvet, típusa: text, idegen kulcs: user.id-t hivatkozza, elsődleges kulcs
      - `book_id`: A könyv egyedi azonosítóját tartalmazza, típusa: text, elsődleges kulcs
      - `title`: A könyv címét tartalmazza, típusa: text
      - `thumbnail`: A könyv borítójának linkjét tartalmazza, típusa: text
    - `currently_reading`: A felhasználó által jelenleg olvasott könyvet tartalmazza
      - `user_id`: A felhasználó azonosítója, aki éppen olvasottnak jelölte a könyvet, típusa: text, idegen kulcs: user.id-t hivatkozza, elsődleges kulcs, egyedinek kell lennie
      - `book_id`: A könyv egyedi azonosítóját tartalmazza, típusa: text, elsődleges kulcs
      - `title`: A könyv címét tartalmazza, típusa: text
      - `thumbnail`: A könyv borítójának linkjét tartalmazza, típusa: text
    - `already_read`: A felhasználó által már elolvasott könyveket tartalmazza
      - `user_id`: A felhasználó azonosítója, aki elolvasta már a könyvet, típusa: text, idegen kulcs: user.id-t hivatkozza, elsődleges kulcs
      - `book_id`: A könyv egyedi azonosítóját tartalmazza, típusa: text, elsődleges kulcs
      - `title`: A könyv címét tartalmazza, típusa: text
      - `thumbnail`: A könyv borítójának linkjét tartalmazza, típusa: text
- **Tesztadatok**: A tesztadatok létrehozására a schema.ts-ben található egy programrész, ahol indításkor ellenőrizzük, hogy van-e felhasználó az adatbázisban, és ha nincs, akkor futtatjuk a `runSeed()` függvényt, ami a [Seed.ts](https://github.com/XZD47P/ReadersRecord/blob/master/ReadersRecord/src/lib/db/seed.ts)-ből lett exportálva
---
### [Svelte Komponensek](https://github.com/XZD47P/ReadersRecord/tree/master/ReadersRecord/src/lib/components)
- `Book.svelte`: A könyv "csempék" megjelenéséért felel a különböző oldalakon. Kötelező propok a könyvekhez tartozó title,thumbnail,id
- `BookDetails.svelte`: A könyvek részleteinek megjelenítéséért felel. Kötelező propok: title, thumbnail, publishDate, isbnNumber, genre, author, desc, bookId, session, ahol session a bejelentkezett felhasználó adatait tartalmazza. Betöltéskor leellenőrzi, hogy a könyvet a felhasználó kedvencnek/éppen olvasottnak jelölte-e, ha létezik session info.
  - **Funkciói**:
    - toggleFavorite(): A könyvet jelöli meg vagy távolítja el a kedvencek közül
    - toggleReadingStatus(): A könyvet jelöli meg éppen olvasottnak vagy már olvasottnak
- `BookRating.svelte`: A könyv értékelését kezeli. Kötelező propjai a bookId, illetve az onUpdate, ami a parent frissítését kezeli értékelés beküldése utána. Betöltéskor lekérdezi, hogy van-e az adott felhasználónak értékelése az adott könyvre, és ha igen, betölti azt.
  - **Funkciói**:
    -  submitRating(): A megírt értékelést menti el, majd szól a parentnek, hogy frissítse az értékeléseket
    -  deleteReview(): Ha a felhasználónak van értékelése, akkor lehetővé teszi, hogy törölhesse azt
-  `BookReviews.svelte`: A könyvekhez tartozó értékeléseket jeleníti meg. Kötelező propok: averageRating, reviewCount, reviews.
-  `LoginForm.svelte`: A bejelentkezési formot jeleníti meg.
  - **Funkciói**:
    - handleLogin(): Kezeli a bejelentkeztetést, meghívja az Auth.js-ből a signIn() metódust, ami configurálható különböző providerek szerint
- `RegisterForm.svelte`: A regisztrációs formot jeleníti meg.
  - **Funkciói**:
    - registerUser(): A felhasználó által megadott adatok alapján létrehoz egy felhasználót egy API hivás segítségével
- `ProfileCard.svelte`: A felhasználó profil oldalán jeleníti meg adatait névjegykártya formátumban, az adatokat a data propon keresztül tudjuk átadni neki.
---
