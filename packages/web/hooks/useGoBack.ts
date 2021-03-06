import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import router from 'next/router';

interface Props {
  children?: ReactNode;
}

export interface GoBackOptions {
  targetPath: string | string[];
}

type GoBack = (options: GoBackOptions) => Promise<void>;
type SetRecords = (handler: (records: string[]) => string[]) => void;

export interface GoBackActions {
  goBack: GoBack;
  setRecords: SetRecords;
}

const ActionContext = React.createContext<GoBackActions | undefined>(undefined);

export function useGoBack() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error('useHistoryActions must be used within a HistoryProvider');
  }
  return context;
}

export function GoBackProvider({ children }: Props) {
  const records = useRef<string[]>([]);
  const actions = useMemo<GoBackActions>(() => {
    return {
      goBack: async ({ targetPath }) => {
        const previous = records.current[records.current.length - 2];
        const paths = Array.isArray(targetPath) ? targetPath : [targetPath];
        if (
          paths.some(
            path =>
              previous &&
              decodeURIComponent(previous).replace(/\?.*/, '') === path
          )
        ) {
          await router.push(previous);
        } else {
          await router.push(paths[0]);
        }
        records.current = records.current.slice(0, -2);
      },
      setRecords: handler => {
        records.current = handler(records.current);
      }
    };
  }, []);

  useEffect(() => {
    const handler = (url: string) => {
      // Note:
      // should not return/skip if shallow is false,
      // because the purpose of this function is to preserve search params
      // but search params always set shallow to true
      const last = records.current.slice(-1)[0];
      const maxRecords = 5;
      const samePathname =
        !!last && last.replace(/\?.*/, '') === url.replace(/\?.*/, '');
      records.current = samePathname
        ? [...records.current.slice(-maxRecords, -1), url] // replace last path
        : [...records.current.slice(-maxRecords), url];
    };
    router.events.on('routeChangeComplete', handler);
    handler(window.location.pathname + window.location.search);
    return () => router.events.off('routeChangeComplete', handler);
  }, []);

  return React.createElement(
    ActionContext.Provider,
    { value: actions },
    children
  );
}
