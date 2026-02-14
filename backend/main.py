from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnaliseRequest(BaseModel):
    texto: str
    api_key: str

@app.get("/")
async def root():
    return {"status": "API Jiukind Online e Operante"}

@app.post("/analisar-dia")
async def analisar_dia(request: AnaliseRequest):
    try:
        client = genai.Client(api_key=request.api_key)
        
        prompt = f"Analise os seguintes dados do dia do usuário. Forneça um resumo identificando o humor predominante, o nível de produtividade e possíveis pontos de atenção ou melhoria. Seja direto e estruturado. Dados do dia: {request.texto}"
        
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt
        )
        
        return {"analise": response.text.strip()}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))