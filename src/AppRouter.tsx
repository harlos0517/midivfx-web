import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'

import Index from '@/pages/Index'

const router = () => createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/">
        <Route path="/" element={<Index />} />
      </Route>
    </>,
  ),
)

const AppRouter = () =>
  <RouterProvider router={router()} />

export default AppRouter
