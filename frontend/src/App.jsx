import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [textoDia, setTextoDia] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveKey = (e) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  const analisarDia = async () => {
    if (!apiKey || !textoDia) return;
    setLoading(true);
    
    try {
      const res = await axios.post('http://127.0.0.1:8000/analisar-dia', {
        texto: textoDia,
        api_key: apiKey
      });
      setResultado(res.data.analise);
    } catch (error) {
      setResultado('Erro ao processar a análise. Verifique sua API Key e conexão.');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Análise do Meu Dia (BYOK)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="password" 
          placeholder="Insira sua API Key do Google Gemini" 
          value={apiKey} 
          onChange={handleSaveKey} 
          style={{ width: '100%', padding: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <textarea 
          placeholder="Descreva como foi seu dia, o que você fez, como se sentiu..." 
          value={textoDia} 
          onChange={(e) => setTextoDia(e.target.value)} 
          rows={6}
          style={{ width: '100%', padding: '10px' }}
        />
      </div>

      <button 
        onClick={analisarDia} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        {loading ? 'Analisando...' : 'Gerar Análise'}
      </button>

      {resultado && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>
          {resultado}
        </div>
      )}
    </div>
  );
}