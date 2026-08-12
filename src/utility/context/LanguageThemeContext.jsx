import React, { createContext, useContext, useState, useEffect } from 'react';

export const LanguageThemeContext = createContext(null);

const TRANSLATIONS = {
  id: {
    navWabSystem: 'WAB System',
    navDrhSystem: 'DRH System',
    navBooking: 'List Booking',
    navDaftarTamu: 'Daftar Tamu',
    navFormWAB: 'Form WAB',
    navForeman: 'Workshop Board',
    navRKA: 'RKA Monitoring',
    navTVDisplay: 'TV Display Lounge',
    navSparepart: 'Katalog & Inventory',
    navAccount: 'Profil Pengguna',
    navHistory: 'History',
    selanjutnya: 'Selanjutnya',
    kembali: 'Kembali',
    submit: 'Submit',
    simpan: 'Simpan',
    batal: 'Batal',
    logout: 'Logout',
    profilAkun: 'Profil Akun',
    masukSebagai: 'Masuk sebagai',
    pilihBahasa: 'Bahasa / Language',
    antrianBooking: 'ANTRIAN / BOOKING',
    nomorPolisi: 'NOMOR POLISI',
    modelKendaraan: 'MODEL KENDARAAN',
    tujuanKedatangan: 'TUJUAN KEDATANGAN',
    dataPelangganIdentitas: 'DATA PELANGGAN & IDENTITAS',
    dataKendaraanSdms: 'DATA KENDARAAN & SDMS BOOKING',
    keluhanPermintaan: 'KELUHAN & PERMINTAAN PELANGGAN',
    catatanKerusakan360: 'CATATAN KERUSAKAN & EKSTERIOR BODI 360°',
    hasilInspeksiKomponen: 'HASIL INSPEKSI KOMPONEN & FUNGSI KENDARAAN',
  },

  en: {
    navWabSystem: 'WAB System',
    navDrhSystem: 'DRH System',
    navBooking: 'Booking List',
    navDaftarTamu: 'Guest List',
    navFormWAB: 'WAB Form',
    navForeman: 'Workshop Board',
    navRKA: 'RKA Monitoring',
    navTVDisplay: 'Lounge TV Display',
    navSparepart: 'Catalog & Inventory',
    navAccount: 'User Profile',
    navHistory: 'History',
    selanjutnya: 'Next',
    kembali: 'Back',
    submit: 'Submit',
    simpan: 'Save',
    batal: 'Cancel',
    logout: 'Logout',
    profilAkun: 'Account Profile',
    masukSebagai: 'Logged in as',
    pilihBahasa: 'Language',
    antrianBooking: 'QUEUE / BOOKING',
    nomorPolisi: 'LICENSE PLATE',
    modelKendaraan: 'VEHICLE MODEL',
    tujuanKedatangan: 'ARRIVAL PURPOSE',
    dataPelangganIdentitas: 'CUSTOMER DATA & IDENTITY',
    dataKendaraanSdms: 'VEHICLE & SDMS BOOKING DATA',
    keluhanPermintaan: 'CUSTOMER COMPLAINTS & REQUESTS',
    catatanKerusakan360: '360° EXTERIOR DAMAGE NOTES',
    hasilInspeksiKomponen: 'COMPONENT & FUNCTION INSPECTION RESULTS',
  },

  ja: {
    navWabSystem: 'WABシステム',
    navDrhSystem: 'DRHシステム',
    navBooking: '予約一覧',
    navDaftarTamu: '来客リスト',
    navFormWAB: 'WABフォーム',
    navForeman: '工場ダッシュボード',
    navRKA: 'RKAモニタリング',
    navTVDisplay: 'ラウンジTV表示',
    navSparepart: '部品カタログ・在庫',
    navAccount: 'ユーザー設定',
    navHistory: '履歴',
    selanjutnya: '次へ',
    kembali: '戻る',
    submit: '送信',
    simpan: '保存',
    batal: 'キャンセル',
    logout: 'ログアウト',
    profilAkun: 'アカウント設定',
    masukSebagai: 'ログイン中:',
    pilihBahasa: '言語設定',
    antrianBooking: '受付・予約番号',
    nomorPolisi: '車両ナンバー',
    modelKendaraan: '車種モデル',
    tujuanKedatangan: '来店目的',
    dataPelangganIdentitas: 'お客様情報・身分証',
    dataKendaraanSdms: '車両・SDMS予約データ',
    keluhanPermintaan: 'ご要望・ご指摘事項',
    catatanKerusakan360: '360°外装ダメージ点検メモ',
    hasilInspeksiKomponen: '車両機能・部品点検結果',
  },
};

export function LanguageThemeProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('wab_language') || 'id');

  useEffect(() => {
    localStorage.setItem('wab_language', language);
  }, [language]);

  const changeLanguage = (lang) => {
    if (TRANSLATIONS[lang]) setLanguage(lang);
  };

  const cycleLanguage = () => {
    const order = ['id', 'en', 'ja'];
    const next = (order.indexOf(language) + 1) % order.length;
    setLanguage(order[next]);
  };

  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.id;
    return dict[key] || TRANSLATIONS.id[key] || key;
  };

  return (
    <LanguageThemeContext.Provider value={{ language, changeLanguage, cycleLanguage, t }}>
      {children}
    </LanguageThemeContext.Provider>
  );
}

export function useLanguageTheme() {
  const context = useContext(LanguageThemeContext);
  if (!context) throw new Error('useLanguageTheme must be used within LanguageThemeProvider');
  return context;
}
