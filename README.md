# ProcureFlow

SaaS tabanlı tedarikçi ve satın alma yönetim platformu.

## Özellikler

- 📦 **Sipariş Takibi**: Tüm satın alma siparişlerinizi tek ekrandan yönetin
- 🏢 **Tedarikçi Yönetimi**: Tedarikçi bilgilerini ve performansını takip edin
- 🔔 **Otomatik Uyarılar**: Teslimat öncesi ve gecikme durumlarında bildirim alın
- 📊 **Performans Analizi**: Tedarikçi skorlarını ve trendleri görüntüleyin

## Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel

## Kurulum

Detaylı kurulum için `KURULUM-REHBERI.md` dosyasına bakın.

### Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Lisans

MIT
