import torch
import torchaudio

from train.predict import main_predict
from train.train import main_train
import sounddevice as sd


def record_audio(output_path, duration=30, sample_rate=16000):

    print(f"Recording for {duration} seconds...")
    recording = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1)
    sd.wait()
    waveform = torch.tensor(recording, dtype=torch.float32).t()
    torchaudio.save(output_path, waveform, sample_rate)
    print(f"Recording saved to {output_path}")

def main():
    choice = input("Enter 'train' to train the model or 'predict' to make a prediction: ").strip().lower()

    if choice == 'train':
        main_train()
    elif choice == 'predict':
        output_path = 'recording.wav'
        record_audio(output_path, duration=30)
        predictions, overall_prediction = main_predict(output_path)
        print(f"Segment predictions: {predictions}")
        print(f"Overall prediction: {'HC' if overall_prediction == 0 else 'PD'}")
    else:
        print("Invalid choice. Please enter 'train' or 'predict'.")

if __name__ == "__main__":
    main()