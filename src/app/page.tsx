import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1>🚀 React 精通教程</h1>
            <p className="header-subtitle">
              掌握覆盖 95% 使用场景的 8 个核心 React 模式
            </p>
          </div>
        </div>
      </header>

      <main>
        <Dashboard />
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            专为教授 React 基础知识而构建，帮助开发者掌握核心概念，不再被 AI 工具困扰
          </p>
        </div>
      </footer>
    </div>
  );
}
