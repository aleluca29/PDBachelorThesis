from pydantic import BaseModel

class PredictionResponseDTO(BaseModel):
    predicted_labels: dict
    overall_prediction: str
