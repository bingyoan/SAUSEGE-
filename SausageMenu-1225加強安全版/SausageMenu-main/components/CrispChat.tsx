"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    // 你的 Website ID 已經填好了
    Crisp.configure("acc6c5c7-422d-4f8e-bdb6-dd2d837da90e");
  }, []);

  return null;
};

export default CrispChat;
```

5.  拉到最下面，按綠色的 **"Commit changes"**。

---

### 步驟 2：修改 `app/layout.tsx` (把客服掛上去)

只建立檔案是不夠的，你還要在網站的「骨架」裡引用它，客服視窗才會出現。

1.  在 GitHub 找到 **`app/layout.tsx`** 檔案，點擊鉛筆圖示編輯。
2.  **新增 Import** (加在檔案最上面)：
    ```typescript
    import dynamic from 'next/dynamic';

    const CrispChat = dynamic(() => import('@/components/CrispChat'), {
      ssr: false,
    });
    ```
3.  **放入 Body** (加在 `<body>` 裡面)：
    ```tsx
    <body ...>
      <CrispChat />  {/* ★ 加這一行 */}
      <div id="root">
        {children}
      </div>
    </body>
