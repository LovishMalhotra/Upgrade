import './App.css';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Training from './components/Training';

function App() {
  return (
    <PrimeReactProvider>
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/training' element={<Training/>} />
      </Routes>
    </Router>
    </PrimeReactProvider>
  );
}

export default App;
