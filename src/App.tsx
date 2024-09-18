import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from 'react-router-dom';

const PAGES = import.meta.glob('/src/pages/**/[a-z[]*.tsx', { eager: true });

console.log('Available pages:', Object.keys(PAGES));

const routes: RouteObject[] = [];

for (const path of Object.keys(PAGES)) {
  const fileName = path.match(/\/src\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes('$')
    ? fileName.replace('$', ':')
    : fileName.replace(/\/index/, '');

  const routePath =
    fileName === 'index' ? '/' : `/${normalizedPathName.toLowerCase()}`;

  console.log(`Creating route: ${routePath} -> ${path}`);

  routes.push({
    path: routePath,
    element: React.createElement((PAGES[path] as any).default),
    loader: (PAGES[path] as any).loader,
    action: (PAGES[path] as any).action,
    errorElement: (PAGES[path] as any).ErrorBoundary
      ? React.createElement((PAGES[path] as any).ErrorBoundary)
      : undefined,
  });
}

const notFoundPage = Object.keys(PAGES).find((path) =>
  path.endsWith('/404.tsx')
);
routes.push({
  path: '*',
  element: notFoundPage
    ? React.createElement((PAGES[notFoundPage] as any).default)
    : React.createElement(() => <div>Not Found</div>),
});

console.log('Generated routes:', routes);

const router = createBrowserRouter(routes, { basename: '/' });

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
