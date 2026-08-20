"use client";

import React, { useEffect } from "react";

export default function SwaggerDocsPage() {
  useEffect(() => {
    // Dynamically load Swagger UI CSS and JS from CDN
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js";
    script.async = true;
    script.onload = () => {
      // Initialize Swagger UI pointing to our local openapi.json route
      (window as any).SwaggerUIBundle({
        url: "/api/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          (window as any).SwaggerUIBundle.presets.apis,
          (window as any).SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">API Interactive Swagger Docs</h1>
            <p className="text-xs text-zinc-500 mt-1">블로그의 REST API 엔드포인트를 명세하고 실시간으로 테스트할 수 있는 대시보드입니다.</p>
          </div>
          <a
            href="/"
            className="mt-4 md:mt-0 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
          >
            ← 메인 홈으로 가기
          </a>
        </div>
        
        {/* Swagger UI Container */}
        <div className="bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 p-2">
          <div id="swagger-ui" />
        </div>
      </div>
    </div>
  );
}
