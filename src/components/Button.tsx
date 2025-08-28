import React from 'react';

/**
 * 可重用的按钮组件 - 演示Props和组件组合模式
 *
 * 🎯 教学要点:
 * • 通过props实现组件的可重用性
 * • TypeScript接口定义组件的API
 * • 默认参数简化组件使用
 * • 条件样式应用
 */

interface ButtonProps {
  /** 按钮样式变体 */
  variant?: 'primary' | 'secondary' | 'destructive';
  /** 按钮内容 */
  children: React.ReactNode;
  /** 点击事件处理器 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset';
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 额外的CSS类名 */
  className?: string;
}

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  type = 'button',
  style,
  className
}: ButtonProps) {
  // 🐍 Python 对比: 类似带默认参数的函数
  // def button(variant='primary', children=None, on_click=None, disabled=False):
  //     return f"<button class='btn btn-{variant}'>{children}</button>"

  return (
    <button
      className={`btn btn-${variant} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;