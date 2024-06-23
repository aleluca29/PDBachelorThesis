import os
import torch
import torchaudio
import torchaudio.transforms as T
from torch.utils.data import Dataset
import torch.nn as nn

class AudioDataset(Dataset):
    def __init__(self, dataset_base_path, categories=None, start_seconds=None, segment_length_sec=1, overlap_perc=0.4,
                 target_sample_rate=16000, n_mfcc=40, n_mels=64, n_fft=400, augmentation=True):
        self.segments = []
        self.labels = []
        self.subject_ids = []
        self.segment_length_sec = segment_length_sec
        self.overlap_perc = overlap_perc
        self.target_sample_rate = target_sample_rate
        self.n_mfcc = n_mfcc
        self.augmentation = augmentation

        self.mfcc_transform = T.MFCC(sample_rate=target_sample_rate, n_mfcc=n_mfcc, melkwargs={'n_mels': n_mels, 'n_fft': n_fft})
        self.augment_transform = nn.Sequential(
            T.FrequencyMasking(freq_mask_param=15),
            T.TimeMasking(time_mask_param=35)
        )

        if os.path.isfile(dataset_base_path):
            self._initialize_for_prediction(dataset_base_path)
        elif categories and start_seconds:
            self._initialize_for_training(dataset_base_path, categories, start_seconds)

    def _initialize_for_prediction(self, file_path):
        waveform, original_rate = torchaudio.load(file_path)
        if original_rate != self.target_sample_rate:
            resample_transform = T.Resample(orig_freq=original_rate, new_freq=self.target_sample_rate)
            waveform = resample_transform(waveform)
        total_frames = waveform.size(1)
        segment_length = int(self.segment_length_sec * self.target_sample_rate)
        segment_step = int(segment_length * (1 - self.overlap_perc))

        for start in range(0, total_frames, segment_step):
            if start + segment_length <= total_frames:
                self.segments.append((file_path, start, segment_length))
                self.labels.append(None)

    def _initialize_for_training(self, dataset_base_path, categories, start_seconds):
        for category in categories:
            category_path = os.path.join(dataset_base_path, category)
            for section in ['HC', 'PD']:
                section_path = os.path.join(category_path, section)
                for recording_id, start_second in start_seconds[category][section].items():
                    filepath = os.path.join(section_path, recording_id)
                    if os.path.exists(filepath):
                        metadata = self._parse_filename_metadata(recording_id)
                        waveform, original_rate = torchaudio.load(filepath)
                        start_frame = int(start_second * original_rate)
                        total_frames = waveform.size(1) - start_frame
                        segment_length = int(self.segment_length_sec * original_rate)
                        segment_step = int(segment_length * (1 - self.overlap_perc))

                        for start in range(start_frame, total_frames, segment_step):
                            if start + segment_length <= total_frames:
                                self.segments.append((filepath, start, segment_length))
                                self.subject_ids.append(metadata['subject_id'])
                                self.labels.append(metadata['health_status'])

    def _parse_filename_metadata(self, filename):
        parts = filename.split('_')
        return {'subject_id': parts[0], 'health_status': parts[1].lower()}

    def __len__(self):
        return len(self.segments)

    def __getitem__(self, idx):
        filepath, segment_start, segment_length = self.segments[idx]
        waveform, original_rate = torchaudio.load(filepath, frame_offset=segment_start, num_frames=segment_length)

        if original_rate != self.target_sample_rate:
            resample_transform = T.Resample(orig_freq=original_rate, new_freq=self.target_sample_rate)
            waveform = resample_transform(waveform)

        mfcc = self.mfcc_transform(waveform)
        features = mfcc

        if self.augmentation and self.labels[idx] is not None:
            features = self.augment_transform(features)

        features = (features - features.mean()) / features.std()

        if self.labels[idx] is not None:
            label = 0 if self.labels[idx] == 'hc' else 1
            return features, torch.tensor(label, dtype=torch.long)
        else:
            return features, torch.tensor(-1, dtype=torch.long)
