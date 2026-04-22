import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  const GoodComponent = () => <div>Good component</div>;

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Good component')).toBeInTheDocument();
  });

  it('renders error UI when error is thrown', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('resets error state on button click', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

    const button = screen.getByText('Intentar de nuevo');
    await user.click(button);

    rerender(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Good component')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
