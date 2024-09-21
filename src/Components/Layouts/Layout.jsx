import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Main from '../Main/Main';

const DefaultLayout = () => {
    return (
        <div >
            <Header />
            <Main></Main>
            <Outlet />
        </div>
    );
};

export default DefaultLayout;
