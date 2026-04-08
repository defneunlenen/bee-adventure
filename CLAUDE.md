# Ari Macerasi - Bee Adventure

## Proje Ozeti
Super Mario tarzi HTML5 platformer oyun.

## Dosya Yapisi
```
game1/
├── bee-adventure.html      # HTML + CSS + script yukleme
├── CLAUDE.md
└── js/
    ├── config.js           # Sabitler, canvas, global state, player objesi, veri dizileri
    ├── input.js            # Klavye/touch input yonetimi, keys, gameKeys, blur handler
    ├── renderer.js         # Tum draw fonksiyonlari (sky, cloud, flower, butterfly, ground, bee, bird, coin, flag, checkpoint, superbox, stinger, HUD, particles)
    ├── player.js           # updatePlayer (fizik, collision, kamera), playerDie
    ├── level.js            # generateLevel (zemin, platformlar, coinler, dusmanlar, bulutlar, cicekler, kelebekler, checkpointler, super kutular)
    ├── enemies.js          # updateEnemies, updateCoins, updateCheckpoints, updateSuperBoxes, updateStingers, checkWin, rectCollide, aliveCollide, updateClouds, updateButterflies
    ├── ui.js               # showOverlay, startGame
    └── game.js             # gameLoop, setupTouchControls, baslangic cagrilari
```

Script yukleme sirasi (bagimlilik sirasiyla): config -> input -> renderer -> player -> level -> enemies -> ui -> game

## Oyun Temasi
- Karakter: Ari (bee) - kanat cirpan, cizgili, antenli
- Dusmanlar: Kirmizi ucan kuslar + mor yuryen kuslar (kizgin bakisli)
- Arka plan: Acik mavi gokyuzu, bulutlar, gunes, renkli cicekler, kelebekler, polen tanecikleri
- Toplanabilir: Bal damlalari (+10 puan)

## Oyun Mekanikleri

### Hareket
- Ok tuslari / WASD: Hareket
- Space / Yukari ok: Ziplama
- Ziplama kuvveti: -14.4 (orijinal -12'nin 1.2 kati)
- Dusman ustune sekme: -9.6

### Seviyeler
- 3 seviye, her biri WORLD_WIDTH=200 tile genisliginde
- Her seviyede artan zorluk: daha fazla dusman, daha genis ucurumlar
- Seviye sonu: "KOVAN" bayragi

### Checkpoint (Save Point) Sistemi
- Her seviyede 3+level adet checkpoint
- Gri cicek saksi seklinde, dokunulunca aktif olur (altin cicek + parlama)
- Olunce son aktif checkpoint'ten devam
- Aktif etme +50 puan

### Super Gida Sistemi
- Mor "?" kutulari haritada dagitik (3+level adet)
- Kutularin etrafinda hint: mor isik, donen yildizlar, yesayan ok
- Dokunulunca Super Ari modu aktif olur:
  - Ari turuncu+mor renge donuyor, mor aura beliriyor
  - E veya X tusu ile igne firlatiyor (cooldown: 15 frame)
  - Igne kuslari tek vuruyor (+150 puan)
  - +200 puan kutu acinca
- Can kaybinde super mod sifirlanir, normal ariya doner

### Can Sistemi
- 3 can
- Canlar bitince oyun biter
- Olunce kisa invincibility suresi (120 frame)

## Teknik Detaylar
- Canvas: 960x540
- Tile boyutu: 40px
- Gravity: 0.6
- Oyuncu hizi: max 5px/frame
- Igne hizi: 10px/frame
- gameKeys listesinde tum kontrol tuslari tanimli (preventDefault icin)
- blur event'inde tum tuslar sifirlaniyor (yapisan tus bug fix)
- Mobil dokunmatik kontrol destegi var

## Dil
- Oyun icin Turkce UI (Bal, Seviye, Can, Kayit, Kovan, Super Ari, Igne At)
