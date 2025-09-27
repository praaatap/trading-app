import MinimalistStockLandingPage from './pages/landingPgae';
import { Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/createAccountPage'
const AboutPage = () => <h1>About Us</h1>;
const NotFoundPage = () => <h1>404 - Page Not Found!</h1>;

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<MinimalistStockLandingPage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/create-account' element={<SignUpPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
    </>
  )
}

export default App
