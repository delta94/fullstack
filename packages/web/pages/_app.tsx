import React, { ReactNode, useEffect } from 'react';
import router from 'next/router';
import type { AppProps /*, AppContext */ } from 'next/app';
import { CommonMeta } from '@/components/Meta';
import { AuthProvider, useAuthState } from '@/hooks/useAuth';
import { GoBackProvider } from '@/hooks/useGoBack';
import { UserRole } from '@/typings';
import { Toaster } from '@/utils/toaster';
import '@/styles/globals.scss';
import 'typeface-muli';

interface ExtendAppProps extends AppProps {
  Component: AppProps['Component'] & {
    access?: UserRole[];
    redirect?: string;
    layout?: React.ComponentType<{ children?: ReactNode }>;
  };
}

function Unthorized({
  redirect,
  role
}: {
  redirect?: string;
  role?: UserRole;
}) {
  useEffect(() => {
    const isAdminPage = router.asPath.startsWith(`/admin`);
    const pathname = redirect || isAdminPage ? '/admin/login' : '/';

    if (isAdminPage && role === UserRole.Client) {
      Toaster.failure({ message: 'Permission denied ' });
    }

    router.push({ pathname, query: { from: router.asPath } }, pathname);
  }, [redirect, role]);
  return <div hidden />;
}

function AppContent(props: ExtendAppProps) {
  const { Component, pageProps } = props;
  const { loginStatus, user } = useAuthState();
  const access = Component.access;

  if (access && process.env.NEXT_PUBLIC_GUEST) {
    access.push(process.env.NEXT_PUBLIC_GUEST as UserRole);
  }

  if (!access || (user && access.includes(user.role))) {
    const Layout = Component.layout || React.Fragment;
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }

  if (loginStatus === 'unknown' || loginStatus === 'loading') {
    return null;
  }

  return <Unthorized role={user?.role} redirect={Component.redirect} />;
}

function App(props: ExtendAppProps) {
  return (
    <GoBackProvider>
      <AuthProvider>
        <CommonMeta />
        <AppContent {...props} />
      </AuthProvider>
    </GoBackProvider>
  );
}

export default App;
