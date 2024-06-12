import os
import logging
from collections import Counter
import torch

import aiofiles
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse

from dto.pdDto import PredictionResponseDTO
from services.pdService import AudioInferenceService

router = APIRouter()

model_path = 'PDmodel/trainedmodel/best_model.pth'
inference_service = AudioInferenceService(model_path, device='cuda' if torch.cuda.is_available() else 'cpu')

@router.post("/pd/predict", response_model=PredictionResponseDTO)
async def predict(audio: UploadFile = File(...)):
    try:
        async with aiofiles.tempfile.NamedTemporaryFile("wb", delete=False) as temp:
            try:
                contents = await audio.read()
                await temp.write(contents)
                temp_path = temp.name
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"There was an error uploading the file: {str(e)}")

        predicted_labels, overall_prediction = await run_in_threadpool(inference_service.process_audio, temp_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing audio: {str(e)}")
    finally:
        os.remove(temp_path)

    predicted_labels = dict(Counter(predicted_labels).most_common())
    return PredictionResponseDTO(predicted_labels=predicted_labels, overall_prediction=overall_prediction)
