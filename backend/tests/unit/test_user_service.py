import unittest
from unittest.mock import MagicMock, patch
from services.userService import UserService
from exceptions import UserAlreadyExistsException

class TestUserService(unittest.TestCase):
    def setUp(self):
        self.user_repository = MagicMock()
        self.user_service = UserService(self.user_repository)

    @patch('services.userService.check_password_hash', return_value=True)
    def test_login_user(self, mock_check_password_hash):
        self.user_repository.find_by_email.return_value = MagicMock(password_hash='hashed_password')
        user = self.user_service.login_user('test@example.com', 'password')
        self.assertIsNotNone(user)

    def test_register_user_existing(self):
        self.user_repository.find_by_email.return_value = MagicMock()
        with self.assertRaises(UserAlreadyExistsException):
            self.user_service.register_user('test@example.com', 'password', 'password')

if __name__ == '__main__':
    unittest.main()
