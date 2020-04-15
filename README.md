Sovellus on TypeScript/Angular-selainsovellus. Käännösympäristö on VSCode/CLI. Sovelluksesta on valmis instanssi Herokussa osoitteessa https://bussikoodi.herokuapp.com/.

Koodi kääntyy komennolla "ng build --prod --base-href", dist-kansiosta sitten palvelimelle sinne tullut uusi kansio. Heroku vaati juureen server.js ohjaamaan reittejä sekä muutoksen package.json tiedostoon käynnistämisessä.

Reitinhaussa sovellan Dijkstran algoritmia. Käyn kaikki avoimet reitit lävitse käsitellen aina ensimmäisenä lyhimmän tiedossa olevan etenemisvaihtoehdon ja lopettaen reittivaihtoehdon tutkimisen, jos tiedossa on jo lyhyempi reitti jolla päästään maaliin asti. Avoimia reittivaihtoehtoja käydään lävitse kunnes kaikki on käsitelty.