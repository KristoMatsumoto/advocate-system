import AppHeader from './AppHeader';
import { Container } from '@mui/material';

export default function Layout({ children }) {
    return (
        <>
            <AppHeader />
            <Container maxWidth="lg">
                {children}
            </Container>
        </>
    );
}
