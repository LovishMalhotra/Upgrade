import './App.css';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Training from './components/Training';
import Participants from './components/Participants';
import UserForm from './components/Register';
import Login from './components/Login';


function App() {
  return (
    <PrimeReactProvider>
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/training' element={<Training/>} />
        <Route path='/register' element={<UserForm/>} />
        <Route path='/participant/:training_code' element={<Participants/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </Router>
    </PrimeReactProvider>
  );
}

export default App;
