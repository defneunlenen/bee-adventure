# Ari Macerasi - Bee Adventure

Super Mario tarzi bir HTML5 platformer oyun. Sevimli bir ari karakteri kontrol ederek kuslari alt et, bal topla ve kovana ulas!

## Oyna

`bee-adventure.html` dosyasini tarayicida ac. Kurulum gerektirmez.

## Kontroller

| Tus | Aksiyon |
|-----|---------|
| Ok tuslari / WASD | Hareket |
| Space / Yukari ok | Ziplama |
| E / X | Igne firlat (Super mod) |

Mobil cihazlarda dokunmatik kontrol destegi vardir (sol/sag/ust alanlara dokunma).

## Oyun Mekanikleri

### Karakter
Kanat cirpan, cizgili, antenli bir ari. Kuslarin ustune ziplayarak onlari yok edebilir.

### Dusmanlar
- **Kirmizi kuslar** - Havada ucarlar
- **Mor kuslar** - Yerde yururler

### Toplanabilirler
- **Bal damlalari** - +10 puan
- **Super gida kutulari** - Mor "?" kutulari. Igne atma gucu verir

### Super Ari Modu
Mor kutulari bulup actiginda ari guclenir:
- Turuncu + mor renge donusur
- E veya X tusu ile igne firlatar
- Igneler kuslari tek vuruyor (+150 puan)
- Can kaybedince normal ariya donersin

### Checkpoint Sistemi
Haritadaki cicek saksi noktalarindan gecince kayit noktasi aktif olur. Olunce son checkpoint'ten devam edersin.

### Seviyeler
3 seviye, her biri bir oncekinden daha zor. Tum seviyeleri tamamlayarak kovana ulas!

## Dosya Yapisi

```
├── bee-adventure.html   # HTML + CSS
└── js/
    ├── config.js        # Sabitler ve global state
    ├── input.js         # Klavye/touch input
    ├── renderer.js      # Cizim fonksiyonlari
    ├── player.js        # Oyuncu fizigi
    ├── level.js         # Seviye uretimi
    ├── enemies.js       # Dusman ve obje guncellemeleri
    ├── ui.js            # Menu arayuzu
    └── game.js          # Oyun dongusu ve baslangic
```

## Ekran Goruntusu

Oyun icinde gorecekleriniz:
- Acik mavi gokyuzu ve parlak gunes
- Renkli cicekler ve sallanan otlar
- Ucan kelebekler ve suzen polen tanecikleri
- Bulutlar ve yesil platformlar
