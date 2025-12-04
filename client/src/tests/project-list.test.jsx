import { render, screen } from '@testing-library/react';
import ProjectsList from '../components/ProjectsList';
import { createMockLocalStorage } from './test-helpers';

const mockNavigate = jest.fn();

// Mock react-router-dom useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('ProjectsList', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();

    Object.defineProperty(window, 'localStorage', {
      value: createMockLocalStorage(),
      writable: true
    });

    // Mock token and role
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'token-1';
      if (key === 'role') return 'Admin';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows a friendly message when no projects exist', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<ProjectsList />);

    expect(global.fetch).toHaveBeenCalledWith('/api/projects', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: expect.any(String) })
    }));

    expect(await screen.findByText(/no projects available/i)).toBeInTheDocument();
  });

  test('renders each project returned by the API', async () => {
    const mockProjects = [
      {
        _id: '1',
        title: 'Portfolio',
        firstname: 'user',
        lastname: 'Smith',
        email: 'user@test.com',
        completion: '2025-12-01T00:00:00.000Z',
        description: 'Personal portfolio project'
      },
      {
        _id: '2',
        title: 'Class app',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        completion: '2025-11-15T00:00:00.000Z',
        description: 'School project app'
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects
    });

    render(<ProjectsList />);

    // Wait for projects to appear
    expect(await screen.findByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Class app')).toBeInTheDocument();

    // Check that Admin buttons are rendered
    expect(screen.getAllByText('Update')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Delete')[0]).toBeInTheDocument();
    expect(screen.getByText('Create New Project')).toBeInTheDocument();
  });
});
