"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#030712',
        color: '#ffffff',
      }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
          }}>
            <div style={{
              marginBottom: '32px',
            }}>
              <AlertTriangle 
                style={{
                  width: '128px',
                  height: '128px',
                  color: '#ef4444',
                  margin: '0 auto',
                }}
              />
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '16px',
              background: 'linear-gradient(to right, #ef4444, #f97316, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              系统错误
            </h1>

            <p style={{
              fontSize: '18px',
              color: '#9ca3af',
              marginBottom: '32px',
            }}>
              应用程序遇到了严重错误，请刷新页面重试。
            </p>

            <button
              onClick={reset}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              重新加载
            </button>

            {process.env.NODE_ENV === 'development' && error.message && (
              <div style={{
                marginTop: '32px',
                padding: '16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                textAlign: 'left',
              }}>
                <p style={{
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  color: '#f87171',
                  wordBreak: 'break-all',
                }}>
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

