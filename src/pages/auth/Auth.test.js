import { fireEvent, render, screen, waitFor } from '@testing-library/react';

global.TextEncoder = require('util').TextEncoder;
const { MemoryRouter, Route, Routes } = require('react-router-dom');
const Auth = require('./index').default;
const { AuthProvider } = require('../../context/AuthContext');
const Footer = require('../../layout/footer/index').default;

function openAuth(path = '/auth/login') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/" element={<h1>Home</h1>} />
      </Routes>
      <Footer />
      </AuthProvider>
    </MemoryRouter>
  );
}

function submitLogin() {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
}

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => { delete global.fetch; });

test('login logs credentials without calling an API or marking login successful', () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  try {
    openAuth();
    submitLogin();
    expect(log).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Login' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Login / Sign up' })).toBeTruthy();
  } finally {
    log.mockRestore();
  }
});

test('registration leads to login without logging in', async () => {
  global.fetch.mockResolvedValue({ ok: true, status: 201 });
  openAuth('/auth/register');
  expect(screen.queryByLabelText('Username')).toBeNull();
  fillPersonalFields();
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
  await screen.findByRole('heading', { name: 'Login' });
  expect(localStorage.getItem('isLoggedIn')).toBeNull();
  expect(screen.getByRole('status').textContent).toContain('Account created');
  expect(localStorage.getItem('hasRegistered')).toBe('true');
  const body = global.fetch.mock.calls[0][1].body;
  expect(body.get('Email')).toBe('test@example.com');
  expect(body.has('Username')).toBe(false);
  expect(body.get('first_name')).toBe('Alex');
  expect(body.get('last_name')).toBe('Tan');
  expect(body.get('phone')).toBe('+65 8123 4567');
  expect(screen.queryByRole('link', { name: 'Login / Sign up' })).toBeNull();
});

test('saved login status redirects away from login', async () => {
  localStorage.setItem('isLoggedIn', 'true');
  openAuth();
  await screen.findByRole('heading', { name: 'Home' });
  expect(global.fetch).not.toHaveBeenCalled();
});

test('removed auth routes show page not found', () => {
  openAuth('/auth/forgot');
  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy();
});

test('auth root opens login', async () => {
  openAuth('/auth');
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Login' })).toBeTruthy());
});

function fillPersonalFields() {
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Alex' } });
  fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Tan' } });
  fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '+65 8123 4567' } });
}

function fillAgentForm() {
  fillPersonalFields();
  fireEvent.change(screen.getByLabelText('Biography'), { target: { value: 'Interior designer' } });
  fireEvent.change(screen.getByLabelText('Years of experience'), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'agent@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
}

function fillNewCompany() {
  fireEvent.change(screen.getByLabelText('Select company'), { target: { value: 'new' } });
  fireEvent.change(screen.getByLabelText('Company name'), { target: { value: 'Studio' } });
  fireEvent.change(screen.getByLabelText('Company description'), { target: { value: 'Design studio' } });
  fireEvent.change(screen.getByLabelText('Company phone'), { target: { value: '+65 6123 4567' } });
  fireEvent.change(screen.getByLabelText('Company email'), { target: { value: 'studio@example.com' } });
  fireEvent.change(screen.getByLabelText('Company website'), { target: { value: 'https://example.com' } });
  fireEvent.change(screen.getByLabelText('Company address'), { target: { value: '10 Sample Road' } });
}

test('personal sign up links to agent registration', async () => {
  openAuth('/auth/register');
  fireEvent.click(screen.getByRole('link', { name: 'Register as an agent' }));
  expect(screen.getByRole('heading', { name: 'Agent registration' })).toBeTruthy();
  expect(screen.getByLabelText('Select company')).toBeTruthy();
  await screen.findByRole('alert');
});

test('new company details are included in one registration request', async () => {
  process.env.REACT_APP_AGENT_REGISTER_URL = 'https://example.com/agents/register';
  try {
    global.fetch.mockResolvedValue({ ok: true, status: 201 });
    openAuth('/auth/register/agent');
    await screen.findByRole('alert');
    fillAgentForm();
    fillNewCompany();
    fireEvent.click(screen.getByRole('button', { name: 'Register as an agent' }));
    await screen.findByRole('heading', { name: 'Login' });
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe(process.env.REACT_APP_AGENT_REGISTER_URL);
    expect(options.body.get('first_name')).toBe('Alex');
    expect(options.body.get('last_name')).toBe('Tan');
    expect(options.body.get('biography')).toBe('Interior designer');
    expect(options.body.get('years_of_experience')).toBe('5');
    expect(options.body.has('company_id')).toBe(false);
    expect(JSON.parse(options.body.get('new_company'))).toEqual({
      name: 'Studio', description: 'Design studio', phone: '+65 6123 4567',
      email: 'studio@example.com', website: 'https://example.com', address: '10 Sample Road',
    });
    expect(localStorage.getItem('hasRegistered')).toBe('true');
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  } finally {
    delete process.env.REACT_APP_AGENT_REGISTER_URL;
  }
});

test('existing company selection excludes new company details', async () => {
  process.env.REACT_APP_COMPANIES_URL = 'https://example.com/companies';
  process.env.REACT_APP_AGENT_REGISTER_URL = 'https://example.com/agents/register';
  try {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: 42, name: 'Existing Studio' }] })
      .mockResolvedValueOnce({ ok: true, status: 201 });
    openAuth('/auth/register/agent');
    await screen.findByRole('option', { name: 'Existing Studio' });
    fillAgentForm();
    fillNewCompany();
    fireEvent.change(screen.getByLabelText('Select company'), { target: { value: '42' } });
    expect(screen.queryByLabelText('Company name')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Register as an agent' }));
    await screen.findByRole('heading', { name: 'Login' });
    const body = global.fetch.mock.calls[1][1].body;
    expect(body.get('company_id')).toBe('42');
    expect(body.has('new_company')).toBe(false);
  } finally {
    delete process.env.REACT_APP_COMPANIES_URL;
    delete process.env.REACT_APP_AGENT_REGISTER_URL;
  }
});

test('unconfigured agent registration does not create a personal account', async () => {
  openAuth('/auth/register/agent');
  await screen.findByRole('alert');
  fillAgentForm();
  fillNewCompany();
  fireEvent.click(screen.getByRole('button', { name: 'Register as an agent' }));
  await screen.findByText('Agent registration is not available yet. Please try again later.');
  expect(global.fetch).not.toHaveBeenCalled();
  expect(localStorage.getItem('hasRegistered')).toBeNull();
});
