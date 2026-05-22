<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- ✅ SEO META TAGS --}}
    <title inertia>Gorden Rumah Sakit Makassar | Jual Gorden PVC & Perlengkapan Medis - DILJA BERKAH MAKMUR</title>
    <meta name="description" content="Tempat jual gorden rumah sakit bahan PVC berkualitas di Makassar. DILJA BERKAH MAKMUR menyediakan rel gorden, tirai pasien, dan perlengkapan rumah sakit lengkap.">
    <meta name="keywords" content="gorden rumah sakit, gorden rumah sakit makassar, gorden pvc makassar, jual gorden rumah sakit, rel gorden rumah sakit, perlengkapan rumah sakit makassar, tirai pasien, gorden klinik, DILJA BERKAH MAKMUR">
    <meta name="robots" content="index, follow">
    <meta name="author" content="DILJA BERKAH MAKMUR">
    <link rel="canonical" href="https://diljaberkahmakmur.com">

    {{-- ✅ Open Graph / Facebook Preview --}}
    <meta property="og:title" content="Gorden Rumah Sakit Makassar | DILJA BERKAH MAKMUR">
    <meta property="og:description" content="Jual gorden rumah sakit bahan PVC dan perlengkapan medis lengkap di Makassar. Produk berkualitas, higienis, dan terpercaya.">
    <meta property="og:image" content="https://diljaberkahmakmur.com/logo.jpg">
    <meta property="og:url" content="https://diljaberkahmakmur.com">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="id_ID">

    {{-- ✅ Twitter Card --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Gorden Rumah Sakit Makassar | DILJA BERKAH MAKMUR">
    <meta name="twitter:description" content="Jual gorden rumah sakit bahan PVC, tirai pasien, rel, dan perlengkapan medis Makassar.">
    <meta name="twitter:image" content="https://diljaberkahmakmur.com/logo.jpg">

    {{-- Canonical URL --}}
    <link rel="canonical" href="https://diljaberkahmakmur.com">
@verbatim
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "DILJA BERKAH MAKMUR",
  "image": "https://diljaberkahmakmur.com/logo.jpg",
  "description": "Pusat gorden rumah sakit bahan PVC dan perlengkapan medis di Makassar.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Makassar",
    "addressRegion": "Sulawesi Selatan",
    "addressCountry": "ID"
  },
  "url": "https://diljaberkahmakmur.com",
  "telephone": "+62",
  "priceRange": "Rp",
  "openingHours": "Mo-Sa 08:00-17:00"
}
</script>
@endverbatim

    {{-- Theme and Color --}}
    <meta name="theme-color" content="#ffffff">
    <meta name="color-scheme" content="light dark">

   

    {{-- Inline style to set the HTML background color based on theme --}}
    <style>
        html { background-color: oklch(1 0 0); }
        html.dark { background-color: oklch(0.145 0 0); }
    </style>

    {{-- Favicon & Icons --}}
   <link rel="icon" href="/logo.png" type="image/x-icon">
<link rel="shortcut icon" href="/logo.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="/logo1.svg">

    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    {{-- Vite & Inertia --}}
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
