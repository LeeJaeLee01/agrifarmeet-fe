import { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const Home = lazy(() => import('./pages/Home'));

function App() {
  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </Fragment>
  );
}

export default App;
