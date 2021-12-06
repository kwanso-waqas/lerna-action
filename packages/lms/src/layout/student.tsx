import React, { FC, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  ClickAwayListener,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core';
import {
  NotificationIcon,
  DefaultAvatar,
  MainLogoAdmin,
  CollapsedLogo,
} from '@illumidesk/common-ui/lib/assets';

import { StudentHeader, FooterLogo, SlackIcon, ShareIcon, TwitterIcon } from '../assets';
import useStyles from './style';

interface StudentProps {
  children?: React.ReactNode;
}

const Student: FC<StudentProps> = ({ children }) => {
  const [profileMenu, openProfileMenu] = useState<boolean>(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box>
      <Box py={1.2} style={{ minHeight: 80 }}>
        <Grid container alignItems="center">
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <img src={MainLogoAdmin} alt="logo" />
          </Grid>
          <Grid item xs={5} container justifyContent="flex-end">
            <IconButton
              aria-label="open notification menu"
              onClick={() => console.log('hello')}
              style={{ padding: 0, marginRight: 32 }}
              data-cy="sidebarUserMenu"
              className={classes.iconBtn}
            >
              <img src={NotificationIcon} alt="Notification Bell Icon" />
            </IconButton>
            <IconButton
              aria-label="open profile menu"
              onClick={() => openProfileMenu(!profileMenu)}
              edge="start"
              style={{ padding: 0 }}
              data-cy="sidebarUserMenu"
              ref={anchorRef}
              className={classes.iconBtn}
            >
              <img
                className={classes.userAvatar}
                src={DefaultAvatar}
                width="36"
                height="36"
                alt="user profile icon"
              />
            </IconButton>
            <Popper
              className={classes.popperStyleProfile}
              open={profileMenu}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
              data-cy="profileDropdown"
            >
              <Paper className="bgWhite">
                <ClickAwayListener onClickAway={() => openProfileMenu(!profileMenu)}>
                  <MenuList className={classes.courseDropdown} id="menu-list-grow">
                    <Box py={1} px={1.9}>
                      <Typography
                        variant="caption"
                        style={{ display: 'block' }}
                        color="textPrimary"
                      >
                        Signed in as
                      </Typography>
                      <Typography variant="caption" color="textPrimary">
                        <strong>student@email.com</strong>
                      </Typography>
                    </Box>
                    <MenuItem onClick={() => history.push('/students/profile')}>
                      <Box py={0.5}>
                        <Typography variant="body1" color="textPrimary">
                          Profile Settings
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={() => console.log('log out has been performed')}>
                      <Box py={0.5}>
                        <Typography variant="body1" color="textPrimary">
                          Sign Out
                        </Typography>
                      </Box>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
      <Box className={classes.topContainer}>
        <img style={{ width: '100%' }} src={StudentHeader} alt="Page Header" />
      </Box>
      {children}

      <Box py={8} style={{ backgroundColor: '#EAEFF4' }}>
        <Grid container justifyContent="space-evenly" alignItems="center">
          <Grid item sm={1} lg={1} md={1}></Grid>
          <Grid item xs={4} sm={2} lg={2} md={2} container>
            <Grid item xs={12} container justifyContent="center">
              <Box py={1}>
                <img
                  width="80"
                  src={CollapsedLogo}
                  className={classes.footerLogo}
                  alt="footer collapsed logo"
                />
              </Box>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              <Box py={2}>
                <img
                  width="160"
                  src={FooterLogo}
                  className={classes.footerLogo}
                  alt="footer collapsed logo"
                />
              </Box>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              <img src={SlackIcon} alt="Slack Icon" />
              <img style={{ padding: '0 22px' }} src={ShareIcon} alt="Share Icon" />
              <img src={TwitterIcon} alt="Twitter Icon" />
            </Grid>
          </Grid>
          <Grid item xs={7} sm={9} lg={7} md={7} container justifyContent="flex-end">
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2" color="textPrimary">
                <strong>Resources</strong>
              </Typography>
              <Box mt={2}>
                <Typography variant="body2">Docs</Typography>
              </Box>
              <Box py={2}>
                <Typography variant="body2">Community</Typography>
              </Box>
              <Box>
                <Typography variant="body2">Pricing</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2" color="textPrimary">
                <strong>Legal</strong>
              </Typography>
              <Box mt={2}>
                <Typography variant="body2">Cookies</Typography>
              </Box>
              <Box py={2}>
                <Typography variant="body2">Security</Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>
      </Box>

      <Box py={1.2} style={{ backgroundColor: '#CDD9E5' }}>
        <Grid container justifyContent="center">
          <Grid item xs={1}></Grid>
          <Grid item xs={4}>
            <Grid container justifyContent="space-around">
              <Typography variant="body2" color="textPrimary">
                Privacy Policy
              </Typography>
              <Typography variant="body2" color="textPrimary">
                Terms & Conditions
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ©Demo Campus Site
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Student;
