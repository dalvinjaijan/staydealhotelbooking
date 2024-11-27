import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { persistor } from './utils/redux/store.ts'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react'




import { ReactNode } from 'react';
import PlacesContextFunction from './context/placesContext.tsx'

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log("Error-->", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log("Error in mounting-->", error);
    console.log("ErrorInfo from mounting-->", info);
  }

  render() {
    if (this.state.hasError) {
      return <p>ERROR IN THE COMPONENT</p>;
    }

    return this.props.children;
  }
}



ReactDOM.createRoot(document.getElementById('root')!).render(
  <PlacesContextFunction>

  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ErrorBoundary>
        <BrowserRouter>
            <ToastContainer pauseOnHover={false} position="bottom-right"/>
                <App />
        </BrowserRouter>
      </ErrorBoundary>
    </PersistGate>
  </Provider>
  </PlacesContextFunction>

 
  // <React.StrictMode>
  //   <RouterProvider router={router}/>
  // </React.StrictMode>,
)
