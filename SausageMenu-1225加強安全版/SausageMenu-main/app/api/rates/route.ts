import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 從台灣銀行開放資料獲取匯率 (CSV 格式)
        const response = await fetch('https://rate.bot.com.tw/xrt/flcsv/0/day', {
            next: { revalidate: 3600 } // 快取一小時
        });

        if (!response.ok) throw new Error('Failed to fetch from BoT');

        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        // 簡單解析 CSV (假設格式不變)
        const rates: Record<string, number> = {
            'TWD': 1.0
        };

        // 台灣銀行的 CSV 格式通常包含幣別代碼與匯率
        // 這裡解析「即期賣出」匯率作為基準
        lines.forEach(line => {
            const cols = line.split(',');
            if (cols.length > 13) {
                const currency = cols[0].trim();
                const spotSell = parseFloat(cols[13]); // 通常第 14 欄是即期賣出
                if (!isNaN(spotSell)) {
                    rates[currency] = spotSell;
                }
            }
        });

        return NextResponse.json({ rates, timestamp: Date.now() });
    } catch (err: any) {
        console.error("Rates API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
