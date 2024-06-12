import torch
import torchaudio
import logging
import librosa
import numpy as np
from PDmodel.model import CNNLSTM  # Import the CNNLSTM class

class AudioInferenceService:
    def __init__(self, model_path, device='cpu'):
        self.device = device
        self.model = self.load_model(model_path)
        self.model.to(self.device)
        self.model.eval()
        logging.info("Successfully loaded the inference model.")

    def load_model(self, model_path):
        # Instantiate your model architecture with the correct number of classes
        model = CNNLSTM(n_mfcc=40, num_classes=2)  # Adjust n_mfcc as needed
        # Load the model state dictionary
        map_location = torch.device(self.device)
        state_dict = torch.load(model_path, map_location=map_location)
        model.load_state_dict(state_dict)
        return model

    def extract_features(self, waveform, sample_rate, n_mfcc=40):
        # Extract MFCC features
        mfcc = librosa.feature.mfcc(y=waveform.numpy(), sr=sample_rate, n_mfcc=n_mfcc)
        return torch.tensor(mfcc, dtype=torch.float32)

    def segment_audio(self, waveform, segment_length, overlap):
        step = segment_length - overlap
        segments = []
        for start in range(0, waveform.size(1) - segment_length + 1, step):
            segment = waveform[:, start:start + segment_length]
            segments.append(segment)
        return segments

    def process_audio(self, audio_path: str):
        predicted_labels = []

        # Load the audio file
        waveform, sample_rate = torchaudio.load(audio_path)

        # Resample if necessary
        target_sample_rate = 16000
        if sample_rate != target_sample_rate:
            waveform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=target_sample_rate)(waveform)
            sample_rate = target_sample_rate

        # Segment the audio file
        segment_length_sec = 1
        overlap_perc = 0.4
        segment_length = int(sample_rate * segment_length_sec)
        overlap = int(segment_length * overlap_perc)

        segments = self.segment_audio(waveform, segment_length, overlap)

        self.model.eval()
        with torch.no_grad():
            for segment in segments:
                features = self.extract_features(segment, sample_rate)
                features = features.unsqueeze(0).to(self.device)  # Add batch dimension and move to device
                prediction = self.model(features)
                predicted_class = torch.argmax(prediction, dim=1)
                predicted_label = predicted_class.item()
                predicted_labels.append(predicted_label)

        overall_prediction = max(set(predicted_labels), key=predicted_labels.count)
        return predicted_labels, overall_prediction
