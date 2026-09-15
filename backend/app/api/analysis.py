import json
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse
from app.services.ml_service import analyse_image


router = APIRouter(
    prefix="/api/v1",
    tags=["Analysis"],
)


PROJECT_ROOT = Path(__file__).resolve().parents[3]

UPLOAD_DIR = PROJECT_ROOT / "backend" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


@router.post(
    "/analyse",
    response_model=AnalysisResponse,
)
def analyse_uploaded_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG and WebP images are supported.",
        )

    extension = Path(file.filename or "image.jpg").suffix

    if not extension:
        extension = ".jpg"

    stored_name = f"{uuid.uuid4()}{extension}"

    stored_path = UPLOAD_DIR / stored_name

    try:
        with stored_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = analyse_image(str(stored_path))

        detections = result["detections"]
        risk = result["risk"]

        analysis = Analysis(
            image_name=file.filename or stored_name,
            risk_level=risk["risk_level"],
            risk_score=risk["risk_score"],
            detections_json=json.dumps(detections),
            reasons_json=json.dumps(risk["reasons"]),
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return AnalysisResponse(
            id=analysis.id,
            image_name=analysis.image_name,
            detections=detections,
            risk_level=analysis.risk_level,
            risk_score=analysis.risk_score,
            reasons=risk["reasons"],
            created_at=analysis.created_at,
        )

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Image analysis failed: {exc}",
        ) from exc

    finally:
        file.file.close()
