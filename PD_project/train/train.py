import torch
from torch.utils.data import DataLoader, random_split
from data.audio_dataset import AudioDataset
from models.pd_classification import PDClassification

def train(model, device, train_loader, optimizer, criterion, epoch):
    model.train()
    correct = 0
    total = 0
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        pred = output.argmax(dim=1, keepdim=True)
        correct += pred.eq(target.view_as(pred)).sum().item()
        total += target.size(0)

        if batch_idx % 10 == 0:
            print(f'Train Epoch: {epoch} [{batch_idx * len(data)}/{len(train_loader.dataset)} '
                  f'({100. * batch_idx / len(train_loader):.0f}%)]\tLoss: {loss.item():.6f} '
                  f'\tAccuracy: {100. * correct / total:.2f}%')

def test(model, device, test_loader, criterion):
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            model.lstm.flatten_parameters()
            output = model(data)
            test_loss += criterion(output, target).item()
            pred = output.argmax(dim=1, keepdim=True)
            correct += pred.eq(target.view_as(pred)).sum().item()

    test_loss /= len(test_loader.dataset)
    accuracy = 100. * correct / len(test_loader.dataset)
    print(f'\nTest set: Average loss: {test_loss:.4f}, Accuracy: {correct}/{len(test_loader.dataset)} '
          f'({accuracy:.0f}%)\n')

    return test_loss, accuracy

class EarlyStopping:
    def __init__(self, patience=7, min_delta=0, path='checkpoint.pt', verbose=True):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = None
        self.early_stop = False
        self.path = path
        self.verbose = verbose

    def __call__(self, val_loss, model):
        if self.best_loss is None:
            self.best_loss = val_loss
            torch.save(model.state_dict(), self.path)
            if self.verbose:
                print(f'Initial model saved to {self.path}')
        elif val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0
            torch.save(model.state_dict(), self.path)
            if self.verbose:
                print(f'Validation loss decreased to {val_loss:.6f}, model saved to {self.path}')
        else:
            self.counter += 1
            if self.verbose:
                print(f'EarlyStopping counter: {self.counter} out of {self.patience}')
            if self.counter >= self.patience:
                self.early_stop = True

def main_train():
    dataset_base_path = './dataset'
    categories = ['ReadText', 'SpontaneousDialogue']
    start_seconds = {
        'ReadText': {
            'HC': {
                'ID00_hc_0_0_0.wav': 16,
                'ID01_hc_0_0_0.wav': 26,
                'ID03_hc_0_0_0.wav': 25,
                'ID05_hc_0_0_0.wav': 21,
                'ID08_hc_0_0_0.wav': 26,
                'ID09_hc_0_0_0.wav': 26,
                'ID10_hc_0_0_0.wav': 29,
                'ID11_hc_0_0_0.wav': 29,
                'ID12_hc_0_0_0.wav': 27,
                'ID14_hc_0_0_0.wav': 32,
                'ID15_hc_0_0_0.wav': 25,
                'ID19_hc_0_0_0.wav': 25,
                'ID21_hc_0_0_0.wav': 28,
                'ID22_hc_0_0_0.wav': 26,
                'ID23_hc_0_0_0.wav': 23,
                'ID25_hc_0_0_0.wav': 24,
                'ID26_hc_0_0_0.wav': 24,
                'ID28_hc_0_0_0.wav': 25,
                'ID31_hc_0_1_1.wav': 23,
                'ID35_hc_0_0_0.wav': 31,
                'ID36_hc_0_0_0.wav': 37,
            },
            'PD': {
                'ID02_pd_2_0_0.wav': 23,
                'ID04_pd_2_0_1.wav': 38,
                'ID06_pd_3_1_1.wav': 31,
                'ID07_pd_2_0_0.wav': 23,
                'ID13_pd_3_2_2.wav': 34,
                'ID16_pd_2_0_0.wav': 35,
                'ID17_pd_2_1_0.wav': 44,
                'ID18_pd_4_3_3.wav': 23,
                'ID20_pd_3_0_1.wav': 24,
                'ID24_pd_2_0_0.wav': 30,
                'ID27_pd_4_1_1.wav': 25,
                'ID29_pd_3_1_2.wav': 25,
                'ID30_pd_2_1_1.wav': 14,
                'ID32_pd_3_1_1.wav': 13,
                'ID33_pd_3_2_2.wav': 26,
                'ID34_pd_2_0_0.wav': 24,
            }
        },
        'SpontaneousDialogue': {
            'HC': {
                'ID00_hc_0_0_0.wav': 21,
                'ID01_hc_0_0_0.wav': 17,
                'ID03_hc_0_0_0.wav': 25,
                'ID05_hc_0_0_0.wav': 24,
                'ID08_hc_0_0_0.wav': 9,
                'ID09_hc_0_0_0.wav': 24,
                'ID10_hc_0_0_0.wav': 23,
                'ID11_hc_0_0_0.wav': 15,
                'ID12_hc_0_0_0.wav': 20,
                'ID14_hc_0_0_0.wav': 21,
                'ID15_hc_0_0_0.wav': 23,
                'ID19_hc_0_0_0.wav': 19,
                'ID21_hc_0_0_0.wav': 14,
                'ID22_hc_0_0_0.wav': 20,
                'ID23_hc_0_0_0.wav': 21,
                'ID25_hc_0_0_0.wav': 20,
                'ID26_hc_0_0_0.wav': 20,
                'ID28_hc_0_0_0.wav': 21,
                'ID31_hc_0_1_1.wav': 17,
                'ID35_hc_0_0_0.wav': 18,
                'ID36_hc_0_0_0.wav': 16
            },
            'PD': {
                'ID02_pd_2_0_0.wav': 17,
                'ID04_pd_2_0_1.wav': 22,
                'ID06_pd_3_1_1.wav': 25,
                'ID07_pd_2_0_0.wav': 24,
                'ID13_pd_3_2_2.wav': 24,
                'ID16_pd_2_0_0.wav': 25,
                'ID17_pd_2_1_0.wav': 23,
                'ID20_pd_3_0_1.wav': 22,
                'ID24_pd_2_0_0.wav': 24,
                'ID27_pd_4_1_1.wav': 20,
                'ID29_pd_3_1_2.wav': 25,
                'ID30_pd_2_1_1.wav': 33,
                'ID32_pd_3_1_1.wav': 24,
                'ID33_pd_3_2_2.wav': 17,
                'ID34_pd_2_0_0.wav': 19
            }
        }
    }

    dataset = AudioDataset(
        dataset_base_path=dataset_base_path,
        categories=categories,
        start_seconds=start_seconds
    )

    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size

    train_dataset, test_dataset = random_split(dataset, [train_size, test_size])

    batch_size = 64
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = PDClassification(n_mfcc=40, num_classes=2).to(device)
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-5)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', factor=0.1, patience=3)

    early_stopping = EarlyStopping(patience=15, path='./best_model.pth', verbose=True)

    epoch = 0
    while True:
        epoch += 1
        train(model, device, train_loader, optimizer, criterion, epoch)
        val_loss, val_accuracy = test(model, device, test_loader, criterion)
        scheduler.step(val_loss)
        early_stopping(val_loss, model)
        if early_stopping.early_stop:
            print("Early stopping triggered. Stopping training.")
            break

    model.load_state_dict(torch.load('./best_model.pth'))
    print("Training completed.")
