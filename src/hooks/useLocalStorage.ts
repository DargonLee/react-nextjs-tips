/**
 * File: src/hooks/useLocalStorage.ts
 *
 * 自定义Hook：localStorage状态管理
 * 演示如何创建可重用的状态逻辑
 *
 * 🎯 教学要点:
 * • 自定义Hook提取可重用逻辑
 * • SSR/客户端渲染兼容性处理
 * • 错误边界和优雅降级
 * • TypeScript泛型的使用
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * 管理localStorage状态的自定义Hook
 *
 * @param key localStorage键名
 * @param initialValue 默认值
 * @returns [storedValue, setValue] 类似useState的元组
 *
 * 🐍 Python对比: 类似创建一个可重用的状态管理类
 * class LocalStorage:
 *     def __init__(self, key, initial_value):
 *         self.key = key
 *         self.value = self.load() or initial_value
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // 使用函数式初始化避免SSR问题
  const [storedValue, setStoredValue] = useState<T>(() => {
    // 服务端渲染时返回初始值
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`读取localStorage键"${key}"时出错:`, error);
      return initialValue;
    }
  });

  // 优化的setValue函数，支持函数式更新
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // 支持函数式更新模式
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // 更新React状态
      setStoredValue(valueToStore);

      // 同步到localStorage（仅在客户端）
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`保存到localStorage键"${key}"时出错:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}