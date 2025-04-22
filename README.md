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
  - Currently reading: A felhasználó által jelenleg olvasott könyvet mutatja, ez m

---
