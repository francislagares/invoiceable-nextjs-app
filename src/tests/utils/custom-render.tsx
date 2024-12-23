import { PropsWithChildren, ReactElement } from 'react';

import { ClerkProvider } from '@clerk/nextjs';
import { render, RenderOptions } from '@testing-library/react';

const AllProviders = ({ children }: PropsWithChildren) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default AllProviders;

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof render> =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
