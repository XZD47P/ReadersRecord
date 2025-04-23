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
- `/api`: A webalkalmazáshoz tartozó API hívásokat tartalmazza, ezek:
  - `/favourite`: A kedvenc könyvekhez tartozó műveleteket tartalmazza
    - `POST`: A kedvenc könyv felvételét és törlését tartalmazza. Szükséges adatok: userId, bookId, title, thumbnail, favourite(státusz). Ha a 'favourite' értéke true, akkor hozzáadjuk az elemet az adatbázishoz, ha false, akkor töröljük
    - `GET`: A kedvenc könyveket kéri le. Szükséges adatok: userId, bookId. Két állapota van:
      - Ha van bookId megadva, akkor lekérdezi, hogy az adott könyv szerepel-e a felhasználó kedvenc könyvei között
      - Ha nincs bookId megadva, akkor lekérdezi az összes kedvencnek jelölt könyvet, amit a felhasználó megjelölt
  - `/rating/[book_id]`: A könyvekhez tartozó értékeléseket kezeli
    - `POST`: A felhasználó által leadott értékelést menti el. Szükséges adatok: book_Id az URL-ből, session(ami tartalmazza a user adatait), rating, comment. Ha az adatbázisba való beküldés conflict-ol egy már létező bejegyzéssel, akkor azt frissíti
    - `GET`: A felhasználó adott értékelését kérdezi le az adott könyvhöz. A book_id-t itt is az URL-ből szerzi.
    - `DELETE`: A felhasználó adott értékelését törli ki az adatbázisból.

---
