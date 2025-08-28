/**
 * File: src/contexts/ThemeContext.tsx
 *
 * 主题上下文 - 演示Context API全局状态管理
 *
 * 🎯 教学要点:
 * • Context API消除"属性钻取"问题
 * • createContext创建上下文
 * • Provider提供全局状态
 * • useContext消费上下文
 * • 自定义Hook封装上下文逻辑
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// =====================================
// 类型定义
// =====================================

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// =====================================
// Context 创建
// =====================================

// 🐍 Python对比: 类似创建一个全局变量，但更安全
// theme_context = None  # 全局变量，但难以管理
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =====================================
// 工具函数
// =====================================

/**
 * 从localStorage获取保存的主题
 */
function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('theme') as Theme;
    return stored && ['light', 'dark'].includes(stored) ? stored : 'light';
  } catch {
    return 'light';
  }
}

// =====================================
// 自定义 Hook
// =====================================

/**
 * 使用主题的自定义Hook
 *
 * 🎯 教学要点: 自定义Hook封装Context逻辑
 * • 提供更好的开发体验
 * • 集中错误处理
 * • 隐藏Context实现细节
 *
 * @returns ThemeContextType 主题相关的状态和方法
 * @throws Error 如果在ThemeProvider外使用
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      '❌ useTheme必须在ThemeProvider内部使用！\n' +
      '请确保用<ThemeProvider>包装你的应用。\n\n' +
      '正确用法:\n' +
      '<ThemeProvider>\n' +
      '  <YourComponent />\n' +
      '</ThemeProvider>'
    );
  }

  return context;
}

// =====================================
// Provider 组件
// =====================================

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

/**
 * 主题提供者组件
 *
 * 🎯 教学要点: Context Provider模式
 * • Provider组件提供全局状态
 * • 包装应用的根组件
 * • 管理状态和副作用
 * • 向下传递状态给所有子组件
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light'
}: ThemeProviderProps) {
  // 初始化主题状态
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getStoredTheme();
    return stored || defaultTheme;
  });

  // =====================================
  // 主题设置函数
  // =====================================

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);

    // 保存到localStorage
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.warn('保存主题到localStorage失败:', error);
    }
  }, []);

  // 切换主题（在light和dark之间）
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  // =====================================
  // 副作用处理
  // =====================================

  // 应用主题到DOM
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // 移除之前的主题类
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // 添加新的主题类
    root.classList.add(theme);
    body.classList.add(theme);

    // 设置data属性供CSS使用
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }, [theme]);

  // =====================================
  // Context 值
  // =====================================

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  // 🐍 Python对比: 类似返回一个包含所有方法的对象
  // class ThemeManager:
  //     def __init__(self):
  //         self.theme = 'light'
  //     def set_theme(self, theme): ...
  //     def toggle_theme(self): ...

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}