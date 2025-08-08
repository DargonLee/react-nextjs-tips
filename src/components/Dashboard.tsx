/**
 * 文件: src/components/Dashboard.tsx
 * 
 * 渐进式 React 教程 - 个人仪表板
 * 在教授每个模式时取消注释相应部分！
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from './Button';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import UseEffectShowcase from '@/components/UseEffectShowcase';
import UseCallbackShowcase from '@/components/UseCallbackShowcase';

// =====================================
// 模式 1.5: 更新嵌套状态结构
// =====================================

/*
🎯 核心要点:
• React 状态更新必须是不可变的（创建新对象/数组，不要修改现有的）
• 对于嵌套对象和数组，需要在每个嵌套级别创建副本
• 展开运算符 (...) 只创建浅拷贝 - 嵌套结构需要特殊处理
• 始终返回新引用以便 React 检测变化并触发重新渲染
• Immer 或其他不可变性库可以简化复杂的状态更新
*/

function NestedStateManager() {
  // 包含对象和数组的复杂嵌套状态结构
  const [userData, setUserData] = useState({
    personalInfo: {
      name: "Alex Chen",
      email: "alex@example.com",
      preferences: {
        theme: "light",
        notifications: true
      }
    },
    posts: [
      { id: 1, title: "React Basics", likes: 10, tags: ["react", "beginner"] },
      { id: 2, title: "Advanced Hooks", likes: 15, tags: ["react", "hooks", "advanced"] },
      { id: 3, title: "State Management", likes: 8, tags: ["react", "state"] }
    ],
    stats: {
      totalLikes: 33,
      followers: 120,
      following: 50
    }
  });

  // ❌ 错误: 直接修改嵌套状态
  // const updateEmailBad = () => {
  //   userData.personalInfo.email = "alex.updated@example.com"; // 修改原始对象！
  //   setUserData(userData); // 相同引用，React 不会检测到变化！
  //   console.log("邮箱已更新（但 UI 不会更新！）");
  // };

  // ❌ 错误: 只浅拷贝第一层
  // const updateEmailIncomplete = () => {
  //   const newUserData = { ...userData }; // 只是浅拷贝！
  //   newUserData.personalInfo.email = "alex.updated@example.com"; // 仍然修改嵌套对象！
  //   setUserData(newUserData);
  // };

  // ✅ 正确: 正确更新嵌套对象属性
  const updateEmail = () => {
    setUserData({
      ...userData, // 拷贝顶层
      personalInfo: {
        ...userData.personalInfo, // 拷贝 personalInfo 层
        email: "alex.updated@example.com", // 更新特定字段
        preferences: {
          ...userData.personalInfo.preferences,
          theme: "dark" // 更新嵌套字段
        }
      }
    });
  };

  // ✅ 正确: 更新深度嵌套的对象属性
  const toggleNotifications = () => {
    setUserData({
      ...userData,
      personalInfo: {
        ...userData.personalInfo,
        preferences: {
          ...userData.personalInfo.preferences,
          notifications: !userData.personalInfo.preferences.notifications
        }
      }
    });
  };

  // ✅ 正确: 通过映射更新数组中的项目
  const incrementLikes = (postId: number) => {
    setUserData({
      ...userData,
      posts: userData.posts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 } // 为匹配的帖子创建新对象
          : post // 保持其他帖子不变
      ),
      stats: {
        ...userData.stats,
        totalLikes: userData.stats.totalLikes + 1
      }
    });
  };

  // ✅ 正确: 向数组添加项目
  const addPost = () => {
    const newPost = {
      id: userData.posts.length + 1,
      title: `新帖子 ${userData.posts.length + 1}`,
      likes: 0,
      tags: ["react", "new"]
    };

    setUserData({
      ...userData,
      posts: [...userData.posts, newPost] // 创建包含新项目的新数组
    });
  };

  // ✅ 正确: 从数组中移除项目
  const removePost = (postId: number) => {
    const removedPost = userData.posts.find(post => post.id === postId);
    const removedLikes = removedPost ? removedPost.likes : 0;

    setUserData({
      ...userData,
      posts: userData.posts.filter(post => post.id !== postId), // 创建新的过滤数组
      stats: {
        ...userData.stats,
        totalLikes: userData.stats.totalLikes - removedLikes
      }
    });
  };

  // ✅ 正确: 向嵌套数组添加标签
  const addTagToPost = (postId: number, newTag: string) => {
    setUserData({
      ...userData,
      posts: userData.posts.map(post =>
        post.id === postId
          ? {
            ...post,
            tags: [...post.tags, newTag] // 创建新的标签数组
          }
          : post
      )
    });
  };

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🔄</span>
        Nested State Updates
        <span className="pattern-badge">useState</span>
      </h3>

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>
          个人信息
        </h4>
        <div className="p-3 rounded" style={{ background: 'var(--muted)' }}>
          <div><strong>姓名:</strong> {userData.personalInfo.name}</div>
          <div><strong>邮箱:</strong> {userData.personalInfo.email}</div>
          <div>
            <strong>通知:</strong> {userData.personalInfo.preferences.notifications ? '开启' : '关闭'}
          </div>
          <div><strong>主题:</strong> {userData.personalInfo.preferences.theme}</div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button onClick={updateEmail} variant="secondary">
            更新邮箱
          </Button>
          <Button onClick={toggleNotifications} variant="secondary">
            切换通知
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
            帖子
          </h4>
          <Button onClick={addPost} variant="primary" style={{ fontSize: '12px', padding: '4px 8px' }}>
            添加帖子
          </Button>
        </div>

        <div className="space-y-3">
          {userData.posts.map(post => (
            <div
              key={post.id}
              className="p-3 rounded"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{post.title}</div>
                <Button
                  onClick={() => removePost(post.id)}
                  variant="destructive"
                  style={{ fontSize: '11px', padding: '2px 6px' }}
                >
                  删除
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span>{post.likes}</span>
                  <Button
                    onClick={() => incrementLikes(post.id)}
                    variant="secondary"
                    style={{ fontSize: '11px', padding: '2px 6px' }}
                  >
                    👍 点赞
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: 'var(--accent)',
                        color: 'var(--accent-foreground)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  <Button
                    onClick={() => addTagToPost(post.id, `tag-${Math.floor(Math.random() * 100)}`)}
                    variant="secondary"
                    style={{ fontSize: '11px', padding: '2px 6px' }}
                  >
                    + 标签
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>
          用户统计
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded" style={{ background: 'var(--muted)' }}>
            <div className="font-bold">{userData.stats.totalLikes}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>总点赞数</div>
          </div>
          <div className="p-2 rounded" style={{ background: 'var(--muted)' }}>
            <div className="font-bold">{userData.stats.followers}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>关注者</div>
          </div>
          <div className="p-2 rounded" style={{ background: 'var(--muted)' }}>
            <div className="font-bold">{userData.stats.following}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>关注中</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded text-sm" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
        <p className="font-medium mb-2" style={{ color: 'var(--primary)' }}>
          💡 React 状态不可变性规则:
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--foreground)' }}>
          <li>永远不要直接修改状态对象</li>
          <li>在每个嵌套级别创建新副本</li>
          <li>使用展开运算符 (...) 进行浅拷贝</li>
          <li>使用 map/filter 进行数组更新</li>
          <li>考虑使用 immer 处理复杂的嵌套更新</li>
        </ul>
      </div>
    </div>
  );
}


// =====================================
// 模式 1: useState - 状态管理
// =====================================

/*
🎯 核心要点:
• useState 在状态变化时触发自动 UI 重新渲染
• 普通变量在内部变化但不会更新 UI
• useState 是 React 连接数据与视觉界面的方式
• 始终使用 setState 函数，永远不要直接修改状态
*/

function Counter() {
  // 🐍 Python 等价: 在 __init__ 中 self.count = 0
  // 但 Python 需要手动 UI 更新，React 自动更新！

  // ❌ 错误: 变量不会触发重新渲染
  // let count = 0;
  // const increment = () => {
  //   count += 1;  // 变化了但 UI 不会更新！
  //   console.log('计数变为:', count); // 只在控制台显示
  // };
  // const decrement = () => {
  //   count -= 1;  // 变化了但 UI 不会更新！
  //   console.log('计数变为:', count);
  // };
  // const reset = () => {
  //   count = 0;  // 变化了但 UI 不会更新！
  //   console.log('计数重置为:', count);
  // };

  // ✅ 正确: useState 触发自动重新渲染
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🔢</span>
        计数器组件
        <span className="pattern-badge">useState</span>
      </h3>
      <div className="text-center mb-4">
        <div className="text-3xl font-bold my-4">
          {count}
        </div>
        <p className="text-sm mb-0" style={{ color: 'var(--muted-foreground)' }}>
          点击按钮查看自动重新渲染
        </p>
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={decrement} className="btn btn-secondary">-</button>
        <button onClick={reset} className="btn btn-secondary">重置</button>
        <button onClick={increment} className="btn btn-primary">+</button>
      </div>
    </div>
  );
}

// =====================================
// 模式 2: useEffect - 副作用
// =====================================

/*
🎯 核心要点:
• useEffect 处理副作用（定时器、API 调用、订阅）
• 永远不要在渲染函数中直接运行副作用 - 会导致无限循环
• 始终清理副作用以防止内存泄漏
• 空依赖数组 [] 意味着"在挂载时运行一次"
• useEffect 清理函数在组件卸载时运行
*/

function Clock() {
  const [time, setTime] = useState<Date | null>(null);
  const [showBadExample, setShowBadExample] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // // // 跟踪渲染次数用于演示
  // useEffect(() => {
  //   setRenderCount(prev => prev + 1);
  // });

  // // ❌ 错误: 在渲染函数中的副作用（当演示激活时）
  // if (showBadExample) {
  //   console.log(`🔥 渲染 #${renderCount}: 创建新定时器...`);
  //   setTimeout(() => {
  //     setTime(new Date()); // 这会触发另一次渲染！
  //   }, 1000);
  // }

  // ✅ 正确: useEffect 正确处理副作用
  useEffect(() => {
    // 通过仅在客户端挂载后设置时间来修复水合不匹配
    setTime(new Date());

    // 🐍 Python: 类似上下文管理器中的 __enter__
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 🐍 Python: 类似上下文管理器中的 __exit__
    return () => clearInterval(timer); // 清理防止内存泄漏
  }, [showBadExample]); // 当演示模式改变时重新运行

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">⏰</span>
        实时时钟
        <span className="pattern-badge">useEffect</span>
      </h3>

      {/* 演示切换 */}
      <div className="mb-4 text-center">
        <button
          onClick={() => setShowBadExample(!showBadExample)}
          className={`btn ${showBadExample ? 'btn-destructive' : 'btn-secondary'}`}
        >
          {showBadExample ? '🛑 停止错误演示' : '🔥 显示错误示例'}
        </button>
      </div>

      {/* 视觉反馈 */}
      {showBadExample && (
        <div className="rounded mb-4 text-center p-2" style={{
          background: 'rgba(255, 68, 68, 0.1)'
        }}>
          <div className="text-sm font-bold" style={{ color: '#ff4444' }}>
            ⚠️ 渲染次数: {renderCount} | 查看控制台！
          </div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            每次渲染都创建新定时器
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="text-2xl font-bold my-4">
          {time ? time.toLocaleTimeString() : '--:--:-- --'}
        </div>
        <p className="text-sm mb-0" style={{ color: 'var(--muted-foreground)' }}>
          {showBadExample
            ? '🚨 在渲染中使用 setTimeout（造成内存泄漏！）'
            : '每秒更新并自动清理'
          }
        </p>
      </div>
    </div>
  );
}

// =====================================
// 模式 3: Props 和组件组合
// =====================================

/*
🎯 核心要点:
• Props 使组件可重用而不是硬编码
• 一个灵活的组件比多个僵化的组件更好
• TypeScript 接口定义组件期望的 props
• 默认参数使组件使用更方便
• 组件组合允许从简单部分构建复杂 UI
*/

// ❌ 错误: 硬编码，不可重用
// function SubmitButton() {
//   return <button className="btn btn-primary">提交</button>;
// }
// function CancelButton() {
//   return <button className="btn btn-secondary">取消</button>;
// }

// ✅ 正确: 带有 props 的可重用组件（现在从单独文件导入）

function ButtonShowcase() {
  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🎨</span>
        按钮变体
        <span className="pattern-badge">Props</span>
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        一个组件，通过 props 实现多种样式
      </p>
      <div className="flex flex-row gap-3 justify-center">
        <Button variant="primary" onClick={() => alert('主要按钮!')}>
          主要按钮
        </Button>
        <Button variant="secondary" onClick={() => alert('次要按钮!')}>
          次要按钮
        </Button>
        <Button variant="destructive" onClick={() => alert('危险按钮!')}>
          危险按钮
        </Button>
        <Button disabled onClick={() => alert('永远不会触发')}>
          禁用按钮
        </Button>
        <Button variant='primary' onClick={() => alert('Sean 很棒!')}>
          Sean 按钮
        </Button>
      </div>
    </div>
  );
}

// =====================================
// 模式 4: 条件渲染 - 加载状态、错误状态、功能标志
// =====================================

/*
🎯 核心要点:
• 根据状态显示不同的 UI（加载中、错误、成功）
• 使用逻辑运算符 (&&) 进行简单的显示/隐藏条件
• 链式条件正确处理多个状态
• 永远不要同时显示所有状态 - 会让用户困惑
• 加载状态改善异步操作期间的用户体验
*/

interface User {
  name: string;
  email: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const fetchUser = () => {
    setLoading(true);
    setError(null);
    setUser(null);
    setRandomNumber(null);

    // 模拟 API 调用
    setTimeout(() => {
      const random = Math.random();
      // 将随机数存储在状态中以在 UI 中显示
      setRandomNumber(random);
      console.log('随机数: ', random);

      if (random > 0.7) {
        setError('加载用户数据失败');
      } else {
        setUser({ name: '张三', email: 'zhangsan@example.com' });
      }
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ❌ 错误: 同时显示所有内容 - 让用户困惑！
  // return (
  //   <div className="widget">
  //     <h3>用户资料</h3>
  //     <div>加载中...</div>
  //     <div>错误: 出了点问题</div>
  //     <div>欢迎，张三！</div>
  //     <div>请登录</div>
  //   </div>
  // );

  // ✅ 正确: 显示适当的状态
  // 🐍 Python: 类似 if/elif/else 语句
  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">👤</span>
        用户资料
        <span className="pattern-badge">条件渲染</span>
      </h3>

      {loading && (
        <div className="text-center p-8">
          <div className="status-loading">加载用户数据中...</div>
        </div>
      )}

      {error && (
        <div className="text-center p-8">
          <div className="status-error">❌ {error}</div>
          {randomNumber !== null && (
            <div className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              随机数: <strong>{randomNumber.toFixed(3)}</strong>
              <span style={{ color: '#ff4444' }}> (&gt; 0.7 = 错误)</span>
            </div>
          )}
          <Button onClick={fetchUser} variant="secondary" className="mt-4">
            重试
          </Button>
        </div>
      )}

      {!loading && !error && !user && (
        <div className="text-center p-8">
          <div className="status-loading">请登录</div>
        </div>
      )}

      {user && (
        <div>
          <div className="status-success">✅ 用户加载成功！</div>
          {randomNumber !== null && (
            <div className="text-center mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              随机数: <strong>{randomNumber.toFixed(3)}</strong>
              <span style={{ color: '#22c55e' }}> (≤ 0.7 = 成功)</span>
            </div>
          )}
          <div className="mt-4">
            <p><strong>姓名:</strong> {user.name}</p>
            <p><strong>邮箱:</strong> {user.email}</p>
          </div>
          <Button onClick={fetchUser} variant="secondary" className="mt-4">
            重新加载用户
          </Button>
        </div>
      )}
    </div>
  );
}

// =====================================
// 模式 5: 列表渲染和 Keys
// =====================================

/*
🎯 核心要点:
• 在 React 中渲染列表时始终使用唯一的 keys
• Keys 帮助 React 跟踪哪些项目发生了变化、添加或删除
• 没有 keys，React 可能会错误地更新或重新渲染组件
• 使用稳定、唯一的标识符作为 keys（尽可能不使用数组索引）
• 数组索引作为 keys 在列表顺序改变时可能导致错误
*/

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '学习 React useState', completed: true },
    { id: 2, text: '掌握 useEffect', completed: true },
    { id: 3, text: '理解 props', completed: false },
    { id: 4, text: '练习条件渲染', completed: false },
    { id: 5, text: '构建出色的应用', completed: false },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">📝</span>
        学习清单
        <span className="pattern-badge">列表渲染</span>
      </h3>

      <div className="mb-4">
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          进度: {completedCount}/{todos.length} 已完成
        </p>
        <div className="h-2 rounded overflow-hidden" style={{
          background: 'var(--muted)'
        }}>
          <div className="h-full transition-all duration-300 ease-out" style={{
            background: 'var(--primary)',
            width: `${(completedCount / todos.length) * 100}%`
          }} />
        </div>
      </div>

      {/* ❌ 错误: 没有 keys - 列表变化时 React 会困惑 */}
      {/* <div>
        <h3>这是错误示例</h3>
        {todos.map(todo => 
          <div onClick={() => toggleTodo(todo.id)} className="todo-item">
            <span>{todo.completed ? '✅' : '⬜'}</span>
            {todo.text}
          </div>
        )}
      </div> */}

      {/* ✅ 正确: 唯一的 keys 帮助 React 跟踪项目 */}
      {/* 🐍 Python: 类似 enumerate() 给每个项目一个索引 */}
      <div>
        <h3>这是正确示例</h3>
        {todos.map(todo => (
          <div
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className={`todo-item ${todo.completed ? 'todo-completed' : ''}`}
          >
            <span className="mr-2">
              {todo.completed ? '✅' : '⬜'}
            </span>
            {todo.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================
// 模式 6: 事件处理和表单 -- useCallback, useMemo, useEffect, useState
// =====================================

/*
🎯 核心要点:
• 受控组件将表单状态保存在 React 中（而不是 DOM）
• 在表单提交时始终阻止默认行为
• 使用 onChange 保持状态与输入同步
• 验证输入并显示有用的错误消息
• useCallback 防止子组件不必要的重新渲染
• 避免在 JSX 中使用内联函数以获得更好的性能
• 存储和显示多个提交的数据条目以获得更好的用户体验
• 表单和提交数据显示的并排布局
• 多个数据条目的数组状态管理
*/

// 提交表单数据的类型定义
interface SubmittedFormData {
  id: number; // 每次提交的唯一标识符
  name: string;
  email: string;
  message: string;
  submittedAt: string; // 表单提交时的时间戳
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedDataList, setSubmittedDataList] = useState<SubmittedFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextId, setNextId] = useState(1); // 生成唯一 ID 的计数器

  // ❌ 错误: 内联函数每次渲染都创建新函数
  // 这会导致子组件不必要的重新渲染
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // 验证逻辑在这里
  //   setSubmitted(true);
  // };

  // 在 JSX 中: onChange={(e) => setFormData({...formData, name: e.target.value})}
  // 每次渲染都创建新函数 = 性能问题！

  // ✅ 正确: useCallback 防止不必要的重新渲染
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));


    // 用户开始输入时清除错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // 简单验证
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '姓名是必填项';
    if (!formData.email.includes('@')) newErrors.email = '需要有效的邮箱地址';
    if (!formData.message.trim()) newErrors.message = '消息是必填项';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 提交期间显示加载状态
    setIsSubmitting(true);

    // 模拟 API 调用延迟
    setTimeout(() => {
      // 创建带有唯一 ID 的新提交
      const newSubmission: SubmittedFormData = {
        id: nextId,
        ...formData,
        submittedAt: new Date().toLocaleString()
      };

      // 添加到提交列表（最新的在前面）
      setSubmittedDataList(prev => [newSubmission, ...prev]);
      setNextId(prev => prev + 1);

      // 清除表单数据并重置状态
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setIsSubmitting(false);
    }, 1500);
  }, [formData, nextId]);

  // 根据 ID 删除特定提交
  const handleDeleteSubmission = useCallback((id: number) => {
    setSubmittedDataList(prev => prev.filter(submission => submission.id !== id));
  }, []);

  // 删除所有提交
  const handleDeleteAll = useCallback(() => {
    setSubmittedDataList([]);
  }, []);

  // 使用 useMemo 计算提交统计信息以提高性能
  const submissionStats = useMemo(() => {
    return {
      total: submittedDataList.length,
      uniqueEmails: new Set(submittedDataList.map(s => s.email)).size,
      avgMessageLength: submittedDataList.length > 0
        ? Math.round(submittedDataList.reduce((sum, s) => sum + s.message.length, 0) / submittedDataList.length)
        : 0
    };
  }, [submittedDataList]);

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">📧</span>
        联系表单
        <span className="pattern-badge">表单</span>
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        带验证和多数据持久化的受控组件
      </p>

      {/* 并排布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 左侧 - 表单 */}
        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
            📝 提交消息
          </h4>

          {isSubmitting && (
            <div className="mb-4 p-3 rounded text-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <div className="status-loading">📤 发送中...</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="您的姓名"
                className="input"
                disabled={isSubmitting}
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>

            <div className="mb-4">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="您的邮箱"
                className="input"
                disabled={isSubmitting}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="您的消息"
                className="textarea"
                disabled={isSubmitting}
              />
              {errors.message && <div className="error">{errors.message}</div>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '发送中...' : '发送消息'}
            </Button>
          </form>
        </div>

        {/* 右侧 - 提交数据显示 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              📋 消息历史
            </h4>
            {submittedDataList.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}
              >
                🗑️ 清空所有
              </Button>
            )}
          </div>

          {/* 现代统计卡片 */}
          {submittedDataList.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-xl" style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  {submissionStats.total}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  总消息数
                </div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
                  {submissionStats.uniqueEmails}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  唯一发送者
                </div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                  {submissionStats.avgMessageLength}
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  平均长度
                </div>
              </div>
            </div>
          )}

          {submittedDataList.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--muted-foreground) transparent'
            }}>
              {submittedDataList.map((submission, index) => (
                <div
                  key={submission.id}
                  className="group relative p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  {/* 带渐变徽章的现代消息头部 */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: index === 0
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        #{submission.id}
                      </div>
                      {index === 0 && (
                        <div
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.2)'
                          }}
                        >
                          ✨ 最新
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSubmission(submission.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444'
                      }}
                    >
                      ✕
                    </Button>
                  </div>

                  {/* 增强的提交数据，更好的排版 */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          👤 发送者
                        </span>
                      </div>
                      <div
                        className="text-sm font-medium px-3 py-2 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--foreground)'
                        }}
                      >
                        {submission.name}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          📧 邮箱
                        </span>
                      </div>
                      <div
                        className="text-sm font-mono px-3 py-2 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--foreground)',
                          fontSize: '12px'
                        }}
                      >
                        {submission.email}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          💬 消息
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1'
                          }}
                        >
                          {submission.message.length} 字符
                        </span>
                      </div>
                      <div
                        className="text-sm leading-relaxed px-3 py-2 rounded-lg"
                        style={{
                          background: 'var(--muted)',
                          color: 'var(--foreground)',
                          lineHeight: '1.5'
                        }}
                      >
                        {submission.message}
                      </div>
                    </div>

                    {/* 带图标的现代时间戳 */}
                    <div
                      className="flex items-center gap-2 pt-3 mt-3"
                      style={{
                        borderTop: '1px solid var(--border)'
                      }}
                    >
                      <span className="text-xs">🕒</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                        {submission.submittedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 rounded-2xl" style={{
              background: 'linear-gradient(135deg, var(--muted) 0%, rgba(255,255,255,0.1) 100%)',
              border: '2px dashed var(--border)'
            }}>
              {/* 现代空状态 */}
              <div className="mb-4">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '2px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <span className="text-2xl">📭</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                暂无消息
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                使用表单提交您的第一条消息<br />
                在这里查看精美的显示效果！
              </p>
              <div
                className="inline-block mt-4 px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}
              >
                ✨ 准备接收您的第一条消息
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================
// 模式 7: Context API（全局状态）
// =====================================

/*
🎯 核心要点:
• Context API 消除了"属性钻取"（通过多个层级传递 props）
• 使用 createContext 创建上下文，用 Provider 提供，用 useContext 消费
• 只对真正的全局状态使用上下文（主题、用户认证、语言）
• 不要过度使用上下文 - 本地状态通常更好
• 使用前始终检查上下文是否存在
*/

// ❌ 错误: 属性钻取噩梦 - 通过每个层级传递 props
// function App() {
//   const [theme, setTheme] = useState('light');
//   return (
//     <Header theme={theme} setTheme={setTheme} />
//     <Main theme={theme} setTheme={setTheme} />
//     <Footer theme={theme} setTheme={setTheme} />
//   );
// }
// function Header({ theme, setTheme }) {
//   return <Nav theme={theme} setTheme={setTheme} />;
// }
// function Nav({ theme, setTheme }) {
//   return <ThemeButton theme={theme} onClick={setTheme} />;
// }

// ✅ 正确: Context API 消除属性钻取
// 🐍 Python: 类似全局变量，但管理更好
// 注意: 实际实现现在在 src/contexts/ThemeContext.tsx 中以获得更好的组织

function ThemeToggle() {
  // 使用来自 contexts 文件夹的自定义 hook
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🎨</span>
        主题切换器
        <span className="pattern-badge">Context API</span>
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        无需属性钻取的全局状态
      </p>
      <div className="text-center">
        <div className="text-xl mb-4">
          当前主题: <strong>{theme === 'light' ? '浅色' : '深色'}</strong>
        </div>
        <Button onClick={toggleTheme}>
          切换到 {theme === 'light' ? '🌙 深色' : '☀️ 浅色'} 模式
        </Button>
      </div>
    </div>
  );
}

// =====================================
// 模式 8: 自定义 Hooks 和性能优化 -- useMemo
// =====================================

/*
🎯 核心要点:
• 自定义 hooks 提取组件间可重用的状态逻辑
• useMemo 防止每次渲染时进行昂贵的计算
• 只有在实际存在性能问题时才进行记忆化
• 自定义 hooks 遵循与内置 hooks 相同的规则
• Hooks 必须以 "use" 开头并且只能在顶层调用
• localStorage 集成是自定义 hooks 的完美用例
*/

// 自定义 hook - 可重用逻辑
// 注意: 实际实现现在在 src/hooks/useLocalStorage.ts 中以获得更好的组织

function NotesWidget() {
  const [notes, setNotes] = useLocalStorage<string[]>('tutorial-notes', []);
  const [newNote, setNewNote] = useState('');

  // ❌ 错误: 昂贵的计算在每次渲染时运行（即使笔记没有改变）
  // const noteStats = {
  //   total: notes.length,
  //   long: notes.filter(note => note.length > 10).length,
  //   avgLength: notes.reduce((sum, note) => sum + note.length, 0) / notes.length
  // };
  // console.log('📊 计算笔记统计...'); // 这在每次渲染时都会运行！

  // ✅ 正确: useMemo 只在笔记改变时重新计算
  // 🐍 Python: 类似 @lru_cache 装饰器
  const noteStats = useMemo(() => {
    console.log('📊 计算笔记统计...'); // 只有在笔记改变时才会看到这个
    return {
      total: notes.length,
      long: notes.filter(note => note.length > 10).length,
      avgLength: notes.length > 0 ? Math.round(notes.reduce((sum, note) => sum + note.length, 0) / notes.length) : 0
    };
  }, [notes]);

  const addNote = useCallback(() => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  }, [notes, newNote, setNotes]);

  const clearNotes = useCallback(() => {
    setNotes([]);
  }, [setNotes]);

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">📚</span>
        智能笔记
        <span className="pattern-badge">自定义 Hooks</span>
      </h3>

      <div className="grid grid-cols-3 gap-2 text-center p-3 rounded mb-4" style={{
        background: 'var(--muted)'
      }}>
        <div>
          <div className="font-bold">{noteStats.total}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>笔记</div>
        </div>
        <div>
          <div className="font-bold">{noteStats.long}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>长笔记</div>
        </div>
        <div>
          <div className="font-bold">{noteStats.avgLength}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>平均字符</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="添加笔记..."
            className="input flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
          />
          <Button onClick={addNote}>添加</Button>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-center p-4" style={{
            color: 'var(--muted-foreground)'
          }}>
            暂无笔记。在上方添加一个！
          </p>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="note-item">
              {note}
            </div>
          ))
        )}
      </div>

      {notes.length > 0 && (
        <div className="mt-4 text-center">
          <Button variant="destructive" onClick={clearNotes}>
            清空所有笔记
          </Button>
        </div>
      )}
    </div>
  );
}

// =====================================
// 用于组织的章节组件
// =====================================

interface SectionProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ number, title, description, children }: SectionProps) {
  return (
    <div className="tutorial-section">
      <div className="section-inner">
        <div className="section-header">
          <div className="pattern-number">{number}</div>
          <div>
            <div className="section-title">{title}</div>
            <div className="section-description">{description}</div>
          </div>
        </div>
        <div className="widgets-grid">
          {children}
        </div>
      </div>
    </div>
  );
}

// =====================================
// 主仪表板组件
// =====================================

function DashboardContent() {
  // 使用来自 contexts 文件夹的自定义 hook
  const { theme } = useTheme();

  return (
    <div className={`dashboard-center ${theme}`}>
      {/* 基础模式 */}

      <Section
        number={1}
        title="状态管理"
        description="useState + useEffect - React 组件的基础"
      >
        <Counter />
        <NestedStateManager />
        <Clock />
      </Section>

      <Section
        number={2}
        title="组件架构"
        description="Props 和组合 - 构建可重用组件"
      >
        <ButtonShowcase />
      </Section>

      <Section
        number={3}
        title="条件渲染"
        description="在正确的时间显示正确的内容（加载状态、错误状态、功能标志）"
      >
        <UserProfile />
      </Section>

      <Section
        number={4}
        title="数据显示"
        description="列表渲染和 Keys - 高效显示数组数据"
      >
        <TodoList />
      </Section>

      <Section
        number={5}
        title="用户交互"
        description="事件处理和表单 - 管理用户输入和验证"
      >
        <ContactForm />
      </Section>

      <Section
        number={6}
        title="全局状态"
        description="Context API - 在组件间共享状态而无需属性钻取 - useCallback"
      >
        <ThemeToggle />
      </Section>

      <Section
        number={7}
        title="高级模式"
        description="自定义 Hooks 和性能优化 - 可重用逻辑和优化"
      >
        <NotesWidget />
      </Section>

      <Section
        number={8}
        title="useEffect 深度解析"
        description="副作用管理的完整指南 - 生命周期、数据获取、订阅和清理"
      >
        <UseEffectShowcase />
      </Section>

      <Section
        number={9}
        title="useCallback 性能优化"
        description="函数记忆化和性能优化 - 防止不必要的重新渲染"
      >
        <UseCallbackShowcase />
      </Section>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
} 