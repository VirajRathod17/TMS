import { lazy } from 'react';

const modules = ['awards'];

export const dynamicRoutes = modules.flatMap((module) => {
  const routes = [
    {
      path: `/${module}`,
      component: lazy(() => import(`../modules/${module}/components/index`)),
    },
    {
      path: `/${module}/create`,
      component: lazy(() => import(`../modules/${module}/components/create`)),
    },
    {
      path: `/${module}/edit/:id`,
      component: lazy(() => import(`../modules/${module}/components/edit`)),
    },
  ];
  return routes;
});
