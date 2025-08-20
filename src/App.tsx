import { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Loading from './components/Loading/Loading';

const Home = lazy(() => import('./pages/Home/Home'));

function App() {
  return (
    <Fragment>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </Fragment>
  );
}

export default App;
