# 🚀 Portfolio Yayına Hazırlama Rehberi

Bu projeyi internete taşıyıp herkesin görebileceği bir hale getirmek çok basit. İşte hiç kod bilmeyen biri için adım adım rehber:

---

## 1. Hazırlık (Gereksinimler)
*   **GitHub Hesabı:** Kodlarımızı saklayacağımız yer. [GitHub](https://github.com/) üzerinden ücretsiz hesap açın.
*   **Vercel Hesabı:** Sitemizi dünyaya yayınlayacak platform. [Vercel](https://vercel.com/) üzerinden GitHub hesabınızla giriş yapın.

## 2. Kodları GitHub'a Yükleyin
Eğer kodlar henüz GitHub'da değilse:
1.  GitHub üzerinde yeni bir **Private (Gizli)** repo oluşturun.
2.  Bilgisayarınızdaki proje klasöründe terminali açın ve şu komutları sırasıyla yazın:
    ```bash
    git init
    git add .
    git commit -m "ilk yayin"
    git branch -M main
    git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
    git push -u origin main
    ```

## 3. Vercel ile Yayına Alın
1.  **Vercel Dashboard**'a gidin.
2.  **"Add New"** -> **"Project"** butonuna basın.
3.  GitHub deponuzu (repository) seçin ve **"Import"** deyin.
4.  **Environment Variables (Ortam Değişkenleri)** kısmına gelip şu bilgiyi ekleyin (Güvenlik için):
    *   **Key:** `NEXT_PUBLIC_ADMIN_SECRET`
    *   **Value:** `sizin_belirleyeceginiz_guclu_bir_sifre` (Örn: `Sukrucan123!`)
5.  **"Deploy"** butonuna basın. 

🎉 **Tebrikler!** Birkaç dakika içinde Vercel size bir internet adresi (`projeniz.vercel.app`) verecek.

---

## ⚠️ Önemli Not (Düzenleme Modu Hakkında)

Bu proje verileri bir dosyada (`src/data/content.json`) tutar. 
*   **Lokalde:** Sitedeki kalem (pencil) ikonuna tıklayıp yaptığınız değişiklikler bilgisayarınızdaki dosyaya kaydedilir.
*   **Yayında (Vercel):** Vercel "read-only" (sadece okunabilir) bir yapıdadır. Yani yayındaki sitede yaptığınız değişiklikler **kalıcı olmaz**. 

**En İyi Yöntem:**
1.  Değişikliklerinizi kendi bilgisayarınızda (`npm run dev` açıkken) yapın.
2.  Kaydettikten sonra projeyi GitHub'a tekrar gönderin (`git add .`, `git commit`, `git push`).
3.  Vercel sitenizi otomatik olarak güncelleyecektir.

---

## Sorun Çıkarsa?
*   Hata alırsanız Vercel'deki **"Logs"** kısmına bakın veya bana sorun!
