import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Teks tidak boleh kosong' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ error: 'API Key Gemini belum dikonfigurasi di server.' }, { status: 500 });
    }

    const prompt = `Anda adalah asisten keuangan AI untuk aplikasi SmartExpense. 
Tugas Anda adalah mengekstrak informasi dari teks berikut dan mengubahnya menjadi format JSON yang valid.
Pengguna mungkin menggunakan bahasa gaul, singkatan, atau format tidak baku.

Aturan ekstraksi:
1. "nominal": (number) Angka yang diucapkan (misal "50k" -> 50000, "50rb" -> 50000). Jika tidak ada, kembalikan 0.
2. "type": (string) 'expense' (pengeluaran) atau 'income' (pemasukan). Default 'expense' jika tidak jelas.
3. "category": (string) Cocokkan dengan kategori ini: 'Food', 'Transport', 'Shopping', 'Bills', 'More'.
4. "name": (string) Nama/keterangan singkat transaksi.
5. "account": (string) 'Cash', 'BCA', 'Mandiri', 'Gopay', 'OVO'. Deteksi dari teks jika ada, jika tidak kosongkan.

Teks Pengguna: "${text}"

OUTPUT HANYA BOLEH JSON MURNI TANPA MARKDOWN ATAU TEKS TAMBAHAN.
Contoh: {"nominal": 50000, "type": "expense", "category": "Food", "name": "Makan siang", "account": "Gopay"}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    let jsonText = response.text || "{}";
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    return NextResponse.json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Gagal menganalisis teks. Coba lagi.' }, { status: 500 });
  }
}
