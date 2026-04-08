import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { House, PixideProvider } from '../src/pixide-react';

describe('Using PixideProvider', () => {
  it('should render the icon with PixideProvider', () => {
    const { container } = render(
      <PixideProvider
        size={48}
        color="red"
      >
        <House />
      </PixideProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the icon with default props when no provider is used', () => {
    const { container } = render(<House />);

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('width', '24');
    expect(IconComponent).toHaveAttribute('height', '24');
    expect(IconComponent).toHaveAttribute('stroke', 'currentColor');
    expect(IconComponent).toHaveAttribute('stroke-width', '2');
  });

  it('should render the icon with PixideProvider and custom strokeWidth', () => {
    const { container } = render(
      <PixideProvider
        size={48}
        color="red"
        strokeWidth={4}
      >
        <House />
      </PixideProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('width', '48');
    expect(IconComponent).toHaveAttribute('height', '48');
    expect(IconComponent).toHaveAttribute('stroke', 'red');
    expect(IconComponent).toHaveAttribute('stroke-width', '4');
  });

  it('should render the icon with PixideProvider and custom absoluteStrokeWidth', () => {
    const { container } = render(
      <PixideProvider
        size={48}
        color="red"
        absoluteStrokeWidth
      >
        <House />
      </PixideProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('stroke-width', '1');
  });

  it("should override the provider's global props when passing props to the icon", () => {
    const { container } = render(
      <PixideProvider
        size={48}
        color="red"
        strokeWidth={4}
      >
        <House
          size={24}
          color="blue"
          strokeWidth={2}
        />
      </PixideProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('width', '24');
    expect(IconComponent).toHaveAttribute('height', '24');
    expect(IconComponent).toHaveAttribute('stroke', 'blue');
    expect(IconComponent).toHaveAttribute('stroke-width', '2');
  });

  it('should merge className from provider and icon', () => {
    const { container } = render(
      <PixideProvider className="provider-class">
        <House className="icon-class" />
      </PixideProvider>,
    );

    const IconComponent = container.firstElementChild;

    expect(IconComponent).toHaveAttribute('class', 'lucide provider-class pixide-house icon-class');
  });
});
