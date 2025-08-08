/**
 * File: src/contexts/ThemeContext.tsx
 * 
 * Enhanced Theme Context Provider - Global theme state management
 * Features: localStorage persistence, system theme detection, type safety
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// =====================================
// 类型定义
// =====================================

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // 实际应用的主题（解析 system 后的结果）
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// =====================================
// Context 创建
// =====================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =====================================
// 工具函数
// =====================================

/**
 * 获取系统偏好主题
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * 从 localStorage 获取保存的主题
 */
function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem('theme') as Theme;
    return stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

/**
 * 解析主题：将 'system' 转换为实际的 'light' 或 'dark'
 */
function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

// =====================================
// 自定义 Hook
// =====================================

/**
 * 使用主题的自定义 Hook
 * @returns ThemeContextType - 主题相关的状态和方法
 * @throws Error - 如果在 ThemeProvider 外使用
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Make sure to wrap your app with <ThemeProvider>.'
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
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme'
}: ThemeProviderProps) {
  // 初始化主题状态
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getStoredTheme();
    return stored || defaultTheme;
  });

  // 计算实际应用的主题
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    return resolveTheme(theme);
  });

  // =====================================
  // 主题设置函数
  // =====================================

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);

    // 保存到 localStorage
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [storageKey]);

  // 切换主题（在 light 和 dark 之间）
  const toggleTheme = useCallback(() => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  }, [actualTheme, setTheme]);

  // =====================================
  // 副作用处理
  // =====================================

  // 监听系统主题变化
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setActualTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // 当主题变化时更新实际主题
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setActualTheme(resolved);
  }, [theme]);

  // 应用主题到 DOM
  useEffect(() => {
    const root = document.documentElement;

    // 移除之前的主题类
    root.classList.remove('light', 'dark');

    // 添加新的主题类
    root.classList.add(actualTheme);

    // 设置 CSS 变量和 data 属性
    root.setAttribute('data-theme', actualTheme);
    root.style.colorScheme = actualTheme;

    // 兼容旧版本：也设置 body 类名
    document.body.className = actualTheme;
  }, [actualTheme]);

  // =====================================
  // Context 值
  // =====================================

  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// =====================================
// 额外的工具 Hook
// =====================================

/**
 * 获取主题相关的 CSS 类名
 */
export function useThemeClasses() {
  const { actualTheme } = useTheme();

  return {
    theme: actualTheme,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
    themeClass: actualTheme,
    // 常用的组合类名
    cardClass: `bg-card text-card-foreground ${actualTheme}`,
    buttonClass: `btn btn-${actualTheme}`,
  };
}

/**
 * 监听主题变化的 Hook
 */
export function useThemeEffect(callback: (theme: 'light' | 'dark') => void) {
  const { actualTheme } = useTheme();

  useEffect(() => {
    callback(actualTheme);
  }, [actualTheme, callback]);
} 