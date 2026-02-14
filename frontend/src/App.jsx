import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [humorGeral, setHumorGeral] = useState(4);
  const [humorPessoas, setHumorPessoas] = useState(4);
  const [humorAtividades, setHumorAtividades] = useState(4);
  const [humorObrigacoes, setHumorObrigacoes] = useState(4);
  const [relatoDia, setRelatoDia] = useState('');
  const [relatoSentimentos, setRelatoSentimentos] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const emojis = [
    { valor: 1, icone: '😡', label: 'Bravo' },
    { valor: 2, icone: '😢', label: 'Triste' },
    { valor: 3, icone: '😩', label: 'Cansado' },
    { valor: 4, icone: '😐', label: 'Neutro' },
    { valor: 5, icone: '🙂', label: 'Feliz' },
    { valor: 6, icone: '🤩', label: 'Radiante' },
  ];

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
    if (!apiKey.trim() || !relatoDia.trim() || !relatoSentimentos.trim()) {
      setErro('Por favor, preencha a API Key e as duas caixas de texto de relato.');
      return;
    }
    
    setErro('');
    setResultado('');
    setLoading(true);
    
    try {
      const res = await axios.post('https://jiukind-api.onrender.com/analisar-dia', {
        api_key: apiKey,
        humor_geral: humorGeral,
        humor_pessoas: humorPessoas,
        humor_atividades: humorAtividades,
        humor_obrigacoes: humorObrigacoes,
        relato_dia: relatoDia,
        relato_sentimentos: relatoSentimentos
      });
      setResultado(res.data.analise);
    } catch (error) {
      setErro('Erro ao processar a análise. Verifique sua API Key e a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const RenderEmojiSelector = ({ label, stateValue, stateSetter }) => (
    <div style={{ marginBottom: '32px' }}>
      <label style={{ display: 'block', marginBottom: '16px', fontSize: '16px', fontWeight: '500', color: '#4b5563', textAlign: 'left' }}>
        {label}
      </label>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(6, 1fr)', 
        gap: '12px',
        width: '100%'
      }}>
        {emojis.map((emoji) => (
          <button
            key={emoji.valor}
            onClick={() => stateSetter(emoji.valor)}
            style={{
              padding: '16px 8px',
              backgroundColor: stateValue === emoji.valor ? '#f0f4ff' : '#ffffff',
              border: stateValue === emoji.valor ? '2px solid #6366f1' : '1px solid #e5e7eb',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease-in-out',
              boxShadow: stateValue === emoji.valor ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none',
              transform: stateValue === emoji.valor ? 'translateY(-2px)' : 'none',
            }}
          >
            <span style={{ fontSize: '32px' }}>{emoji.icone}</span>
            <span style={{ 
              fontSize: '11px', 
              color: stateValue === emoji.valor ? '#4338ca' : '#6b7280', 
              fontWeight: stateValue === emoji.valor ? '700' : '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {emoji.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
      backgroundSize: '30px 30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '850px',
        backgroundColor: '#ffffff',
        borderRadius: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)',
        padding: '60px',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        <header style={{ marginBottom: '50px' }}>
          <h1 style={{
            margin: '0 0 12px 0',
            color: '#1e293b',
            fontSize: '36px',
            fontWeight: '800',
            letterSpacing: '-1px'
          }}>
            Jiukind
          </h1>
          <p style={{ color: '#64748b', fontSize: '18px', margin: 0, fontWeight: '400' }}>
            Seu diário inteligente de acolhimento emocional.
          </p>
        </header>
        
        <section style={{ 
          marginBottom: '50px', 
          backgroundColor: '#f1f5f9', 
          padding: '24px', 
          borderRadius: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
              Configuração Gemini
            </span>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '13px', color: '#4f46e5', textDecoration: 'underline', fontWeight: '600' }}
            >
              Obter API Key gratuita ↗
            </a>
          </div>
          <input 
            type="password" 
            placeholder="Insira sua Google API Key..." 
            value={apiKey} 
            onChange={handleSaveKey} 
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: '12px', 
              border: '2px solid #cbd5e1',
              boxSizing: 'border-box',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#ffffff'
            }}
          />
        </section>

        <section style={{ marginBottom: '50px' }}>
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ color: '#1e293b', fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0' }}>Estado Emocional</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Selecione o emoji que melhor representa cada área.</p>
          </div>
          
          <RenderEmojiSelector label="De forma geral, como você se sente hoje?" stateValue={humorGeral} stateSetter={setHumorGeral} />
          <RenderEmojiSelector label="Em relação às pessoas ao seu redor?" stateValue={humorPessoas} stateSetter={setHumorPessoas} />
          <RenderEmojiSelector label="Em relação às suas atividades e lazer?" stateValue={humorAtividades} stateSetter={setHumorAtividades} />
          <RenderEmojiSelector label="Em relação às suas obrigações e trabalho?" stateValue={humorObrigacoes} stateSetter={setHumorObrigacoes} />
        </section>

        <section style={{ marginBottom: '50px', textAlign: 'left' }}>
          <h3 style={{ color: '#1e293b', fontSize: '22px', fontWeight: '700', margin: '0 0 32px 0' }}>Escrita Terapêutica</h3>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#334155' }}>
              Relate o seu dia:
            </label>
            <textarea 
              placeholder="O que aconteceu de importante hoje?" 
              value={relatoDia} 
              onChange={(e) => setRelatoDia(e.target.value)} 
              rows={4}
              style={{ 
                width: '100%', 
                padding: '20px', 
                borderRadius: '16px', 
                border: '2px solid #e2e8f0',
                boxSizing: 'border-box',
                fontSize: '16px',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.6'
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#334155' }}>
              Divague sobre seus sentimentos:
            </label>
            <textarea 
              placeholder="Como você processou essas experiências internamente?" 
              value={relatoSentimentos} 
              onChange={(e) => setRelatoSentimentos(e.target.value)} 
              rows={5}
              style={{ 
                width: '100%', 
                padding: '20px', 
                borderRadius: '16px', 
                border: '2px solid #e2e8f0',
                boxSizing: 'border-box',
                fontSize: '16px',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.6'
              }}
            />
          </div>
        </section>

        {erro && (
          <div style={{ 
            marginBottom: '32px', 
            padding: '20px', 
            backgroundColor: '#fff1f2', 
            color: '#be123c', 
            borderRadius: '16px', 
            fontSize: '15px',
            border: '1px solid #fda4af',
            fontWeight: '600'
          }}>
            ⚠️ {erro}
          </div>
        )}

        <button 
          onClick={analisarDia} 
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '20px', 
            backgroundColor: loading ? '#94a3b8' : '#1e293b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}
        >
          {loading ? 'Processando dados...' : 'Gerar Análise Profunda'}
        </button>

        {resultado && (
          <div style={{ 
            marginTop: '50px', 
            padding: '40px', 
            backgroundColor: '#ffffff', 
            borderTop: '6px solid #6366f1',
            borderRadius: '20px',
            color: '#334155',
            fontSize: '17px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
          }}>
            {resultado}
          </div>
        )}
      </div>
      <footer style={{ marginTop: '40px', color: '#94a3b8', fontSize: '14px' }}>
        Jiukind © 2026 - Sua saúde mental importa.
      </footer>
    </div>
  );
}