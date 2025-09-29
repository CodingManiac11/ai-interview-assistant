import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { AppLayout } from './components/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConfigProvider, Spin } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
          },
        }}
      >
        <Provider store={store}>
          <PersistGate 
            loading={
              <div style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Spin size="large" />
              </div>
            } 
            persistor={persistor}
          >
            <AppLayout />
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
