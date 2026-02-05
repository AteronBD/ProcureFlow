# 🚀 ProcureFlow Kurulum Rehberi

Bu rehber, teknik bilgi gerektirmeden ProcureFlow'u nasıl kuracağınızı adım adım anlatır.

---

## 📋 Gereksinimler

Başlamadan önce şunlara ihtiyacınız var:
- Bir bilgisayar (Windows, Mac veya Linux)
- İnternet bağlantısı
- Email adresi

---

## 🔧 Adım 1: Gerekli Hesapları Oluşturun (10 dakika)

### 1.1 GitHub Hesabı
1. https://github.com adresine gidin
2. "Sign up" butonuna tıklayın
3. Email, şifre girin ve hesap oluşturun

### 1.2 Supabase Hesabı (Veritabanı)
1. https://supabase.com adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın
4. "New Project" butonuna tıklayın
5. Proje adı: `procureflow`
6. Şifre belirleyin (BUNU NOT ALIN!)
7. Region: Frankfurt veya en yakın bölge
8. "Create new project" tıklayın

### 1.3 Vercel Hesabı (Hosting)
1. https://vercel.com adresine gidin
2. "Sign Up" butonuna tıklayın
3. "Continue with GitHub" seçin

---

## 🗄️ Adım 2: Veritabanını Kurun (5 dakika)

1. Supabase'de projenizi açın
2. Sol menüden "SQL Editor" seçin
3. "New query" butonuna tıklayın
4. `supabase-schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
5. "Run" butonuna tıklayın
6. Yeşil tik görürseniz başarılı!

---

## 🔑 Adım 3: API Anahtarlarını Alın (2 dakika)

### Supabase Anahtarları:
1. Supabase'de sol menüden "Project Settings" > "API" seçin
2. Şunları not alın:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` ile başlayan uzun kod
   - **service_role key**: Settings > API > service_role (gizli tutun!)

---

## ☁️ Adım 4: Projeyi Yayınlayın (5 dakika)

### 4.1 Kodu GitHub'a Yükleyin
1. GitHub'da "New repository" oluşturun
2. Repository adı: `procureflow`
3. Public veya Private seçin
4. "Create repository" tıklayın

### 4.2 Vercel'de Deploy Edin
1. https://vercel.com/new adresine gidin
2. "Import Git Repository" bölümünden `procureflow` seçin
3. "Environment Variables" bölümüne şunları ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL = (Supabase URL'niz)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (anon key'iniz)
SUPABASE_SERVICE_ROLE_KEY = (service role key'iniz)
NEXT_PUBLIC_APP_URL = https://procureflow.vercel.app
```

4. "Deploy" butonuna tıklayın
5. 2-3 dakika bekleyin
6. Tebrikler! Siteniz hazır! 🎉

---

## ✅ Kurulum Sonrası Kontrol

1. Vercel'in verdiği URL'ye gidin (örn: procureflow.vercel.app)
2. "Ücretsiz Başla" butonuna tıklayın
3. Kayıt olun
4. Dashboard'a erişebildiyseniz her şey çalışıyor!

---

## 🆘 Sorun mu Yaşıyorsunuz?

### "Invalid API key" hatası
- Supabase anahtarlarını kontrol edin
- Vercel'de environment variables'ı doğru girdiğinizden emin olun

### Sayfa açılmıyor
- Vercel deployment'ın tamamlandığından emin olun
- Tarayıcı önbelleğini temizleyin

### Veritabanı hatası
- Supabase SQL Editor'da schema'yı tekrar çalıştırın
- Tüm tabloların oluştuğunu kontrol edin

---

## 📧 Destek

Sorun yaşarsanız benimle iletişime geçebilirsiniz.

---

## 🎯 Sonraki Adımlar

Kurulum tamamlandıktan sonra:
1. İlk tedarikçinizi ekleyin
2. Bir test siparişi oluşturun
3. Uyarı kuralı tanımlayın
4. Sistemi keşfedin!
