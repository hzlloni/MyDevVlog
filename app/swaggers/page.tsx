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
    <div className="min-h-screen bg-white">
      <div id="swagger-ui" />
    </div>
  );
}
