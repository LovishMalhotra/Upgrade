import './App.css';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <PrimeReactProvider>
    <Router>
      <Routes>
        <Route path='/Dashboard' element={<Dashboard/>} />
       
      </Routes>
    </Router>
    </PrimeReactProvider>
  );
}

export default App;
