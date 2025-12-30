import * as React from 'react';
import PropTypes from 'prop-types';
import './_header.scss';

import StoreIcon from '@mui/icons-material/Store';
import GridViewIcon from '@mui/icons-material/GridView';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Icons } from '@lp_front_account/lp-kit-dashboards';

/* const Icons = (props) => (
  <div
    style={{
      width: props.width,
      height: props.height,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#833177',
      fontWeight: 'bold',
    }}
  >
    LOGO
  </div>
); */

const Header = ({ isMobile = false, title = 'Dashboard de monitoreo' }) => {
  return (
    <header className="dashboard-header">
      {/*  */}
      <div className="dashboard-header__left">
        <a href="#" className="dashboard-header__logo-link">
          <Icons
            iconType="HeaderLogo"
            name="Marketplace"
            isWhite
            height="2.5rem"
            width="11.2rem"
            viewBox="0 0 240 60"
          />
        </a>
        <span className="dashboard-header__divider" />
        <span className="dashboard-header__title">{title}</span>
      </div>
      {/* derecha */}
      {!isMobile && (
        <div className="dashboard-header__right">
          <div className="dashboard-header__location">
            <StoreIcon className="dashboard-header__icon" />
            <span className="dashboard-header__location-text">
              México, CDMX
            </span>
            <KeyboardArrowDownIcon className="dashboard-header__icon dashboard-header__icon--small" />
          </div>
          <span className="dashboard-header__divider dashboard-header__divider--right" />
          <div className="dashboard-header__actions">
            <GridViewIcon className="dashboard-header__icon" />
            <NotificationsIcon className="dashboard-header__icon" />
            <PersonIcon className="dashboard-header__icon" />
          </div>
        </div>
      )}
    </header>
  );
};
Header.propTypes = {
  isMobile: PropTypes.bool,
  title: PropTypes.string,
};

export default Header;
