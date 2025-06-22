
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './lib/serviceWorker'

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for production caching
registerServiceWorker().catch(console.error);
