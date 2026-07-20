"""
ML Microservice — Sistem Rekomendasi Karir IT (FastAPI).

Memuat model scikit-learn sekali, lalu melayani inferensi via HTTP.
Hanya dipanggil oleh backend Express (bukan langsung oleh frontend).

Jalankan:
    uvicorn app:app --host 127.0.0.1 --port 8000
"""
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from recommender import recommend_career, get_vocab, load_artifact

app = FastAPI(title="Career Recommender ML Service", version="1.0.0")


class ProfileRequest(BaseModel):
    skills: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    years_code: float = 5
    education_level: int = 2
    top_n: int = 3


class Recommendation(BaseModel):
    rank: int
    career: str
    score: float


class PredictResponse(BaseModel):
    model_name: str
    recommendations: List[Recommendation]


# MATIKAN DULU startup warmup ini
# @app.on_event("startup")
# def _warmup():
#     try:
#         print("=== Startup begin ===", flush=True)
#         print("=== About to load artifact ===", flush=True)
#         art = load_artifact()
#         print("=== Artifact loaded successfully ===", flush=True)
#         print(f"=== Model name: {art.get('model_name')} ===", flush=True)
#         print(f"=== Artifact keys: {list(art.keys())} ===", flush=True)
#     except Exception as e:
#         import traceback
#         print("=== MODEL ERROR ===", flush=True)
#         traceback.print_exc()
#         raise e


@app.get("/health")
def health():
    return {"status": "ok", "message": "ml service running"}


@app.get("/vocab")
def vocab():
    return get_vocab()


@app.post("/predict", response_model=PredictResponse)
def predict(req: ProfileRequest):
    try:
        print("=== /predict called ===", flush=True)
        print(f"skills={req.skills}", flush=True)
        print(f"tools={req.tools}", flush=True)
        print(f"databases={req.databases}", flush=True)
        print(f"years_code={req.years_code}", flush=True)
        print(f"education_level={req.education_level}", flush=True)
        print(f"top_n={req.top_n}", flush=True)

        print("=== before recommend_career ===", flush=True)

        recs = recommend_career(
            skills=req.skills,
            tools=req.tools,
            databases=req.databases,
            years_code=req.years_code,
            education_level=req.education_level,
            top_n=req.top_n,
        )

        print("=== after recommend_career ===", flush=True)

        art = load_artifact()
        print("=== after load_artifact for model_name ===", flush=True)

        return {
            "model_name": art["model_name"],
            "recommendations": recs
        }

    except Exception as e:
        import traceback
        print("=== /predict ERROR ===", flush=True)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
