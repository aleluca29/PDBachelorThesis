import os
import torch
from torch.utils.data import DataLoader
from data.audio_dataset import AudioDataset
from models.pd_classification import PDClassification


def predict(model, file_path, segment_length_sec=1, overlap_perc=0.4, target_sample_rate=16000, n_mfcc=40):
    if not os.path.exists(file_path):
        raise ValueError(f"The file {file_path} does not exist.")

    dataset = AudioDataset(file_path, segment_length_sec=segment_length_sec, overlap_perc=overlap_perc,
                           target_sample_rate=target_sample_rate, n_mfcc=n_mfcc, augmentation=False)
    data_loader = DataLoader(dataset, batch_size=1, shuffle=False)

    model.eval()
    predictions = []

    total_frames = len(dataset) * int(segment_length_sec * target_sample_rate)
    segment_length = int(segment_length_sec * target_sample_rate)
    segment_step = int(segment_length * (1 - overlap_perc))
    total_segments = len(dataset)

    print(f"Total frames: {total_frames}")
    print(f"Segment length: {segment_length} frames ({segment_length_sec} second segments)")
    print(f"Segment step: {segment_step} frames ({overlap_perc * 100}% overlap)")
    print(f"Total segments created: {total_segments}")

    with torch.no_grad():
        for i, (data, _) in enumerate(data_loader):
            data = data.to(model.device)
            output = model(data)
            pred = output.argmax(dim=1, keepdim=True)
            predictions.append(pred.item())
            print(f"Segment {i + 1} prediction: {pred.item()}")

    overall_prediction = max(set(predictions), key=predictions.count)
    return predictions, overall_prediction


def main_predict(file_path):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PDClassification(n_mfcc=40, num_classes=2).to(device)
    model.load_state_dict(torch.load('./best_model.pth', map_location=device))
    model.device = device

    predictions, overall_prediction = predict(model, file_path, segment_length_sec=1)
    return predictions, overall_prediction
