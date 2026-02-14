import logging
import traceback
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnaliseRequest(BaseModel):
    texto: str = Field(..., min_length=5, max_length=15000)
    api_key: str = Field(..., min_length=10, max_length=100)

@app.get("/")
@app.head("/")
async def root():
    return {"status": "API Jiukind Online e Operante"}

@app.post("/analisar-dia")
async def analisar_dia(request: AnaliseRequest, req: Request):
    client_ip = req.client.host
    logger.info(f"Nova requisicao de analise recebida. IP: {client_ip}")

    texto_limpo = request.texto.strip()
    chave_limpa = request.api_key.strip()
    
    modelos_fallback = [
        "gemini-3.5-flash",
        "gemini-3.0-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash"
    ]

    try:
        client = genai.Client(api_key=chave_limpa)
        prompt = f"Analise os seguintes dados do dia do usuário. Forneça um resumo identificando o humor predominante, o nível de produtividade e possíveis pontos de atenção ou melhoria. Seja direto e estruturado. Dados do dia: {texto_limpo}"

        for modelo in modelos_fallback:
            logger.info(f"Testando execucao com o modelo: {modelo}")
            try:
                response = client.models.generate_content(
                    model=modelo,
                    contents=prompt
                )
                logger.info(f"Analise concluida com sucesso utilizando: {modelo}")
                
                return {
                    "analise": response.text.strip(),
                    "modelo_utilizado": modelo
                }
            
            except Exception as model_error:
                logger.warning(f"Rejeicao no modelo {modelo}: {str(model_error)}")
                continue
        
        logger.error("Falha critica: A arvore de fallback esgotou todos os modelos.")
        raise HTTPException(status_code=500, detail="Nenhum modelo Gemini processou a requisicao. Verifique a validade da sua API Key.")

    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Erro inesperado no servidor: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Falha interna grave no servidor de processamento.")