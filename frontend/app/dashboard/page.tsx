'use client';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3001/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return alert('パスワードを入力してください'); // 簡易チェック

    setLoading(true);
    try {
      await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }), // ← ここに password を追加！
      });

      // 登録後は入力をリセット
      setName('');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (error) {
      console.error('登録エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, userName: string) => {
    if (confirm(`${userName}さんを削除しますか？`)) {
      await fetch(`http://localhost:3001/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">

        {/* ヘッダー部分 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">User Manager</h1>
          <p className="mt-2 text-sm text-gray-600">フルスタック連携アプリのデモ</p>
        </div>

        {/* 登録フォームのカード */}
        <div className="bg-white p-8 rounded-xl shadow-md mb-10 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">新規登録</h2>
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* 【対策1】ブラウザの身代わりになる隠し入力欄（これに自動入力させる） */}
            <input type="text" name="fake-user" style={{ display: 'none' }} />
            <input type="password" name="fake-pass" style={{ display: 'none' }} />

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase">Name</label>
              <input
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="山田 太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="none" // 【対策2】"off" ではなく "none" やランダムな文字列にする
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase">Email Address</label>
              <input
                type="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="new-email" // 【対策3】"new-email" と指定
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase">Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password" // 【対策3】"new-password" は強力な指定です
              />
            </div>

            <button type="submit">
              ユーザーを追加
            </button>
          </form>
        </div>

        {/* リスト部分 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <h2 className="text-lg font-semibold p-4 bg-gray-50 border-b text-gray-800">登録済みメンバー</h2>
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-400">データがありません</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {users.map((user) => (
                <li key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    className="p-2 text-gray-400 hover:text-red-500 transition duration-150"
                    title="削除"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
