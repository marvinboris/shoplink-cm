import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Cliquez-moi</Button>);
    expect(screen.getByRole('button', { name: 'Cliquez-moi' })).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    const { container } = render(<Button>Test</Button>);
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  it('applies outline variant', () => {
    const { container } = render(<Button variant="outline">Test</Button>);
    expect(container.firstChild).toHaveClass('border-primary');
    expect(container.firstChild).toHaveClass('text-primary');
  });

  it('applies danger variant', () => {
    const { container } = render(<Button variant="danger">Test</Button>);
    expect(container.firstChild).toHaveClass('bg-danger');
  });

  it('applies success variant', () => {
    const { container } = render(<Button variant="success">Test</Button>);
    expect(container.firstChild).toHaveClass('bg-success');
  });

  it('renders with large size', () => {
    const { container } = render(<Button size="lg">Test</Button>);
    expect(container.firstChild).toHaveClass('h-14');
  });

  it('renders loading spinner when isLoading', () => {
    render(<Button isLoading>Test</Button>);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('disables button when disabled', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables button when isLoading', () => {
    render(<Button isLoading>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Test</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Test</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
