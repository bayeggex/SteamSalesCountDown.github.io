document.addEventListener('DOMContentLoaded', function() {
    const indirimler = [
        { baslangic: '2024-01-01T12:00:00Z', bitis: '2024-01-15T23:59:59Z', bilgi: 'Yaz İndirimi: %30 İndirim!' },
        { baslangic: '2024-02-01T12:00:00Z', bitis: '2024-02-15T23:59:59Z', bilgi: 'Kişi İndirimi: Ekstra %10 İndirim!' },
    ];

    const simdikiIndirim = indirimler.find(indirim => new Date(indirim.baslangic).getTime() > new Date().getTime());

    if (simdikiIndirim) {
        const indirimTarihi = new Date(simdikiIndirim.baslangic).getTime();
        const bitisTarihi = new Date(simdikiIndirim.bitis).getTime();

        const interval = setInterval(function() {
            const simdikiZaman = new Date().getTime();
            const kalanSure = indirimTarihi - simdikiZaman;

            const gun = Math.floor(kalanSure / (1000 * 60 * 60 * 24));
            const saat = Math.floor((kalanSure % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const dakika = Math.floor((kalanSure % (1000 * 60 * 60)) / (1000 * 60));
            const saniye = Math.floor((kalanSure % (1000 * 60)) / 1000);

            document.getElementById('timer').innerHTML = `${gun} gün ${saat} saat ${dakika} dakika ${saniye} saniye`;
            document.getElementById('indirimBilgisi').innerHTML = `${simdikiIndirim.bilgi} - Bitiş Tarihi: ${simdikiIndirim.bitis}`;

            if (kalanSure < 0) {
                clearInterval(interval);
                document.getElementById('timer').innerHTML = 'İndirim Başladı!';
            }
        }, 1000);
    } else {
        document.getElementById('timer').innerHTML = 'Şu anda bir indirim yok.';
    }
});

