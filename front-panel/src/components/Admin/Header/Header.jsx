import React from 'react'
import Logo from './Logo/Logo'
// import Messages from './Messages/Messages'
// import SearchBar from './SearchBar/SearchBar'
import UserProfile from './User/User'
// import Notifications from './Notifications/Notifications'
// import notificationsData from './Notifications/notificationsData'
// import { useSelector } from 'react-redux'

function Header() {
    // const notificationsData = useSelector((state) => (state.alert.notifications));
    return (
        <>
            <header id="header" className="header fixed-top d-flex align-items-center m-2 rounded-25 shadow">
                <Logo />
                {/* <SearchBar /> */}
                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        {/* <Notifications notifications={notificationsData} /> */}
                        {/* <Messages /> */}
                        <UserProfile />
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header