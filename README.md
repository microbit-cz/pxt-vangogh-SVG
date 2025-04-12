# Repository Archived
This repository has been archived and is no longer maintained.

The official successor to this project with enhanced functionality and Windows 11 support can be found at:

[https://github.com/microbit-cz/VanGogh-Painter-web](https://github.com/microbit-cz/VanGogh-Painter-web)

The new VanGogh Painter web application offers improved features including:
- Full Windows 11 compatibility
- Enhanced SVG editing capabilities
- Better micro:bit connectivity
- Improved canvas scaling and visualization tools

We recommend migrating to the new repository for continued development and support.

# VanGogh SVG
Vektorová tiskárna - robot jezdící podle příkazů želví grafiky dodaných přes Bluetooth ovládácí webový panel.
Příkazy jsou vytvořeny ze zadaného SVG `<path>` commandu - jeho parametru `d`

## Umístění
- /algorithm/ - Algoritmus na převádění SVG do Želví grafiky
- /microbit/ - Soubory pro micro:bit (v2, na v1 je to moc velké)
- /wimble-src/ - Zdroj ovládácího panelu. Zdroje mapy a widgetů se nacházejí v ./src/views/Widgets/ 
- /wimble-prod/ - Zbundlovaný kód wimble - Web Interface for Microbit Bluetooth Low Energy

## Video
Průmka TV - https://youtu.be/fnbRMtTpKEs

## Autoři 

- Tomáš Kubíček - @tkdeeev
- Matěj Matějka - @pixelgon, https://pixelgon.cz

# Ovládání VanGogh a Wimble

## Postup: 
- Spustíme WIMBLE - buď jako webovou stránku (https://wimble.tkdev.cz - pozor bez http**s** nefunguje Bluetooth), nebo jako "aplikaci" na ploše (zástupce webové stránky), nebo jako samostatnou konzolovou aplikaci - ve složce na ploše je buď batch soubor, který aplikaci spustí, nebo jí spustíme přes příkazový řádek (`npm run dev` a poté `o` pro otevření webu, který by měl běžet na https://localhost:8100)
- Spustíme microbit, pokud již není napárovaný, podržíme tlačítka A,B a Reset (vzadu) na microbitu, jakmile se načte ikonka bluetooth na 5x5 led displeji.
- Napárujeme microbit s počítačem kliknutí na střed webové stránky a vybráním microbitu z dialogového okna.
- Počkáme 1-8 s než se načte rozhraní, pokud se nenačte, došlo k chybě a zkusíme to znovu, pokud to znovu nejde, je chyba jinde.
- Zobrazí se jednotlivé widgety, můžeme zobrazit název microbitu, zapínat/vypínat ledky na displeji, sledovat zrychlení (akcelerometr) a kompas (magnetometr), a nastavovat a odesílat kód želví grafiky na microbita (mapa)

- Nakreslíme obrázek ve Figmě, nebo jiném SVG editoru (Figma bude fungovat vždy). Obrázek musí být pouze jeden samostatný objekt SVG cesty. Zkopírujeme SVG obrázku (Rclick, Copy as - Copy as SVG). Při zoomu cca 400% odpovídá velikost na obrazovce velikosti papíru. Pokud by byl obrázek moc velký, můžeme ho jen zmenšit zmenšením bounding boxu. Měřítko je 1px ve Figmě = 1mm na papíru 
- Na stránce u mapy klikneme na tlačítko "Nastavit PATH" a do dialogu vložíme SVG, které jsme zkopírovali. Pokud by to nefungovalo , zkusíme z SVG vybrat jen atribut `d=""` v elementu `<path>`.
- Můžeme přiblížit mapu sliderem, a kouknout se na vygenerovanou cestu. Pokud vypadá jinak, může být problém při kreslení obrázku. 
- Microbit umístíme na papír, ideálně do levého horního rohu směrem kam se bude kreslit (dolů). Levý horní roh na mapě je místo, kde microbit začíná.
- Pokud chceme odeslat výstup na microbit, stiskneme tlačítko "Odeslat", v dialogu se zobrazí vegenerovaný kód, dialog zavřeme. Měl by se zobrazit červeně progress uploadu a po nahráním zeleně progress kreslení. Zeleně jde i vidět, která čára je v dané chvíli kreslena. 
- Nastavení PATHu a Odeslání můžeme opakovat. Pro přesunutí se do výběru microbitu z ovládacího rozhraní stiskneme Escape, nebo smažeme cestu URL obsahující `/device` .
