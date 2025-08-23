import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Nest-Ed</h1>
      <p>Your AI-powered learning assistant is here.</p>
      <button
        style={{
          background: '#4F46E5',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
        onClick={() => router.push('/chat')}
      >
        Try Chat
      </button>
    </div>
  );
}

