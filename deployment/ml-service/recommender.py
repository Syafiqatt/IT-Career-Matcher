"""
Modul inferensi Sistem Rekomendasi Karir IT.

Memuat artefak model (`career_recommender_model.joblib`) dan menyediakan fungsi
`recommend_career()` yang mengembalikan Top-N rekomendasi karir + skor.

Dipakai oleh aplikasi Streamlit atau service lain:

    from recommender import recommend_career, get_vocab
    hasil = recommend_career(skills=['python', 'sql'], years_code=4, top_n=3)
"""
import os
import numpy as np
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), "career_recommender_model.joblib")
_artifact = None


def load_artifact():
    global _artifact

    if _artifact is None:
        print("=== load_artifact: start ===", flush=True)
        print(f"=== model path: {MODEL_PATH} ===", flush=True)
        print(f"=== file exists: {os.path.exists(MODEL_PATH)} ===", flush=True)

        if os.path.exists(MODEL_PATH):
            print(f"=== file size: {os.path.getsize(MODEL_PATH)} bytes ===", flush=True)

        print("=== before joblib.load ===", flush=True)

        _artifact = joblib.load(MODEL_PATH)

        print("=== after joblib.load ===", flush=True)
        print(f"=== artifact type: {type(_artifact)} ===", flush=True)

        if isinstance(_artifact, dict):
            print(f"=== artifact keys: {list(_artifact.keys())} ===", flush=True)

    return _artifact

def get_vocab():
    """Kembalikan daftar opsi valid untuk UI (skills, tools, databases, kelas karir).

    Berguna untuk mengisi widget multiselect di Streamlit agar input user
    konsisten dengan yang dikenal model.
    """
    art = load_artifact()
    enc = art["mlb_encoders"]
    return {
        "skills": list(enc["all_skills"].classes_),
        "tools": list(enc["tools"].classes_),
        "databases": list(enc["databases"].classes_),
        "careers": list(art["idx_to_class"].values()),
    }


def _vectorize_profile(skills, tools, databases, years_code, education_level):
    """Ubah profil mentah -> vektor fitur sesuai encoder yang sudah di-fit.

    Token yang tidak dikenal model otomatis diabaikan (tidak error).
    """
    art = load_artifact()
    enc = art["mlb_encoders"]
    scaler = art["scaler"]
    multi_cols = art["multi_cols"]

    raw = {"all_skills": skills, "tools": tools, "databases": databases}
    blocks = []
    for col in multi_cols:
        known = set(enc[col].classes_)
        toks = [t.strip().lower() for t in (raw[col] or []) if t.strip()]
        toks = [t for t in toks if t in known]  # abaikan token asing
        blocks.append(enc[col].transform([toks]))
    x_multi = np.hstack(blocks)
    x_num = scaler.transform([[years_code, education_level]])
    return np.hstack([x_multi, x_num]).astype(np.float32)


def recommend_career(skills, tools=None, databases=None, years_code=5,
                     education_level=2, top_n=3):
    """Rekomendasikan Top-N karir IT untuk sebuah profil.

    Parameters
    ----------
    skills : list[str]      mis. ['python', 'sql', 'docker']
    tools : list[str]       mis. ['visual studio code']
    databases : list[str]   mis. ['postgresql']
    years_code : float      lama pengalaman koding (tahun)
    education_level : int   level pendidikan (skala dataset: 0-6)
    top_n : int             jumlah rekomendasi

    Returns
    -------
    list[dict]  -> [{'rank', 'career', 'score'}, ...]
    """
    art = load_artifact()
    model = art["model"]
    idx_to_class = art["idx_to_class"]

    x = _vectorize_profile(skills, tools or [], databases or [],
                           years_code, education_level)
    proba = model.predict_proba(x)[0]
    top_idx = proba.argsort()[::-1][:top_n]
    return [{"rank": r + 1,
             "career": idx_to_class[i],
             "score": round(float(proba[i]), 4)}
            for r, i in enumerate(top_idx)]


if __name__ == "__main__":
    # Smoke test cepat
    print("Model:", load_artifact()["model_name"])
    demo = recommend_career(
        skills=["python", "sql", "tensorflow", "pytorch", "pandas"],
        tools=["jupyter notebook"], databases=["postgresql"],
        years_code=4, education_level=3, top_n=3)
    for r in demo:
        print(r)
