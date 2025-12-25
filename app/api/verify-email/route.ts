import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 強制動態執行，避免 API 被快取
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. 初始化環境變數
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    
    // 改用這把秘密鑰匙，它能繞過所有 RLS 限制
    // 請確保在 Zeabur 變數中新增 SUPABASE_SERVICE_ROLE_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // Gumroad Token 獲取
    const gumroadToken = process.env.GUMROAD_ACCESS_TOKEN || 'YemSi_OyvT8DjdGsMmiaFqcARTyxZI68ebkm8S-_wqM';

    // 初始化 Supabase Client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. 接收前端資料
    const body = await request.json();
    let { email, code } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 統一轉小寫並去空白，避免大小寫不一致導致找不到人
    email = email.toLowerCase().trim();
    if (code) code = code.trim().toUpperCase(); // 序號轉大寫

    console.log(`[API] Verifying: ${email} | Code: ${code || 'None'}`);

    // =================================================================
    // 🟢 路徑 A：實體序號驗證 (夜市/現金模式)
    // =================================================================
    if (code) {
      console.log(`[API] Checking Code Mode...`);
      
      // A-1. 檢查序號是否存在且「未被使用」
      const { data: license, error: codeError } = await supabase
        .from('license_codes')
        .select('*')
        .eq('code', code)
        .eq('is_used', false)
        .single();

      if (codeError || !license) {
        return NextResponse.json({ 
          verified: false, 
          message: '序號無效或已被使用 (Invalid or Used Code)' 
        });
      }

      // A-2. 標記為已使用並開通權限
      await supabase
        .from('license_codes')
        .update({ is_used: true, used_by_email: email })
        .eq('id', license.id);

      const { error: upsertError } = await supabase
        .from('users')
        .upsert({ email: email, is_pro: true }, { onConflict: 'email' });

      if (upsertError) {
        console.error('[API] DB Upsert Error:', upsertError);
        return NextResponse.json({ error: 'Activation failed' }, { status: 500 });
      }

      return NextResponse.json({ 
        verified: true, 
        message: 'Code Activated! Welcome Pro User.' 
      });
    }

    // =================================================================
    // 🔵 路徑 B：資料庫優先檢查
    // =================================================================
    const { data: user } = await supabase
      .from('users')
      .select('is_pro')
      .eq('email', email)
      .single();

    if (user && user.is_pro) {
      return NextResponse.json({ 
        verified: true, 
        message: 'Verified from Database' 
      });
    }

    // =================================================================
    // 🟠 路徑 C：Gumroad 補救查帳 (具備防崩潰機制)
    // =================================================================
    if (gumroadToken) {
      console.log(`[API] Checking Gumroad API for: ${email}`);
      try {
        const gumroadRes = await fetch(`https://api.gumroad.com/v2/sales?email=${email}&access_token=${gumroadToken}`);
        
        if (!gumroadRes.ok) {
          const errorText = await gumroadRes.text();
          console.error('[API] Gumroad API Error Response:', errorText);
          throw new Error('Gumroad Token Invalid');
        }

        const gumroadData = await gumroadRes.json();

        if (gumroadData.success && gumroadData.sales && gumroadData.sales.length > 0) {
          console.log('[API] Found purchase on Gumroad! Syncing to DB...');
          
          await supabase
            .from('users')
            .upsert({ email: email, is_pro: true }, { onConflict: 'email' });

          return NextResponse.json({ 
            verified: true, 
            message: 'Pro verified (Synced from Gumroad)' 
          });
        }
      } catch (gErr: any) {
        console.error('Gumroad API Error:', gErr.message);
      }
    }

    // =================================================================
    // 🔴 最後結果
    // =================================================================
    return NextResponse.json({ 
      verified: false, 
      message: 'No active license found.' 
    });

  } catch (err: any) {
    console.error('API Critical Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
