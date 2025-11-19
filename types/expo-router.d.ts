declare module 'expo-router' {
  import * as React from 'react';

  // Tabs/Stack components used by the app (they expose a Screen subcomponent)
  export const Tabs: React.ComponentType<any> & { Screen: React.ComponentType<any> };
  export const Stack: React.ComponentType<any> & { Screen: React.ComponentType<any> };

  // Flexible router API: push/replace can accept string or location-like object
  export function useRouter(): {
    push: (path: string | { pathname: string; params?: Record<string, any> }) => void;
    replace: (path: string | { pathname: string; params?: Record<string, any> }) => void;
    back: () => void;
  };

  export function usePathname(): string | undefined;
  export function useLocalSearchParams<T = Record<string, string | undefined>>(): T;
  export default {} as any;
}
