import unittest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient


with patch('services.pdService.AudioInferenceService', MagicMock()):
    from server import app

class TestUserRoutesIntegration(unittest.TestCase):
    counter = 0

    def setUp(self):
        self.client = TestClient(app)
        self.base_email = 'test_user'
        self.password = 'password'

    def generate_unique_email(self, suffix):
        TestUserRoutesIntegration.counter += 1
        return f'{self.base_email}_{suffix}_{TestUserRoutesIntegration.counter}@example.com'

    def test_register_endpoint(self):
        unique_email = self.generate_unique_email('register')
        response = self.client.post('/user/register', json={
            'email': unique_email,
            'password': self.password,
            'confirm_password': self.password
        })
        if response.status_code != 200:
            print("Response body:", response.json())
        self.assertEqual(response.status_code, 200)

    def test_login_endpoint(self):
        unique_email = self.generate_unique_email('login')

        self.client.post('/user/register', json={
            'email': unique_email,
            'password': self.password,
            'confirm_password': self.password
        })

        response = self.client.post('/user/login', json={
            'email': unique_email,
            'password': self.password
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())

if __name__ == '__main__':
    unittest.main()
