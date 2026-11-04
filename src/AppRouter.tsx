import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'

import ErrorBoundary from '@/components/ErrorBoundary'
import Index from '@/pages/Index'

const router = () => createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/">
        <Route path="/" element={<ErrorBoundary><Index /></ErrorBoundary>} />
      </Route>
    </>,
  ),
)

const AppRouter = () =>
  <RouterProvider router={router()} />

export default AppRouter
