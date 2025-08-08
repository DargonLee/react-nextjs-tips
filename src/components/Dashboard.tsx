/**
 * File: src/components/Dashboard.tsx
 * 
 * Progressive React Tutorial - Personal Dashboard
 * Uncomment sections as you teach each pattern!
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from './Button';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

// =====================================
// PATTERN 1.5: Updating Nested State Structures
// =====================================

/*
🎯 KEY TAKEAWAYS:
• React state updates must be immutable (create new objects/arrays, don't modify existing ones)
• For nested objects and arrays, you need to create copies at each level of nesting
• Spread operator (...) only creates shallow copies - nested structures need special handling
• Always return new references for React to detect changes and trigger re-renders
• Immer or other immutability libraries can simplify complex state updates
*/

function NestedStateManager() {
  // Complex nested state structure with objects and arrays
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

  // ❌ BAD: Directly mutating nested state
  // const updateEmailBad = () => {
  //   userData.personalInfo.email = "alex.updated@example.com"; // Mutates original object!
  //   setUserData(userData); // Same reference, React won't detect changes!
  //   console.log("Email updated (but UI won't update!)");
  // };

  // ❌ BAD: Only shallow copying the first level
  // const updateEmailIncomplete = () => {
  //   const newUserData = { ...userData }; // Shallow copy only!
  //   newUserData.personalInfo.email = "alex.updated@example.com"; // Still mutates nested object!
  //   setUserData(newUserData);
  // };

  // ✅ GOOD: Properly updating nested object properties
  const updateEmail = () => {
    setUserData({
      ...userData, // Copy the top level
      personalInfo: {
        ...userData.personalInfo, // Copy the personalInfo level
        email: "alex.updated@example.com", // Update specific field
        preferences: {
          ...userData.personalInfo.preferences,
          theme: "dark" // Update nested field
        }
      }
    });
  };

  // ✅ GOOD: Updating deeply nested object properties
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

  // ✅ GOOD: Updating an item in an array by mapping
  const incrementLikes = (postId: number) => {
    setUserData({
      ...userData,
      posts: userData.posts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 } // Create new object for the matching post
          : post // Keep other posts unchanged
      ),
      stats: {
        ...userData.stats,
        totalLikes: userData.stats.totalLikes + 1
      }
    });
  };

  // ✅ GOOD: Adding an item to an array
  const addPost = () => {
    const newPost = {
      id: userData.posts.length + 1,
      title: `New Post ${userData.posts.length + 1}`,
      likes: 0,
      tags: ["react", "new"]
    };

    setUserData({
      ...userData,
      posts: [...userData.posts, newPost] // Create new array with added item
    });
  };

  // ✅ GOOD: Removing an item from an array
  const removePost = (postId: number) => {
    const removedPost = userData.posts.find(post => post.id === postId);
    const removedLikes = removedPost ? removedPost.likes : 0;

    setUserData({
      ...userData,
      posts: userData.posts.filter(post => post.id !== postId), // Create new filtered array
      stats: {
        ...userData.stats,
        totalLikes: userData.stats.totalLikes - removedLikes
      }
    });
  };

  // ✅ GOOD: Adding a tag to a nested array
  const addTagToPost = (postId: number, newTag: string) => {
    setUserData({
      ...userData,
      posts: userData.posts.map(post =>
        post.id === postId
          ? {
            ...post,
            tags: [...post.tags, newTag] // Create new tags array
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
          Personal Information
        </h4>
        <div className="p-3 rounded" style={{ background: 'var(--muted)' }}>
          <div><strong>Name:</strong> {userData.personalInfo.name}</div>
          <div><strong>Email:</strong> {userData.personalInfo.email}</div>
          <div>
            <strong>Notifications:</strong> {userData.personalInfo.preferences.notifications ? 'On' : 'Off'}
          </div>
          <div><strong>Theme:</strong> {userData.personalInfo.preferences.theme}</div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button onClick={updateEmail} variant="secondary">
            Update Email
          </Button>
          <Button onClick={toggleNotifications} variant="secondary">
            Toggle Notifications
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
            Posts
          </h4>
          <Button onClick={addPost} variant="primary" style={{ fontSize: '12px', padding: '4px 8px' }}>
            Add Post
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
                  Remove
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
                    👍 Like
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
                    + Tag
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>
          User Stats
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded" style={{ background: 'var(--muted)' }}>
            <div className="font-bold">{userData.stats.totalLikes}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Likes</div>
          </div>
          <div className="p-2 rounded" style={{ background: 'var(--muted)' }}>
            <div className="font-bold">{userData.stats.followers}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Followers</div>
          </div>
          <div className="p-2 rounded" style={{ background: 'var(--muted)' }}>
            <div className="font-bold">{userData.stats.following}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Following</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded text-sm" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
        <p className="font-medium mb-2" style={{ color: 'var(--primary)' }}>
          💡 React State Immutability Rules:
        </p>
        <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--foreground)' }}>
          <li>Never modify state objects directly</li>
          <li>Create new copies at each level of nesting</li>
          <li>Use spread operator (...) for shallow copying</li>
          <li>Use map/filter for array updates</li>
          <li>Consider immer for complex nested updates</li>
        </ul>
      </div>
    </div>
  );
}


// =====================================
// PATTERN 1: useState - State Management
// =====================================

/*
🎯 KEY TAKEAWAYS:
• useState triggers automatic UI re-renders when state changes
• Regular variables change internally but don't update the UI
• useState is React's way of connecting data to the visual interface
• Always use setState functions, never mutate state directly
*/

function Counter() {
  // 🐍 Python equivalent: self.count = 0 in __init__
  // But Python needs manual UI updates, React auto-updates!

  // ❌ BAD: Variable doesn't trigger re-renders
  // let count = 0;
  // const increment = () => {
  //   count += 1;  // Changes but UI doesn't update!
  //   console.log('Count changed to:', count); // Only shows in console
  // };
  // const decrement = () => {
  //   count -= 1;  // Changes but UI doesn't update!
  //   console.log('Count changed to:', count);
  // };
  // const reset = () => {
  //   count = 0;  // Changes but UI doesn't update!
  //   console.log('Count reset to:', count);
  // };

  // ✅ GOOD: useState triggers automatic re-renders
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🔢</span>
        Counter Widget
        <span className="pattern-badge">useState</span>
      </h3>
      <div className="text-center mb-4">
        <div className="text-3xl font-bold my-4">
          {count}
        </div>
        <p className="text-sm mb-0" style={{ color: 'var(--muted-foreground)' }}>
          Click buttons to see automatic re-renders
        </p>
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={decrement} className="btn btn-secondary">-</button>
        <button onClick={reset} className="btn btn-secondary">Reset</button>
        <button onClick={increment} className="btn btn-primary">+</button>
      </div>
    </div>
  );
}

// =====================================
// PATTERN 2: useEffect - Side Effects
// =====================================

/*
🎯 KEY TAKEAWAYS:
• useEffect handles side effects (timers, API calls, subscriptions)
• Never run side effects directly in render function - causes infinite loops
• Always clean up side effects to prevent memory leaks
• Empty dependency array [] means "run once on mount"
• useEffect cleanup function runs when component unmounts
*/

function Clock() {
  const [time, setTime] = useState<Date | null>(null);
  const [showBadExample, setShowBadExample] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // // // Track renders for demonstration
  // useEffect(() => {
  //   setRenderCount(prev => prev + 1);
  // });

  // // ❌ BAD: Side effect in render function (when demo is active)
  // if (showBadExample) {
  //   console.log(`🔥 RENDER #${renderCount}: Creating new timer...`);
  //   setTimeout(() => {
  //     setTime(new Date()); // This will trigger another render!
  //   }, 1000);
  // }

  // ✅ GOOD: useEffect handles side effects properly
  useEffect(() => {
    // Fix hydration mismatch by only setting time after client mount
    setTime(new Date());

    // 🐍 Python: Like __enter__ in context manager
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 🐍 Python: Like __exit__ in context manager
    return () => clearInterval(timer); // Cleanup prevents memory leaks
  }, [showBadExample]); // Re-run when demo mode changes

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">⏰</span>
        Live Clock
        <span className="pattern-badge">useEffect</span>
      </h3>

      {/* Demo Toggle */}
      <div className="mb-4 text-center">
        <button
          onClick={() => setShowBadExample(!showBadExample)}
          className={`btn ${showBadExample ? 'btn-destructive' : 'btn-secondary'}`}
        >
          {showBadExample ? '🛑 Stop Bad Demo' : '🔥 Show Bad Example'}
        </button>
      </div>

      {/* Visual Feedback */}
      {showBadExample && (
        <div className="rounded mb-4 text-center p-2" style={{
          background: 'rgba(255, 68, 68, 0.1)'
        }}>
          <div className="text-sm font-bold" style={{ color: '#ff4444' }}>
            ⚠️ Renders: {renderCount} | Check console!
          </div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            New timer created every render
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="text-2xl font-bold my-4">
          {time ? time.toLocaleTimeString() : '--:--:-- --'}
        </div>
        <p className="text-sm mb-0" style={{ color: 'var(--muted-foreground)' }}>
          {showBadExample
            ? '🚨 Using setTimeout in render (creating memory leaks!)'
            : 'Updates every second with automatic cleanup'
          }
        </p>
      </div>
    </div>
  );
}

// =====================================
// PATTERN 3: Props & Component Composition
// =====================================

/*
🎯 KEY TAKEAWAYS:
• Props make components reusable instead of hardcoded
• One flexible component is better than many rigid components
• TypeScript interfaces define what props a component expects
• Default parameters make components more convenient to use
• Component composition allows building complex UIs from simple parts
*/

// ❌ BAD: Hardcoded, not reusable
// function SubmitButton() {
//   return <button className="btn btn-primary">Submit</button>;
// }
// function CancelButton() {
//   return <button className="btn btn-secondary">Cancel</button>;
// }

// ✅ GOOD: Reusable component with props (now imported from separate file)

function ButtonShowcase() {
  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🎨</span>
        Button Variants
        <span className="pattern-badge">Props</span>
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        One component, multiple styles via props
      </p>
      <div className="flex flex-row gap-3 justify-center">
        <Button variant="primary" onClick={() => alert('Primary!')}>
          Primary Button
        </Button>
        <Button variant="secondary" onClick={() => alert('Secondary!')}>
          Secondary Button
        </Button>
        <Button variant="destructive" onClick={() => alert('Danger!')}>
          Destructive Button
        </Button>
        <Button disabled onClick={() => alert('Never fires')}>
          Disabled Button
        </Button>
        <Button variant='primary' onClick={() => alert('Sean is on fire!')}>
          Sean Button
        </Button>
      </div>
    </div>
  );
}

// =====================================
// PATTERN 4: Conditional Rendering - Loading states, error states, feature flags
// =====================================

/*
🎯 KEY TAKEAWAYS:
• Show different UI based on state (loading, error, success)
• Use logical operators (&&) for simple show/hide conditions
• Chain conditions to handle multiple states properly
• Never show all states simultaneously - confuses users
• Loading states improve user experience during async operations
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

    // Simulate API call
    setTimeout(() => {
      const random = Math.random();
      // Store the random number in state to display in UI
      setRandomNumber(random);
      console.log('Random number: ', random);

      if (random > 0.7) {
        setError('Failed to load user data');
      } else {
        setUser({ name: 'John Doe', email: 'john@example.com' });
      }
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ❌ BAD: Shows everything at once - confusing to users!
  // return (
  //   <div className="widget">
  //     <h3>User Profile</h3>
  //     <div>Loading...</div>
  //     <div>Error: Something went wrong</div>
  //     <div>Welcome, John!</div>
  //     <div>Please log in</div>
  //   </div>
  // );

  // ✅ GOOD: Show appropriate state
  // 🐍 Python: Like if/elif/else statements
  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">👤</span>
        User Profile
        <span className="pattern-badge">Conditional</span>
      </h3>

      {loading && (
        <div className="text-center p-8">
          <div className="status-loading">Loading user data...</div>
        </div>
      )}

      {error && (
        <div className="text-center p-8">
          <div className="status-error">❌ {error}</div>
          {randomNumber !== null && (
            <div className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Random number: <strong>{randomNumber.toFixed(3)}</strong>
              <span style={{ color: '#ff4444' }}> (&gt; 0.7 = Error)</span>
            </div>
          )}
          <Button onClick={fetchUser} variant="secondary" className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && !user && (
        <div className="text-center p-8">
          <div className="status-loading">Please log in</div>
        </div>
      )}

      {user && (
        <div>
          <div className="status-success">✅ User loaded successfully!</div>
          {randomNumber !== null && (
            <div className="text-center mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Random number: <strong>{randomNumber.toFixed(3)}</strong>
              <span style={{ color: '#22c55e' }}> (≤ 0.7 = Success)</span>
            </div>
          )}
          <div className="mt-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <Button onClick={fetchUser} variant="secondary" className="mt-4">
            Reload User
          </Button>
        </div>
      )}
    </div>
  );
}

// =====================================
// PATTERN 5: List Rendering & Keys
// =====================================

/*
🎯 KEY TAKEAWAYS:
• Always use unique keys when rendering lists in React
• Keys help React track which items changed, added, or removed
• Without keys, React may incorrectly update or re-render components
• Use stable, unique identifiers as keys (not array indexes when possible)
• Array indexes as keys can cause bugs when list order changes
*/

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React useState', completed: true },
    { id: 2, text: 'Master useEffect', completed: true },
    { id: 3, text: 'Understand props', completed: false },
    { id: 4, text: 'Practice conditional rendering', completed: false },
    { id: 5, text: 'Build awesome apps', completed: false },
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
        Learning Checklist
        <span className="pattern-badge">List Rendering</span>
      </h3>

      <div className="mb-4">
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Progress: {completedCount}/{todos.length} completed
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

      {/* ❌ BAD: No keys - React gets confused when list changes */}
      {/* <div>
        <h3>This is the bad example</h3>
        {todos.map(todo => 
          <div onClick={() => toggleTodo(todo.id)} className="todo-item">
            <span>{todo.completed ? '✅' : '⬜'}</span>
            {todo.text}
          </div>
        )}
      </div> */}

      {/* ✅ GOOD: Unique keys help React track items */}
      {/* 🐍 Python: Like enumerate() giving each item an index */}
      <div>
        <h3>This is the good example</h3>
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
// PATTERN 6: Event Handling & Forms -- useCallback, useMemo, useEffect, useState
// =====================================

/*
🎯 KEY TAKEAWAYS:
• Controlled components keep form state in React (not DOM)
• Always prevent default behavior in form submissions
• Use onChange to keep state in sync with inputs
• Validate inputs and show helpful error messages
• useCallback prevents unnecessary re-renders in child components
• Avoid inline functions in JSX for better performance
• Store and display multiple submitted data entries for better user experience
• Side-by-side layout for form and submitted data display
• Array state management for multiple data entries
*/

// Type definition for submitted form data
interface SubmittedFormData {
  id: number; // Unique identifier for each submission
  name: string;
  email: string;
  message: string;
  submittedAt: string; // Timestamp when form was submitted
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
  const [nextId, setNextId] = useState(1); // Counter for generating unique IDs

  // ❌ BAD: Inline functions create new functions every render
  // This causes child components to re-render unnecessarily
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Validation logic here
  //   setSubmitted(true);
  // };

  // In JSX: onChange={(e) => setFormData({...formData, name: e.target.value})}
  // Creates new function every render = performance issue!

  // ✅ GOOD: useCallback prevents unnecessary re-renders
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show loading state during submission
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      // Create new submission with unique ID
      const newSubmission: SubmittedFormData = {
        id: nextId,
        ...formData,
        submittedAt: new Date().toLocaleString()
      };

      // Add to the list of submissions (newest first)
      setSubmittedDataList(prev => [newSubmission, ...prev]);
      setNextId(prev => prev + 1);

      // Clear form data and reset states
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setIsSubmitting(false);
    }, 1500);
  }, [formData, nextId]);

  // Delete specific submission by ID
  const handleDeleteSubmission = useCallback((id: number) => {
    setSubmittedDataList(prev => prev.filter(submission => submission.id !== id));
  }, []);

  // Delete all submissions
  const handleDeleteAll = useCallback(() => {
    setSubmittedDataList([]);
  }, []);

  // Calculate submission statistics using useMemo for performance
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
        Contact Form
        <span className="pattern-badge">Forms</span>
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        Controlled components with validation and multiple data persistence
      </p>

      {/* Side-by-side layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left side - Form */}
        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
            📝 Submit Message
          </h4>

          {isSubmitting && (
            <div className="mb-4 p-3 rounded text-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <div className="status-loading">📤 Sending...</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
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
                placeholder="Your email"
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
                placeholder="Your message"
                className="textarea"
                disabled={isSubmitting}
              />
              {errors.message && <div className="error">{errors.message}</div>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>

        {/* Right side - Submitted Data Display */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              📋 Message History
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
                🗑️ Clear All
              </Button>
            )}
          </div>

          {/* Modern Statistics Cards */}
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
                  Total Messages
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
                  Unique Senders
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
                  Avg Length
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
                  {/* Modern message header with gradient badge */}
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
                          ✨ Latest
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

                  {/* Enhanced submission data with better typography */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          👤 SENDER
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
                          📧 EMAIL
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
                          💬 MESSAGE
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1'
                          }}
                        >
                          {submission.message.length} chars
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

                    {/* Modern timestamp with icon */}
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
              {/* Modern empty state */}
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
                No Messages Yet
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Submit your first message using the form<br />
                to see it beautifully displayed here!
              </p>
              <div
                className="inline-block mt-4 px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}
              >
                ✨ Ready for your first message
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================
// PATTERN 7: Context API (Global State)
// =====================================

/*
🎯 KEY TAKEAWAYS:
• Context API eliminates "prop drilling" (passing props through many levels)
• Create context with createContext, provide with Provider, consume with useContext
• Only use context for truly global state (theme, user auth, language)
• Don't overuse context - local state is often better
• Always check if context exists before using it
*/

// ❌ BAD: Prop drilling nightmare - passing props through every level
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

// ✅ GOOD: Context API eliminates prop drilling
// 🐍 Python: Like a global variable, but better managed
// Note: The actual implementation is now in src/contexts/ThemeContext.tsx for better organization

function ThemeToggle() {
  // Using the custom hook from our contexts folder
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="widget">
      <h3>
        <span className="widget-icon">🎨</span>
        Theme Switcher
        <span className="pattern-badge">Context API</span>
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        Global state without prop drilling
      </p>
      <div className="text-center">
        <div className="text-xl mb-4">
          Current theme: <strong>{theme}</strong>
        </div>
        <Button onClick={toggleTheme}>
          Switch to {theme === 'light' ? '🌙 Dark' : '☀️ Light'} mode
        </Button>
      </div>
    </div>
  );
}

// =====================================
// PATTERN 8: Custom Hooks & Performance -- useMemo
// =====================================

/*
🎯 KEY TAKEAWAYS:
• Custom hooks extract reusable stateful logic between components
• useMemo prevents expensive calculations on every render
• Only memoize when you have actual performance problems
• Custom hooks follow the same rules as built-in hooks
• Hooks must start with "use" and only be called at top level
• localStorage integration is a perfect use case for custom hooks
*/

// Custom hook - reusable logic
// Note: The actual implementation is now in src/hooks/useLocalStorage.ts for better organization

function NotesWidget() {
  const [notes, setNotes] = useLocalStorage<string[]>('tutorial-notes', []);
  const [newNote, setNewNote] = useState('');

  // ❌ BAD: Expensive calculation runs on every render (even when notes don't change)
  // const noteStats = {
  //   total: notes.length,
  //   long: notes.filter(note => note.length > 10).length,
  //   avgLength: notes.reduce((sum, note) => sum + note.length, 0) / notes.length
  // };
  // console.log('📊 Calculating note statistics...'); // This runs on EVERY render!

  // ✅ GOOD: useMemo only recalculates when notes change
  // 🐍 Python: Like @lru_cache decorator
  const noteStats = useMemo(() => {
    console.log('📊 Calculating note statistics...'); // You'll only see this when notes change
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
        Smart Notes
        <span className="pattern-badge">Custom Hooks</span>
      </h3>

      <div className="grid grid-cols-3 gap-2 text-center p-3 rounded mb-4" style={{
        background: 'var(--muted)'
      }}>
        <div>
          <div className="font-bold">{noteStats.total}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Notes</div>
        </div>
        <div>
          <div className="font-bold">{noteStats.long}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Long</div>
        </div>
        <div>
          <div className="font-bold">{noteStats.avgLength}</div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Avg chars</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="input flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
          />
          <Button onClick={addNote}>Add</Button>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-center p-4" style={{
            color: 'var(--muted-foreground)'
          }}>
            No notes yet. Add one above!
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
            Clear All Notes
          </Button>
        </div>
      )}
    </div>
  );
}

// =====================================
// SECTION COMPONENT FOR ORGANIZATION
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
// MAIN DASHBOARD COMPONENT
// =====================================

function DashboardContent() {
  // Using the custom hook from our contexts folder
  const { theme } = useTheme();

  return (
    <div className={`dashboard-center ${theme}`}>
      {/* Foundation Patterns */}

      <Section
        number={1}
        title="State Management"
        description="useState + useEffect - The foundation of React components"
      >
        <Counter />
        <NestedStateManager />
        <Clock />
      </Section>

      <Section
        number={2}
        title="Component Architecture"
        description="Props & Composition - Building reusable components"
      >
        <ButtonShowcase />
      </Section>

      <Section
        number={3}
        title="Conditional Rendering"
        description="Showing the right content at the right time (Loading states, error states, feature flags)"
      >
        <UserProfile />
      </Section>

      <Section
        number={4}
        title="Data Display"
        description="List Rendering & Keys - Efficiently displaying arrays of data"
      >
        <TodoList />
      </Section>

      <Section
        number={5}
        title="User Interaction"
        description="Event Handling & Forms - Managing user input and validation"
      >
        <ContactForm />
      </Section>

      <Section
        number={6}
        title="Global State"
        description="Context API - Sharing state across components without prop drilling - useCallback"
      >
        <ThemeToggle />
      </Section>

      <Section
        number={7}
        title="Advanced Patterns"
        description="Custom Hooks & Performance - Reusable logic and optimization"
      >
        <NotesWidget />
      </Section>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
} 