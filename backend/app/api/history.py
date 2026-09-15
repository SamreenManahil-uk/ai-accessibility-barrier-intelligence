import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse


router = APIRouter(
    prefix="/api/v1",
    tags=["History"],
)


def to_response(analysis: Analysis) -> AnalysisResponse:
    return AnalysisResponse(
        id=analysis.id,
        image_name=analysis.image_name,
        detections=json.loads(analysis.detections_json),
        risk_level=analysis.risk_level,
        risk_score=analysis.risk_score,
        reasons=json.loads(analysis.reasons_json),
        created_at=analysis.created_at,
    )


@router.get(
    "/analyses",
    response_model=list[AnalysisResponse],
)
def list_analyses(
    db: Session = Depends(get_db),
):
    statement = select(Analysis).order_by(
        Analysis.created_at.desc()
    )

    analyses = db.scalars(statement).all()

    return [
        to_response(analysis)
        for analysis in analyses
    ]


@router.get(
    "/analyses/{analysis_id}",
    response_model=AnalysisResponse,
)
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = db.get(
        Analysis,
        analysis_id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    return to_response(analysis)
