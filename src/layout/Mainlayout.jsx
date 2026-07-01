import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

function Mainlayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default Mainlayout;