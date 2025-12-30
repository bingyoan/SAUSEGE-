import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const rates: Record<string, number> = { 'TWD': 1.0 };
        
        // =========================================================
        // 步驟 1: 先抓全球匯率 (作為基底，包含埃及磅 EGP 等冷門幣種)
        // 使用免費的 Exchangerate-API (無需 Key，每日更新)
        // =========================================================
        try {
            // 抓取以 TWD 為基準的全球匯率
            const globalRes = await fetch('https://open.er-api.com/v6/latest/TWD', { 
                next: { revalidate: 3600 } 
            });
            
            if (globalRes.ok) {
                const globalData = await globalRes.json();
                // globalData.rates 格式是: 1 TWD = x Foreign Currency
                // 我們需要轉成: 1 Foreign Currency = x TWD (所以要用 1 除以它)
                Object.entries(globalData.rates).forEach(([code, rate]) => {
                    const r = Number(rate);
                    if (r > 0) {
                        // 轉換公式： 1 / 匯率
                        rates[code] = 1 / r; 
                    }
                });
                console.log(`[API] 全球匯率載入成功 (含 EGP): ${rates['EGP']}`);
            }
        } catch (e) {
            console.error("Global API Error:", e);
        }

        // =========================================================
        // 步驟 2: 再抓台灣銀行 (覆蓋主要貨幣，確保換匯精準度)
        // =========================================================
        try {
            const botRes = await fetch('https://rate.bot.com.tw/xrt/flcsv/0/day', {
                next: { revalidate: 600 }
            });

            if (botRes.ok) {
                const csvText = await botRes.text();
                const lines = csvText.split('\n');

                lines.forEach(line => {
                    const cols = line.split(',');
                    if (cols.length >= 13) {
                        const currency = cols[0].trim();
                        // 優先抓即期賣出 (Index 12)，沒有則抓現金賣出 (Index 2)
                        let rate = parseFloat(cols[12]);
                        if (isNaN(rate) || rate === 0) rate = parseFloat(cols[2]);

                        // 如果台銀有這個幣別，就「覆蓋」掉剛剛全球 API 的數據
                        // 因為台銀的數據對台灣用戶來說更準 (含銀行價差)
                        if (!isNaN(rate) && rate > 0) {
                            rates[currency] = rate;
                        }
                    }
                });
                console.log(`[API] 台銀匯率覆蓋成功 (USD): ${rates['USD']}`);
            }
        } catch (e) {
            console.error("BoT API Error:", e);
        }

        return NextResponse.json({ rates, timestamp: Date.now() });

    } catch (err: any) {
        console.error("Rates API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
