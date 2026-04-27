# Defnenin Ari Macerasi

## Proje Ozeti
Super Mario tarzi HTML5 platformer oyun. Cocuklara yonelik, renkli ve eglenceli.

## Dosya Yapisi
```
game1/
├── bee-adventure.html      # HTML + CSS + script yukleme
├── CLAUDE.md
└── js/
    ├── config.js           # Sabitler, canvas, global state, player objesi, skin tanimlari, localStorage yukleme
    ├── sound.js            # Web Audio API ses sistemi (efektler + arka plan muzigi)
    ├── input.js            # Klavye/touch input, M (ses), N (skin degistir), seviye secimi
    ├── achievements.js     # Basarim sistemi (7 basarim, localStorage)
    ├── renderer.js         # Tum draw fonksiyonlari (sky, cloud, flower, butterfly, ground, bee, bird, wasp, coin, flag, checkpoint, superbox, stinger, HUD, particles, moving platform, trampoline, water zone, boss, secret area, power-up, achievement notifications)
    ├── player.js           # updatePlayer (fizik, collision, kamera, su, cift ziplama, miknatis), playerDie
    ├── level.js            # generateLevel (zemin, platformlar, coinler, dusmanlar, bulutlar, cicekler, kelebekler, checkpointler, super kutular, hareketli platformlar, trambolinler, su bolgeleri, gizli bolgeler, guc-uplar, boss)
    ├── enemies.js          # updateEnemies, updateCoins, updateCheckpoints, updateSuperBoxes, updateStingers, updateEnemyStingers, updateMovingPlatforms, updateBoss, updatePowerUps, updateSecretAreas, checkWin, rectCollide, aliveCollide, updateClouds, updateButterflies
    ├── ui.js               # showOverlay, startGame, saveHighScore, getHighScoreText, getSkinInfoText
    └── game.js             # gameLoop (tum update/draw cagrilari), canvas menu ekrani, seviye secimi, setupTouchControls
```

Script yukleme sirasi (bagimlilik sirasiyla): config -> sound -> input -> achievements -> renderer -> player -> level -> enemies -> ui -> game

## Oyun Temasi
- Karakter: Ari (bee) - 4 farkli skin secenegi
- Dusmanlar: Kirmizi ucan kuslar + mor yuryen kuslar + esek arilari (igne atan) + seviye sonu bosslari
- Arka plan: Acik mavi gokyuzu, bulutlar, gunes, renkli cicekler, kelebekler, polen tanecikleri
- Toplanabilir: Bal damlalari (+10 puan)

## Oyun Mekanikleri

### Hareket
- Ok tuslari / WASD: Hareket
- Space / Yukari ok: Ziplama
- E / X: Igne at (Super mod)
- M: Ses ac/kapa
- N: Skin degistir (menude)
- Ziplama kuvveti: -14.4
- Dusman ustune sekme: -9.6

### Seviyeler
- 3 seviye, her biri WORLD_WIDTH=200 tile genisliginde
- Her seviyede artan zorluk: daha fazla dusman, daha genis ucurumlar
- Seviye sonu: Boss yenilmeli + "KOVAN" bayragi
- Seviye ilerleme localStorage'da kaydedilir
- Menuden istenen seviye secilebilir (acik olanlar)

### Seviye Secimi
- Menude 3 seviye gosterilir: Kolay, Orta, Zor
- Ok tuslari veya 1/2/3 ile seviye sec
- Kilitli seviyeler gri, acik olanlar secilir
- localStorage'da unlockedLevel kaydedilir

### Karakter Skin Sistemi
- 4 skin (hepsi acik): Normal Ari, Kiz Ari (fiyonk+kirpik), Super Ari (pelerin+maske+yildiz), Komik Ari (kocaman gozler+dil)
- N tusu ile menude degistir
- Secim localStorage'da hatirlanir
- Her skin farkli renk paleti ve ozel gorsel detaylar

### Checkpoint (Save Point) Sistemi
- Her seviyede 3+level adet checkpoint
- Gri cicek saksi seklinde, dokunulunca aktif olur (altin cicek + parlama)
- Olunce son aktif checkpoint'ten devam
- Checkpointler zemin kontrolu ile yerlestirilir (ucurum ustune denk gelmez)
- Aktif etme +50 puan

### Super Gida Sistemi
- Mor "?" kutulari haritada dagitik (3+level adet)
- Boss alaninda garanti super kutu (olunce sifirlanir)
- Dokunulunca Super Ari modu aktif olur:
  - Ari turuncu+mor renge donuyor, mor aura beliriyor
  - E veya X tusu ile igne firlatiyor (cooldown: 15 frame)
  - Igne kuslari tek vuruyor (+150 puan)
  - +200 puan kutu acinca
- Boss savasinda olunce super mod korunur

### Dusmanlar
- **Ucan kuslar**: Sinusoidal hareketle ucuyor, belirli x araliginda patrol
- **Yuruyen kuslar**: Platformda yuruyor, kenardan donuyor, fizik uygulanir
- **Esek arilari**: Ucan, 10 sn arayla oyuncuya igne atan, oldurulebilir (stomp veya igne)
- **Boss (her seviye sonunda)**:
  - Seviye 1: Buyuk Kus (hp:5) - dalma saldirisi
  - Seviye 2: Dev Esek Arisi (hp:8) - 3'lu igne yagmuru
  - Seviye 3: Kral Kus (hp:12) - dalma + igne + minion cagirma
  - Boss ustune ziplayarak veya igne atarak vurulur
  - Boss baseY etrafinda kalir (dalistan sonra geri cekilir)
  - Boss alani: garanti super kutu + 3 trambolin + checkpoint

### Hareketli Platformlar
- Yatay (x) veya dikey (y) sinusoidal hareket
- Oyuncu ustundeyken tasir
- Acik mavi renk, ok gostergesi

### Trambolinler
- Mantar seklinde, ustune basinca vy=-20 ile firlatiyor
- Boss alaninda 3 adet garanti trambolin
- Animasyonlu sikisma efekti

### Su Bolgeleri
- Yavas dusme (gravity * 0.3), yavas hareket (speed * 0.6)
- Sinirsiz yuzme ziplamalari (vy=-6)
- Mavi yarim saydam + dalga animasyonu + kabarciklar

### Cift Ziplama
- doubleJump guc-up'i ile kazanilir
- Havadayken 1 kez daha Space (vy=-12)
- Yere inince reset

### Guc-Uplar (Power-ups)
- **Kalkan** (mavi): 1 vurustan korur
- **Miknatis** (kirmizi): 150px icindeki ballari ceker (15 sn)
- **Hiz** (yesil): 1.5x hiz (10 sn)
- **Cift Ziplama**: Havada ekstra ziplama

### Gizli Bolgeler
- Belirli pozisyonlarda tetikleyici alan
- Kesif: +500 puan + bonus bal damlalari
- Mor parlama efekti

### Boss Savasi
- Her seviye sonunda boss yenilmeden bayrak gecilmez
- Boss HP bari ekranda gosterilir
- Boss alani: checkpoint + super kutu + trambolinler

### Can Sistemi
- 3 can
- Canlar bitince oyun biter, ana menuye don
- Olunce kisa invincibility suresi (120 frame)

### Basarim Sistemi
- 7 basarim: Ilk Bal, Bal Avcisi (100), Ezici, Super Ari, Boss Avcisi, Gizli Kasif, Yenilmez
- Basarim acilinca ekranda bildirim (slide-in)
- localStorage'da kaydedilir

### Skor Tablosu
- En yuksek 5 skor localStorage'da kaydedilir
- Oyun sonu ve menude gosterilir

### Ses Sistemi
- Web Audio API ile programatik ses uretimi (harici dosya yok)
- Efektler: ziplama, cift ziplama, bal toplama, stomp, olum, checkpoint, super kutu, igne, boss vurusu, boss olumu, trampolin, guc-up, gizli bolge, basarim, kazanma
- Arka plan melodisi (arpej loop)
- M tusu ile ac/kapa

## Teknik Detaylar
- Canvas: 960x540
- Tile boyutu: 40px
- Gravity: 0.6
- Oyuncu hizi: max 5px/frame (hiz bonusu ile 7.5)
- Igne hizi: 10px/frame
- Dusman ignesi hizi: 3px/frame
- Platformlar arasi minimum 2 tile dikey bosluk
- gameKeys listesinde tum kontrol tuslari tanimli (preventDefault icin)
- blur event'inde tum tuslar sifirlaniyor (yapisan tus bug fix)
- Mobil dokunmatik kontrol destegi var
- localStorage kullanimi: highScores, selectedSkin, unlockedLevel, achievements

## Dil
- Oyun ici Turkce UI (Bal, Seviye, Can, Kayit, Kovan, Super Ari, Igne At, Kolay, Orta, Zor, Kilitli, Ana Menu)
