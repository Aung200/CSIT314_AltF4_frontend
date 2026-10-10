//libraries
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
//components
import App from './App';
import { AuthProvider } from './context/AuthContext';
//css
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
);