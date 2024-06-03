import os
import logging
import torch
from collections import Counter

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse

from services.pdService import AudioInferenceService  # Assuming the audio service is in this module

router = APIRouter()

# Initialize the inference service with the appropriate model path
model_path = 'PDmodel/trainedmodel/best_model.pth'
inference_service = AudioInferenceService(model_path, device='cuda' if torch.cuda.is_available() else 'cpu')


@router.post("/predict", response_model=dict)
async def predict(request: Request):
    try:
        async with aiofiles.tempfile.NamedTemporaryFile("wb", delete=False) as temp:
            try:
                contents = await request.body()
                await temp.write(contents)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"There was an error uploading the file: {str(e)}")

        predicted_labels, overall_prediction = await run_in_threadpool(inference_service.process_audio, temp.name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing audio: {str(e)}")
    finally:
        os.remove(temp.name)

    predicted_labels = dict(Counter(predicted_labels).most_common())
    return JSONResponse(content={"predicted_labels": predicted_labels, "overall_prediction": overall_prediction})