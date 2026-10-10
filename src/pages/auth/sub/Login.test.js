import { fireEvent, render, screen } from '@testing-library/react';

global.TextEncoder = require('util').TextEncoder;
jest.mock('../../../api/api', () => ({
  __esModule: true,
  default: { loginAPI: jest.fn() },
}));
const { MemoryRouter } = require('react-router-dom');
const Login = require('./Login').default;
const API = require('../../../api/api').default;

function submit() {
  render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'example-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
}

afterEach(() => jest.restoreAllMocks());

test('shows the actual FastAPI error message and logs the response body', async () => {
  const data = { detail: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } };
  API.loginAPI.mockRejectedValueOnce({ response: { status: 401, data } });
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  submit();
  expect((await screen.findByRole('alert')).textContent).toBe('Invalid email or password');
  expect(log).toHaveBeenCalledWith('Login response:', data);
});

test('handles a network error without a server response', async () => {
  API.loginAPI.mockRejectedValueOnce(new Error('Network Error'));
  submit();
  expect((await screen.findByRole('alert')).textContent).toBe('Unable to log in. Please try again.');
});
