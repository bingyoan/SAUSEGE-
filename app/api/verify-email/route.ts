import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // =================================================================
    // 🛡️ 這裡幫你修好了：同時支援舊網站 (JSON) 和 Gumroad (FormData)
    // =================================================================
    let body: any = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try { body = await request.json(); } catch (e) {}
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      try { 
        const formData = await request.formData();
        body = Object.fromEntries(formData);
      } catch (e) {}
    } else {
      // 如果沒 Header，嘗試讀純文字 (最後防線)
      try {
        const text = await request.text();
        body = JSON.parse(text);
      } catch {}
    }

    let { email, code, sale_id, product_id } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    email = email.toLowerCase().trim();
    if (code) code = code.trim().toUpperCase();

    // =================================================================
    // 🟢 路徑 A：序號驗證 (已幫你修復重複的語法錯誤)
    // =================================================================
    if (code) {
      const GROUP_CODE = "SNOWFREE"; 

      if (code === GROUP_CODE) {
        console.log(`[API] 群組代碼驗證成功: ${email}`);
        
        // 設定 10 天試用
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 10); 

        await supabase.from('users').upsert({ 
          email: email, 
          is_pro: true, 
          pro_expires_at: expiresAt.toISOString(),
          notes: '群組 10 天試用' // 修正：只保留這一行，移除重複錯誤
        }, { onConflict: 'email' });

        return NextResponse.json({ 
          verified: true, 
          message: `群組試用已開通！有效期限至 ${expiresAt.toLocaleDateString()}` 
        });
      }

      // 一般序號檢查
      const { data: license } = await supabase
        .from('license_codes')
        .select('*').eq('code', code).eq('is_used', false).single();

      if (license) {
        await supabase.from('license_codes').update({ is_used: true, used_by_email: email }).eq('id', license.id);
        await supabase.from('users').upsert({ email: email, is_pro: true }, { onConflict: 'email' });
        return NextResponse.json({ verified: true, message: '序號開通成功' });
      }

      return NextResponse.json({ verified: false, message: '序號無效或已被使用' });
    }

    // =================================================================
    // 🟣 路徑 B：Gumroad Webhook 自動開通
    // =================================================================
    if (sale_id || product_id) {
        console.log(`[API] Gumroad 開通: ${email}`);
        
        const { error } = await supabase.from('users').upsert({ 
            email: email, 
            is_pro: true,
            pro_expires_at: null, 
            notes: `Gumroad Purchase: ${sale_id}`
        }, { onConflict: 'email' });

        if (error) {
            console.error('[API] DB Error:', error);
            // 回傳 200 避免 Gumroad 一直重試
            return NextResponse.json({ verified: false, error: 'DB Error' });
        }
        return NextResponse.json({ verified: true });
    }

    // =================================================================
    // 🔵 路徑 C：檢查用戶狀態 (舊功能)
    // =================================================================
    const { data: user } = await supabase.from('users').select('is_pro, pro_expires_at').eq('email', email).single();
    if (user && user.is_pro) {
       if (user.pro_expires_at && new Date() > new Date(user.pro_expires_at)) {
         return NextResponse.json({ verified: false, message: 'Expired' });
       }
       return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false, message: 'No active license found.' });

  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
