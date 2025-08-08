/**
 * File: src/components/UseEffectShowcase.tsx
 * 
 * Comprehensive useEffect Examples - All Common Use Cases
 * Demonstrates API calls, timers, event listeners, DOM operations, subscriptions, and cleanup
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';

// =====================================
// SCENARIO 1: API Calls with Loading States
// =====================================

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function ApiCallExample() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`🌐 Fetching posts for user ${userId}...`);
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.slice(0, 3)); // Only show first 3 posts
        console.log(`✅ Successfully fetched ${data.length} posts`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('❌ API call failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]); // Re-fetch when userId changes

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🌐</span>
        API Calls Example
        <span className="pattern-badge">useEffect</span>
      </h3>

      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Select User ID:</label>
        <select
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          className="input"
          style={{ width: '100px' }}
        >
          {[1, 2, 3, 4, 5].map(id => (
            <option key={id} value={id}>User {id}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center p-4">
          <div className="status-loading">🔄 Loading posts...</div>
        </div>
      )}

      {error && (
        <div className="text-center p-4">
          <div className="status-error">❌ {error}</div>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="p-3 rounded" style={{ background: 'var(--muted)' }}>
              <h4 className="font-medium text-sm mb-1">{post.title}</h4>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {post.body.substring(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================
// SCENARIO 2: Timers (setTimeout & setInterval)
// =====================================

function TimersExample() {
  console.log('🕒 TimersExample component rendered');
  const [countdown, setCountdown] = useState(10);
  const [message, setMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // setTimeout example - delayed message
  useEffect(() => {
    console.log('⏱️ Setting up useEffect');

    if (countdown > 0) {
      const timeoutId = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      // Cleanup timeout
      return () => {
        console.log('🧹 Cleaning up setTimeout');
        clearTimeout(timeoutId);
      };
    } else if (countdown === 0 && message === '') {
      setMessage('🎉 Countdown finished!');
    }
  }, [countdown, message]);

  // setInterval example - elapsed time counter
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      console.log('⏱️ Starting interval timer');
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    // Cleanup interval
    return () => {
      if (intervalId) {
        console.log('🧹 Cleaning up setInterval');
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const resetCountdown = () => {
    setCountdown(10);
    setMessage('');
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setElapsedTime(0);
    }
  };

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">⏲️</span>
        Timers Example
        <span className="pattern-badge">useEffect</span>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* setTimeout example */}
        <div>
          <h4 className="text-sm font-semibold mb-2">setTimeout Countdown</h4>
          <div className="text-center p-4 rounded" style={{ background: 'var(--muted)' }}>
            {countdown > 0 ? (
              <div className="text-2xl font-bold">{countdown}</div>
            ) : (
              <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>
                {message}
              </div>
            )}
          </div>
          <button
            onClick={resetCountdown}
            className="btn btn-secondary mt-2 w-full"
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            Reset Countdown
          </button>
        </div>

        {/* setInterval example */}
        <div>
          <h4 className="text-sm font-semibold mb-2">setInterval Timer</h4>
          <div className="text-center p-4 rounded" style={{ background: 'var(--muted)' }}>
            <div className="text-2xl font-bold">{elapsedTime}s</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {isRunning ? 'Running...' : 'Stopped'}
            </div>
          </div>
          <button
            onClick={toggleTimer}
            className={`btn ${isRunning ? 'btn-destructive' : 'btn-primary'} mt-2 w-full`}
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================
// SCENARIO 3: Event Listeners
// =====================================

function EventListenersExample() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [keyPressed, setKeyPressed] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      console.log('📏 Window resized:', window.innerWidth, 'x', window.innerHeight);
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      console.log('🧹 Cleaning up resize listener');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mouse move listener
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      console.log('🧹 Cleaning up mousemove listener');
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Keyboard listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      setKeyPressed(event.key);
      console.log('⌨️ Key pressed:', event.key);

      // Clear after 2 seconds
      setTimeout(() => setKeyPressed(''), 2000);
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      console.log('🧹 Cleaning up keydown listener');
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📴 Gone offline');
    };

    // Set initial status
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      console.log('🧹 Cleaning up online/offline listeners');
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">👂</span>
        Event Listeners Example
        <span className="pattern-badge">useEffect</span>
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded" style={{ background: 'var(--muted)' }}>
          <div className="font-medium mb-1">Window Size</div>
          <div>{windowSize.width} × {windowSize.height}</div>
        </div>

        <div className="p-3 rounded" style={{ background: 'var(--muted)' }}>
          <div className="font-medium mb-1">Mouse Position</div>
          <div>({mousePosition.x}, {mousePosition.y})</div>
        </div>

        <div className="p-3 rounded" style={{ background: 'var(--muted)' }}>
          <div className="font-medium mb-1">Last Key Pressed</div>
          <div className="font-mono">{keyPressed || 'None'}</div>
        </div>

        <div className="p-3 rounded" style={{ background: 'var(--muted)' }}>
          <div className="font-medium mb-1">Connection Status</div>
          <div style={{ color: isOnline ? 'var(--success)' : 'var(--destructive)' }}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 rounded text-xs" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
        💡 Try resizing the window, moving your mouse, pressing keys, or going offline!
      </div>
    </div>
  );
}

// =====================================
// SCENARIO 4: DOM Operations
// =====================================

function DomOperationsExample() {
  const [focusCount, setFocusCount] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log('🎯 Input focused on mount');
    }
  }, []);

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      console.log('🧹 Cleaning up scroll listener');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dynamic style changes
  useEffect(() => {
    if (boxRef.current) {
      const hue = (scrollPosition / 10) % 360;
      boxRef.current.style.backgroundColor = `hsl(${hue}, 70%, 80%)`;
    }
  }, [scrollPosition]);

  const handleFocus = () => {
    setFocusCount(prev => prev + 1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🎨</span>
        DOM Operations Example
        <span className="pattern-badge">useEffect</span>
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Auto-focused Input:</label>
          <input
            ref={inputRef}
            onFocus={handleFocus}
            placeholder="This input auto-focuses on mount"
            className="input"
          />
          <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Focus count: {focusCount}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Scroll Position: {Math.round(scrollPosition)}px</div>
          <div
            ref={boxRef}
            className="h-16 rounded transition-colors duration-300"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <div className="flex items-center justify-center h-full text-sm">
              Color changes with scroll position
            </div>
          </div>
        </div>

        <button onClick={scrollToTop} className="btn btn-secondary">
          Scroll to Top
        </button>
      </div>
    </div>
  );
}

// =====================================
// SCENARIO 5: Subscriptions & WebSocket Simulation
// =====================================

function SubscriptionExample() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    if (isConnected) {
      console.log('🔌 Connecting to message service...');
      setConnectionStatus('Connecting...');

      // Simulate connection delay
      const connectTimeout = setTimeout(() => {
        setConnectionStatus('Connected');
        console.log('✅ Connected to message service');

        // Simulate receiving messages
        const messageInterval = setInterval(() => {
          const randomMessages = [
            '📧 New email received',
            '💬 Chat message from user',
            '🔔 System notification',
            '📱 Mobile app update',
            '🎉 Achievement unlocked!',
            '⚠️ Warning: Low battery',
            '📊 Daily report ready',
            '🌟 New feature available'
          ];

          const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
          const timestamp = new Date().toLocaleTimeString();

          setMessages(prev => [...prev, `${timestamp}: ${randomMessage}`].slice(-5)); // Keep only last 5
          console.log('📨 Received message:', randomMessage);
        }, 3000);

        // Store interval ID for cleanup
        return () => {
          console.log('🧹 Cleaning up message subscription');
          clearInterval(messageInterval);
        };
      }, 1000);

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up connection');
        clearTimeout(connectTimeout);
        setConnectionStatus('Disconnected');
      };
    } else {
      setConnectionStatus('Disconnected');
      setMessages([]);
    }
  }, [isConnected]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">📡</span>
        Subscription Example
        <span className="pattern-badge">useEffect</span>
      </h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm">
            Status: <span style={{
              color: connectionStatus === 'Connected' ? 'var(--success)' :
                connectionStatus === 'Connecting...' ? 'var(--warning)' : 'var(--destructive)'
            }}>
              {connectionStatus}
            </span>
          </div>
          <button
            onClick={toggleConnection}
            className={`btn ${isConnected ? 'btn-destructive' : 'btn-primary'}`}
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center p-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {isConnected ? 'Waiting for messages...' : 'Connect to receive messages'}
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className="p-2 rounded text-xs"
                style={{ background: 'var(--muted)' }}
              >
                {message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================
// SCENARIO 6: Resource Cleanup Example
// =====================================

function ResourceCleanupExample() {
  const [isActive, setIsActive] = useState(false);
  const [resourceCount, setResourceCount] = useState(0);
  const resourcesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (isActive) {
      console.log('🚀 Creating resources...');

      // Simulate creating multiple resources
      const resources: number[] = [];

      for (let i = 0; i < 3; i++) {
        const resourceId = Date.now() + i;
        resources.push(resourceId);
        resourcesRef.current.add(resourceId);

        console.log(`📦 Created resource ${resourceId}`);
      }

      setResourceCount(resourcesRef.current.size);

      // Simulate some ongoing work
      const workInterval = setInterval(() => {
        console.log('⚙️ Resources working...');
      }, 2000);

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up resources...');

        // Clear interval
        clearInterval(workInterval);

        // Clean up all resources
        resources.forEach(resourceId => {
          resourcesRef.current.delete(resourceId);
          console.log(`🗑️ Cleaned up resource ${resourceId}`);
        });

        setResourceCount(resourcesRef.current.size);
        console.log('✅ All resources cleaned up');
      };
    }
  }, [isActive]);

  const toggleResources = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🧹</span>
        Resource Cleanup Example
        <span className="pattern-badge">useEffect</span>
      </h3>

      <div className="text-center">
        <div className="mb-4">
          <div className="text-2xl font-bold mb-2">{resourceCount}</div>
          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Active Resources
          </div>
        </div>

        <button
          onClick={toggleResources}
          className={`btn ${isActive ? 'btn-destructive' : 'btn-primary'}`}
        >
          {isActive ? 'Stop & Cleanup' : 'Create Resources'}
        </button>

        <div className="mt-3 p-2 rounded text-xs" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
          💡 Check the console to see resource creation and cleanup logs
        </div>
      </div>
    </div>
  );
}

// =====================================
// MAIN SHOWCASE COMPONENT
// =====================================

export default function UseEffectShowcase() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">useEffect Comprehensive Examples</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Demonstrating all common useEffect patterns with real-world scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApiCallExample />
        <TimersExample />
        <EventListenersExample />
        <DomOperationsExample />
        <SubscriptionExample />
        <ResourceCleanupExample />
      </div>

      <div className="mt-8 p-4 rounded" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
        <h3 className="font-bold mb-2" style={{ color: 'var(--primary)' }}>
          🎯 Key useEffect Patterns Demonstrated:
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li><strong>API Calls:</strong> Async data fetching with loading states and error handling</li>
          <li><strong>Timers:</strong> setTimeout for delays and setInterval for recurring tasks</li>
          <li><strong>Event Listeners:</strong> Window events, mouse, keyboard, and network status</li>
          <li><strong>DOM Operations:</strong> Direct DOM manipulation, focus management, and styling</li>
          <li><strong>Subscriptions:</strong> WebSocket-like connections with message handling</li>
          <li><strong>Resource Cleanup:</strong> Proper cleanup to prevent memory leaks</li>
        </ul>
      </div>
    </div>
  );
}