import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import Script from 'next/script'; // ★ 引入 Script 組件
import './globals.css';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sausage Dog Menu Pal',
  description: 'AI-powered menu translator for travelers',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#ea580c" />
        {/* Phosphor Icons 圖標庫 */}
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
        {/* PWA Icon */}
        <link rel="icon" href="/icon-192.png" /> 
      </head>
      <body className={`${nunito.className} bg-sausage-50 text-sausage-900 antialiased h-screen selection:bg-sausage-200`}>
        
        {/* ★ 改用 Script 直接載入 Crisp (免安裝套件、免新增檔案) */}
        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];window.CRISP_WEBSITE_ID="acc6c5c7-422d-4f8e-bdb6-dd2d837da90e";
              (function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";
              s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
            `,
          }}
        />
        
        <div id="root" className="h-full w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
