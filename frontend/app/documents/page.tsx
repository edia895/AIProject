'use client';
import { useState } from 'react';

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('ファイルを選択してください');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file); // バックエンドの 'file' という名前に合わせる

    try {
      const res = await fetch('http://localhost:3001/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('アップロードと解析が成功しました！');
      } else {
        setMessage('エラーが発生しました');
      }
    } catch (error) {
      console.error(error);
      setMessage('サーバーに接続できません');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AIドキュメント解析</h1>
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? '解析中...' : 'アップロードして解析'}
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
