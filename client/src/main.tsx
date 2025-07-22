import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';

import './index.css';
import App from './App.tsx';

{
	/* <StrictMode></StrictMode> */
}

createRoot(document.getElementById('root')!).render(
	<>
		<App />
	</>
);
