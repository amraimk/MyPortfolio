import { render, screen, waitFor } from '@testing-library/react';
import ProjectDetails from '../components/ProjectDetails';
import { createMockLocalStorage } from './test-helpers';

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

describe('ProjectDetails', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();
    
    Object.defineProperty(window, 'localStorage', {
      value: createMockLocalStorage(),
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows "Create Project" title when role is Admin and no project id', () => {
    // Mock role as Admin and no id
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'Admin';
      return null;
    });

    mockUseParams.mockReturnValue({});

    render(<ProjectDetails />);

    // Heading should be "Create Project"
    expect(screen.getByRole('heading', { name: /create project/i })).toBeInTheDocument();
  });

  test('shows "Project Details" when role is not Admin and no project id', () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'User';
      return null;
    });

    mockUseParams.mockReturnValue({});

    render(<ProjectDetails />);

    expect(screen.getByRole('heading', { name: /project details/i })).toBeInTheDocument();
  });

  test('fetches project data and fills form when id is present', async () => {
    // Mock role as Admin and id present
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'Admin';
      if (key === 'token') return 'secret-token';
      return null;
    });

    mockUseParams.mockReturnValue({ id: 'abc123' });

    const mockProject = {
      title: 'Portfolio',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      completion: '2025-01-10T00:00:00.000Z',
      description: 'Class project'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProject
    });

    render(<ProjectDetails />);

    // Ensure fetch called with correct URL + headers
    expect(global.fetch).toHaveBeenCalledWith('/api/projects/abc123', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer secret-token' })
    }));

    // Wait for form fields to populate
    await waitFor(() => {
      expect(screen.getByDisplayValue('Portfolio')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2025-01-10')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Class project')).toBeInTheDocument();
    });
  });

  test('disables form inputs for non-Admin users', async () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'User';
      if (key === 'token') return 'secret-token';
      return null;
    });

    mockUseParams.mockReturnValue({});

    render(<ProjectDetails />);

    expect(screen.getByPlaceholderText('Title')).toBeDisabled();
    expect(screen.getByPlaceholderText('First Name')).toBeDisabled();
    expect(screen.getByPlaceholderText('Last Name')).toBeDisabled();
    expect(screen.getByPlaceholderText('Email')).toBeDisabled();
    expect(screen.getByPlaceholderText('Completion Date')).toBeDisabled();
    expect(screen.getByPlaceholderText('Description')).toBeDisabled();
  });
});
