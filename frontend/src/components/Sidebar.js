import React from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import ChatOutlinedIcon from "@material-ui/icons/ChatOutlined";
import ShowChartOutlinedIcon from "@material-ui/icons/ShowChartOutlined";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  listItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  listItemText: {
    textDecoration: "none",
    color: "inherit",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  sidebarButton: {
    width: "100%",
    padding: theme.spacing(2, 0),
    justifyContent: "flex-start",
  },
  sidebarIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerOpen}
        className={classes.menuButton}
        size="large"
        style={{ width: "100px", height: "100px" }}
      >
        <MenuIcon style={{ fontSize: "2.5rem" }} />
      </IconButton>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <List>
          <ListItem
            button
            component={Link}
            to="/"
            className={classes.listItem}
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <CloudUploadOutlinedIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText
              primary="Upload CSV"
              className={classes.listItemText}
            />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/data"
            className={classes.listItem}
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <DescriptionOutlinedIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText
              primary="Fetch Data"
              className={classes.listItemText}
            />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/chat"
            className={classes.listItem}
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <ChatOutlinedIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText
              primary="Start Chat"
              className={classes.listItemText}
            />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/chart"
            className={classes.listItem}
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <ShowChartOutlinedIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText
              primary="Data Analysis"
              className={classes.listItemText}
            />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
