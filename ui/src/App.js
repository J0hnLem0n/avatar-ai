import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import styled from 'styled-components';
import Header from './components/Header';
import AvatarGenerator from './components/AvatarGenerator';
import { SocketProvider } from './contexts/SocketContext';

// Создаем темную тему Material UI
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5',
        },
        secondary: {
            main: '#f48fb1',
            light: '#fce4ec',
            dark: '#ec407a',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
            surface: '#2d2d2d',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
        },
        divider: '#424242',
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 300,
        },
        h2: {
            fontWeight: 300,
        },
        h3: {
            fontWeight: 400,
        },
        h4: {
            fontWeight: 400,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                },
            },
        },
    },
});

const AppContainer = styled(Box)`
  min-height: 100vh;
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
`;

const MainContent = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
`;

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <SocketProvider>
                <AppContainer>
                    <Header />
                    <MainContent maxWidth="xl">
                        <AvatarGenerator />
                    </MainContent>
                </AppContainer>
            </SocketProvider>
        </ThemeProvider>
    );
}

export default App;
