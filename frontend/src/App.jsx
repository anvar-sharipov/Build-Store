// Пример с React Router (v6+)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './Components/Page/Faktura';
import Register from './Components/Register';
import Login from './Components/Login';
import './index.css'
import Header from './Components/Header';
import Footer from './Components/Footer';
import { useEffect, useState } from 'react';
import MyModal from './Components/UI/MyModal';
import { ROUTES } from './routes';
import Harytlar from './Components/Page/Harytlar';




function App() {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path={ROUTES.FAKTURA} element={<ProductList />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.HARYTLAR} element={<Harytlar />} />
          </Routes>
        </main>
        <Footer />
      </Router>
      
    </div>
  );
}




export default App;