'use client';

import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { Button } from './Button';

// =====================================
// 演示组件：子组件优化
// =====================================

// 🎯 用 memo 包装的子组件 - 只有 props 变化时才重新渲染
const ExpensiveChild = memo(({ onClick, data, renderCount }: {
  onClick: () => void;
  data: string;
  renderCount: { current: number };
}) => {
  renderCount.current += 1;
  console.log(`🔄 ExpensiveChild rendered ${renderCount.current} times`);
  
  return (
    <div className="p-3 rounded" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
      <div className="text-sm font-medium mb-2">Expensive Child Component</div>
      <div className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
        Render count: <strong>{renderCount.current}</strong>
      </div>
      <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
        Data: {data}
      </div>
      <Button onClick={onClick} variant="secondary" style={{ fontSize: '12px', padding: '4px 8px' }}>
        Child Button
      </Button>
    </div>
  );
});

// 🎯 普通子组件 - 每次父组件渲染都会重新渲染
const RegularChild = ({ onClick, data, renderCount }: {
  onClick: () => void;
  data: string;
  renderCount: { current: number };
}) => {
  renderCount.current += 1;
  console.log(`🔄 RegularChild rendered ${renderCount.current} times`);
  
  return (
    <div className="p-3 rounded" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
      <div className="text-sm font-medium mb-2">Regular Child Component</div>
      <div className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
        Render count: <strong>{renderCount.current}</strong>
      </div>
      <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
        Data: {data}
      </div>
      <Button onClick={onClick} variant="secondary" style={{ fontSize: '12px', padding: '4px 8px' }}>
        Child Button
      </Button>
    </div>
  );
};

// =====================================
// 场景1：防止子组件不必要的重新渲染
// =====================================

function ChildRenderOptimization() {
  const [parentCount, setParentCount] = useState(0);
  const [childData] = useState('Static data');
  
  // 渲染计数器
  const expensiveChildRenderCount = useMemo(() => ({ current: 0 }), []);
  const regularChildRenderCount = useMemo(() => ({ current: 0 }), []);

  // ❌ 没有 useCallback - 每次都创建新函数
  const handleRegularClick = () => {
    console.log('Regular child clicked');
  };

  // ✅ 使用 useCallback - 函数引用保持不变
  const handleOptimizedClick = useCallback(() => {
    console.log('Optimized child clicked');
  }, []); // 空依赖数组 = 函数永远不变

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🚀</span>
        Child Component Optimization
        <span className="pattern-badge">useCallback</span>
      </h3>
      
      <div className="mb-4">
        <div className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
          Parent renders: <strong>{parentCount}</strong>
        </div>
        <Button onClick={() => setParentCount(prev => prev + 1)} variant="primary">
          Re-render Parent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            ❌ Without useCallback
          </h4>
          <RegularChild 
            onClick={handleRegularClick}
            data={childData}
            renderCount={regularChildRenderCount}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            ✅ With useCallback
          </h4>
          <ExpensiveChild 
            onClick={handleOptimizedClick}
            data={childData}
            renderCount={expensiveChildRenderCount}
          />
        </div>
      </div>

      <div className="mt-4 p-3 rounded text-sm" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
        <p className="font-medium mb-1" style={{ color: '#22c55e' }}>
          💡 观察控制台输出：
        </p>
        <p style={{ color: 'var(--foreground)' }}>
          左侧组件每次父组件重新渲染都会重新渲染，右侧组件使用了 memo + useCallback 优化，不会重新渲染。
        </p>
      </div>
    </div>
  );
}

// =====================================
// 场景2：依赖数组的正确使用
// =====================================

function DependencyArrayDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');
  const [logs, setLogs] = useState<string[]>([]);

  // ❌ 错误：遗漏依赖，会使用过时的值
  const handleBadCallback = useCallback(() => {
    const message = `Bad: Count is ${count}, Name is ${name}`;
    setLogs(prev => [...prev, message]);
    console.log(message);
  }, []); // 空依赖数组，但函数内使用了 count 和 name

  // ✅ 正确：包含所有依赖
  const handleGoodCallback = useCallback(() => {
    const message = `Good: Count is ${count}, Name is ${name}`;
    setLogs(prev => [...prev, message]);
    console.log(message);
  }, [count, name]); // 包含所有使用的状态

  // ✅ 使用函数式更新避免依赖
  const handleFunctionalUpdate = useCallback(() => {
    const message = `Functional: Using functional updates`;
    setLogs(prev => [...prev, message]);
    setCount(prevCount => {
      console.log(`Current count: ${prevCount}`);
      return prevCount + 1;
    });
  }, []); // 可以为空，因为使用了函数式更新

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🎯</span>
        Dependency Array Patterns
        <span className="pattern-badge">Dependencies</span>
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Count: {count}</label>
          <Button onClick={() => setCount(prev => prev + 1)} variant="secondary">
            Increment Count
          </Button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Enter name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Button onClick={handleBadCallback} variant="destructive">
          ❌ Bad Callback
        </Button>
        <Button onClick={handleGoodCallback} variant="primary">
          ✅ Good Callback
        </Button>
        <Button onClick={handleFunctionalUpdate} variant="secondary">
          🔧 Functional Update
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold">Console Logs:</h4>
          <Button onClick={clearLogs} variant="secondary" style={{ fontSize: '12px', padding: '4px 8px' }}>
            Clear
          </Button>
        </div>
        <div 
          className="p-3 rounded max-h-32 overflow-y-auto text-sm font-mono"
          style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          {logs.length === 0 ? (
            <div style={{ color: 'var(--muted-foreground)' }}>No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-3 rounded text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
        <p className="font-medium mb-1" style={{ color: '#ef4444' }}>
          ⚠️ 注意观察：
        </p>
        <p style={{ color: 'var(--foreground)' }}>
          点击 "Bad Callback" 会使用过时的 count 和 name 值，而 "Good Callback" 总是使用最新值。
        </p>
      </div>
    </div>
  );
}

// =====================================
// 场景3：与 useEffect 配合使用
// =====================================

function UseEffectIntegration() {
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  // ❌ 没有 useCallback - useEffect 会频繁重新执行
  // const fetchUserData = async () => {
  //   setLoading(true);
  //   // 模拟 API 调用
  //   setTimeout(() => {
  //     setUserData({ id: userId, name: `User ${userId}`, email: `user${userId}@example.com` });
  //     setLoading(false);
  //     setFetchCount(prev => prev + 1);
  //   }, 1000);
  // };

  // ✅ 使用 useCallback - 稳定的函数引用
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setFetchCount(prev => prev + 1);
    
    // 模拟 API 调用
    setTimeout(() => {
      setUserData({ 
        id: userId, 
        name: `User ${userId}`, 
        email: `user${userId}@example.com`,
        fetchedAt: new Date().toLocaleTimeString()
      });
      setLoading(false);
    }, 1000);
  }, [userId]); // 只有 userId 变化时才重新创建

  // 使用 fetchUserData 作为 useEffect 的依赖
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // fetchUserData 是稳定的引用

  // 手动刷新数据
  const handleRefresh = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🔄</span>
        useEffect Integration
        <span className="pattern-badge">useEffect</span>
      </h3>

      <div className="mb-4">
        <div className="flex items-center gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">User ID:</label>
            <select 
              value={userId} 
              onChange={(e) => setUserId(Number(e.target.value))}
              className="input"
            >
              {[1, 2, 3, 4, 5].map(id => (
                <option key={id} value={id}>User {id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-medium mb-1">Fetch Count: {fetchCount}</div>
            <Button onClick={handleRefresh} variant="secondary" disabled={loading}>
              🔄 Refresh
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8">
          <div className="status-loading">Loading user data...</div>
        </div>
      ) : userData ? (
        <div className="p-4 rounded" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h4 className="font-semibold mb-2">User Information</h4>
          <div className="space-y-1 text-sm">
            <div><strong>ID:</strong> {userData.id}</div>
            <div><strong>Name:</strong> {userData.name}</div>
            <div><strong>Email:</strong> {userData.email}</div>
            <div><strong>Fetched at:</strong> {userData.fetchedAt}</div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <div style={{ color: 'var(--muted-foreground)' }}>No data</div>
        </div>
      )}

      <div className="mt-4 p-3 rounded text-sm" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
        <p className="font-medium mb-1" style={{ color: '#6366f1' }}>
          💡 useCallback + useEffect 最佳实践：
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--foreground)' }}>
          <li>将异步函数用 useCallback 包装</li>
          <li>在 useEffect 中使用稳定的函数引用</li>
          <li>避免 useEffect 的无限循环</li>
        </ul>
      </div>
    </div>
  );
}

// =====================================
// 场景4：表单处理优化
// =====================================

function FormOptimization() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<any[]>([]);

  // ✅ 通用的字段更新处理器
  const handleFieldChange = useCallback((field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // 清除错误
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
  }, [errors]);

  // ✅ 验证函数
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.message.trim()) newErrors.message = 'Message required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ✅ 表单提交处理器
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submission = {
        ...formData,
        id: Date.now(),
        submittedAt: new Date().toLocaleString()
      };
      
      setSubmissions(prev => [submission, ...prev]);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      console.log('Form submitted:', submission);
    }
  }, [formData, validateForm]);

  // ✅ 删除提交记录
  const handleDeleteSubmission = useCallback((id: number) => {
    setSubmissions(prev => prev.filter(sub => sub.id !== id));
  }, []);

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">📝</span>
        Form Optimization
        <span className="pattern-badge">Forms</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 表单 */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Optimized Form</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  value={formData.firstName}
                  onChange={handleFieldChange('firstName')}
                  placeholder="First Name"
                  className="input"
                />
                {errors.firstName && <div className="error">{errors.firstName}</div>}
              </div>
              <div>
                <input
                  value={formData.lastName}
                  onChange={handleFieldChange('lastName')}
                  placeholder="Last Name"
                  className="input"
                />
                {errors.lastName && <div className="error">{errors.lastName}</div>}
              </div>
            </div>
            
            <div>
              <input
                value={formData.email}
                onChange={handleFieldChange('email')}
                placeholder="Email"
                type="email"
                className="input"
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            
            <div>
              <textarea
                value={formData.message}
                onChange={handleFieldChange('message')}
                placeholder="Message"
                className="textarea"
                rows={3}
              />
              {errors.message && <div className="error">{errors.message}</div>}
            </div>
            
            <Button type="submit" variant="primary">
              Submit Form
            </Button>
          </form>
        </div>

        {/* 提交记录 */}
        <div>
          <h4 className="text-sm font-semibold mb-3">
            Submissions ({submissions.length})
          </h4>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {submissions.length === 0 ? (
              <div className="text-center p-8 rounded" style={{ background: 'var(--muted)' }}>
                <div style={{ color: 'var(--muted-foreground)' }}>No submissions yet</div>
              </div>
            ) : (
              submissions.map(submission => (
                <div 
                  key={submission.id}
                  className="p-3 rounded"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">
                      {submission.firstName} {submission.lastName}
                    </div>
                    <Button
                      onClick={() => handleDeleteSubmission(submission.id)}
                      variant="destructive"
                      style={{ fontSize: '11px', padding: '2px 6px' }}
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="text-sm space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                    <div>{submission.email}</div>
                    <div>{submission.message}</div>
                    <div className="text-xs">{submission.submittedAt}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded text-sm" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
        <p className="font-medium mb-1" style={{ color: '#f59e0b' }}>
          🔧 表单优化技巧：
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--foreground)' }}>
          <li>使用 useCallback 缓存事件处理器</li>
          <li>创建通用的字段更新函数</li>
          <li>将验证逻辑提取为独立函数</li>
          <li>避免在 JSX 中使用内联函数</li>
        </ul>
      </div>
    </div>
  );
}

// =====================================
// 场景5：性能对比演示
// =====================================

function PerformanceComparison() {
  const [renderCount, setRenderCount] = useState(0);
  const [data, setData] = useState('Initial data');
  
  // 渲染计数器
  const withCallbackRenderCount = useMemo(() => ({ current: 0 }), []);
  const withoutCallbackRenderCount = useMemo(() => ({ current: 0 }), []);

  // ❌ 没有 useCallback
  const handleWithoutCallback = () => {
    console.log('Without useCallback clicked');
  };

  // ✅ 使用 useCallback
  const handleWithCallback = useCallback(() => {
    console.log('With useCallback clicked');
  }, []);

  const triggerRerender = () => {
    setRenderCount(prev => prev + 1);
  };

  const updateData = () => {
    setData(`Updated data ${Date.now()}`);
  };

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">⚡</span>
        Performance Comparison
        <span className="pattern-badge">Performance</span>
      </h3>

      <div className="mb-4 space-y-2">
        <div className="text-sm">
          Parent renders: <strong>{renderCount}</strong>
        </div>
        <div className="text-sm">
          Current data: <strong>{data}</strong>
        </div>
        <div className="flex gap-2">
          <Button onClick={triggerRerender} variant="primary">
            Trigger Re-render
          </Button>
          <Button onClick={updateData} variant="secondary">
            Update Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-red-600">
            ❌ Without useCallback
          </h4>
          <ExpensiveChild
            onClick={handleWithoutCallback}
            data={data}
            renderCount={withoutCallbackRenderCount}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2 text-green-600">
            ✅ With useCallback
          </h4>
          <ExpensiveChild
            onClick={handleWithCallback}
            data={data}
            renderCount={withCallbackRenderCount}
          />
        </div>
      </div>

      <div className="mt-4 p-3 rounded text-sm" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
        <p className="font-medium mb-2" style={{ color: '#10b981' }}>
          📊 性能对比结果：
        </p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="font-bold text-lg" style={{ color: '#ef4444' }}>
              {withoutCallbackRenderCount.current}
            </div>
            <div style={{ color: 'var(--muted-foreground)' }}>Without useCallback</div>
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color: '#22c55e' }}>
              {withCallbackRenderCount.current}
            </div>
            <div style={{ color: 'var(--muted-foreground)' }}>With useCallback</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================
// 主要展示组件
// =====================================

export default function UseCallbackShowcase() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">useCallback 完整指南</h1>
        <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
          掌握 React 性能优化的关键 Hook
        </p>
      </div>

      <ChildRenderOptimization />
      <DependencyArrayDemo />
      <UseEffectIntegration />
      <FormOptimization />
      <PerformanceComparison />

      {/* 总结 */}
      <div className="widget">
        <h3>
          <span className="widget-icon">📚</span>
          useCallback 最佳实践总结
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-3 text-green-600">✅ 应该使用的场景</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span>🎯</span>
                <span>传递给使用 React.memo 的子组件</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🔄</span>
                <span>作为 useEffect 的依赖</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📝</span>
                <span>复杂的事件处理器</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🏗️</span>
                <span>创建其他 Hook 的依赖</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-3 text-red-600">❌ 不需要使用的场景</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span>🚫</span>
                <span>简单的内联事件处理器</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🚫</span>
                <span>不传递给子组件的函数</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🚫</span>
                <span>每次渲染都需要变化的函数</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🚫</span>
                <span>过度优化简单组件</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 rounded" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#6366f1' }}>
            🎓 记住这些要点：
          </h4>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>useCallback 返回缓存的函数，useMemo 返回缓存的值</li>
            <li>依赖数组必须包含函数内使用的所有状态和 props</li>
            <li>配合 React.memo 使用才能发挥最大效果</li>
            <li>不要过度使用，只在有性能问题时使用</li>
            <li>使用 ESLint 插件帮助检查依赖数组</li>
          </ol>
        </div>
      </div>
    </div>
  );
}