import { describe, it, expect } from 'vitest';
import { createPixideIcon } from '../src/pixide-react';
import { airVent } from './testIconNodes';
import { render } from '@testing-library/react';

describe('Using createPixideIcon', () => {
  it('should create a component from an iconNode', () => {
    const AirVent = createPixideIcon('AirVent', airVent);

    const { container } = render(<AirVent />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toBeDefined();
  });

  it('should create a component from an iconNode with iconName', () => {
    const AirVent = createPixideIcon('air-vent', airVent);

    const { container } = render(<AirVent />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toBeDefined();
  });

  it('should include backwards compatible className', () => {
    const Layout2 = createPixideIcon('layout-2', airVent);

    const { container } = render(<Layout2 />);

    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toBeDefined();
  });
});
