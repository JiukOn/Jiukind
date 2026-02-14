import logging
import traceback
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from gemini_analist import construir_prompt

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
    api_key: str = Field(..., min_length=10, max_length=150)
    humor_geral: int = Field(..., ge=1, le=6)
    humor_pessoas: int = Field(..., ge=1, le=6)
    humor_atividades: int = Field(..., ge=1, le=6)
    humor_obrigacoes: int = Field(..., ge=1, le=6)
    relato_dia: str = Field(..., max_length=15000)
    relato_sentimentos: str = Field(..., max_length=15000)

@app.get("/")
@app.head("/")
async def root():
    return {"status": "API Jiukind Online e Operante"}

@app.post("/analisar-dia")
async def analisar_dia(request: AnaliseRequest, req: Request):
    client_ip = req.client.host
    logger.info(f"Nova requisicao de analise recebida. IP: {client_ip}")

    chave_limpa = request.api_key.strip()
    
    modelos_fallback = [
        "gemini-3.5-flash",
        "gemini-3.0-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash"
    ]

    prompt = construir_prompt(request)

    try:
        client = genai.Client(api_key=chave_limpa)

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