import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Divider,
  MenuItem,
  Paper,
  Select,
  makeStyles,
  Dialog,
} from "@material-ui/core/";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";

import spaceXLogo from "../assets/SpaceX-Logo.png";
import datePicker from "../assets/icon/datePicker.png";
import filterIcon from "../assets/icon/dropdownfilter.png";
import dropdownIconArrow from "../assets/icon/dropdownIconArrow.png";
import LeftArrow from "../assets/icon/leftArrow.png";
import RightArrow from "../assets/icon/rightArrow.png";
import NasaIcon from "../assets/icon/nasa_icon.png";
import WikiIcon from "../assets/icon/wikipedia.png";
import youtubeIcon from "../assets/icon/youtube.png";
import { launchData } from "../util";

const useStyles = makeStyles((theme) => ({
  imgHeader: {
    display: "flex",
    justifyContent: "center",
  },
  mainImg: {
    width: "200px",
    height: "100px",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  filterItem: {
    padding: "16px",
  },
  dropdownIcon: {
    cursor: "pointer",
    height: "30px",
    width: "30px",
  },
  dropdownIconContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    paddingLeft: "16px",
  },
  tableHeadRow: {
    backgroundColor: "#010101",
    width: "100%",
  },
  upcomingBadge: {
    textAlign: "center",
    backgroundColor: "#d9d273",
    borderRadius: "9px",
  },
  sucessBadge: {
    textAlign: "center",
    backgroundColor: "#8ad973",
    borderRadius: "9px",
    color: "#0e2906",
  },
  failedBadge: {
    textAlign: "center",
    backgroundColor: "#ee732d",
    borderRadius: "9px",
  },
  bottomPagination: {
    marginTop: "24px",
    marginRight: "16px",
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "48px",
  },
  paginationContainer: {
    display: "flex",
  },
  paginationIcon: {
    width: "20px",
    height: "20px",
  },
  paginationButtonArrow: {
    padding: "8px",
    border: "1px solid #a39e9e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cP: {
    cursor: "pointer",
  },
  paginationButton: {
    margin: "0 2px",
    padding: "8px",
    border: "1px solid #a39e9e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  paginationButtonActive: {},
  activeMissionName: {
    cursor: "pointer",
  },
  modalPopup: {
    width: "510px",
    overflowY: "none",
    margin: "24px 16px",
  },
  modalPopupHeader: {
    display: "flex",
    alignItems: "center",
  },
  missionDetailsContainer: {
    margin: "0 16px",
  },
  missionDetailsMargin: {
    margin: "8px 0",
  },
  externalLink: {
    display: "flex",
    justifyContent: "space-around",
  },
  poupImage: {
    width: "70px",
    height: "70px",
  },
  missionDetails: {
    width: "500px",
    margin: "24px 0",
  },
  detailsContainer: {
    marginTop: "24px",
  },
  detailsMarginLeft: {
    marginLeft: "36px",
  },
}));

const initialSelectedrow = {
  openModal: false,
  selectedRow: null,
};

function Dashboard() {
  const [paginationData, setPaginationData] = useState({
    currentPage: 0,
    perPageEnd: 12,
    perPageStart: 0,
    perPage: 12,
  });
  const [selectedRow, setSelectedRow] = useState({ ...initialSelectedrow });
  const [launchFilter, setLaunchFilter] = useState({
    time: "Past 6 Months",
    launchType: "All Launches",
  });
  const [mainData, setMainData] = useState(launchData);

  const classes = useStyles();

  useEffect(() => {
    let dataByLaunchfilter = [];
    if (launchFilter.launchType === "All Launches") {
      dataByLaunchfilter = launchData;
    } else if (launchFilter.launchType === "Upcoming Launches") {
      dataByLaunchfilter = launchData.filter((f) => f.launch_success === null);
    } else if (launchFilter.launchType === "Sucessful Launches") {
      dataByLaunchfilter = launchData.filter((f) => f.launch_success);
    } else if (launchFilter.launchType === "Failed Launches") {
      dataByLaunchfilter = launchData.filter((f) => f.launch_success === false);
    }
    setMainData([...dataByLaunchfilter]);
  }, [launchFilter]);

  const getAllLaunchData = async () => {
    await fetch("https://api.spacexdata.com/v3/launches", {
      mode: "no-cors",
    })
      .then((res) => {
        return res;
        //   console.log(res);
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    getAllLaunchData();
  }, []);

  const getStatus = (status) => {
    return (
      <>
        {status === null ? (
          <div className={classes.upcomingBadge}>Upcoming</div>
        ) : status ? (
          <div className={classes.sucessBadge}>Success</div>
        ) : (
          <div className={classes.failedBadge}>Failed</div>
        )}
      </>
    );
  };

  const generatePopupData = (data) => {
    if (data) {
      const {
        flight_number,
        links,
        mission_name,
        rocket,
        launch_success,
        details,
        launch_date_unix,
        launch_site,
      } = data;
      return (
        <div className={classes.modalPopup}>
          <div className={classes.modalPopupHeader}>
            <img
              className={classes.poupImage}
              src={links.mission_patch}
              alt=""
            />
            <div className={classes.missionDetailsContainer}>
              <h4 className={classes.missionDetailsMargin}>{mission_name}</h4>
              <div className={classes.missionDetailsMargin}>
                {rocket.rocket_name}
              </div>
              <div className={classes.externalLink}>
                <a style={{ marginRight: "8px" }} href={`${links.presskit}`}>
                  <img className={classes.dropdownIcon} src={NasaIcon} alt="" />
                </a>
                <a style={{ marginRight: "8px" }} href={`${links.wikipedia}`}>
                  <img className={classes.dropdownIcon} src={WikiIcon} alt="" />
                </a>
                <a href={`${links.video_link}`}>
                  <img
                    className={classes.dropdownIcon}
                    src={youtubeIcon}
                    alt=""
                  />
                </a>
              </div>
            </div>
            <div>{getStatus(launch_success)}</div>
          </div>
          <div className={classes.missionDetails}>
            {details}
            <a href={`${links.wikipedia}`}>Wikipedia</a>
          </div>
          <div className={classes.detailsContainer}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Flight Number</TableCell>
                  <TableCell>{flight_number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mission Name</TableCell>
                  <TableCell>{mission_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rocket Type</TableCell>
                  <TableCell>{rocket.rocket_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rocket Name</TableCell>
                  <TableCell>{rocket.rocket_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manufacture</TableCell>
                  <TableCell>
                    {rocket.second_stage.payloads[0].manufacturer}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nationality</TableCell>
                  <TableCell>
                    {rocket.second_stage.payloads[0].nationality}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Launch Date</TableCell>
                  <TableCell>
                    {moment.unix(launch_date_unix).format("DD MMMM YYYY h:mm")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payload Type</TableCell>
                  <TableCell>
                    {rocket.second_stage.payloads[0].payload_type}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Orbit</TableCell>
                  <TableCell>{rocket.second_stage.payloads[0].orbit}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Launch Site</TableCell>
                  <TableCell>{launch_site.site_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }
  };

  console.log(paginationData, " JACK");

  return (
    <Container>
      <div className={classes.imgHeader}>
        <img className={classes.mainImg} src={spaceXLogo} alt="" />
      </div>
      <Divider />
      <Box>
        <div className={classes.filterContainer}>
          <div className={classes.filterItem}>
            <Select
              variant="standard"
              disableUnderline
              defaultValue=""
              displayEmpty
              value="Past 6 Months"
              onChange={(obj) => console.log(obj, " JACK")}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
              inputProps={{
                IconComponent: () => (
                  <img
                    className={classes.dropdownIcon}
                    src={dropdownIconArrow}
                    alt=""
                  />
                ),
              }}
              renderValue={(value) => {
                return (
                  <Box className={classes.dropdownIconContainer}>
                    <img
                      className={classes.dropdownIcon}
                      src={datePicker}
                      alt=""
                    />
                    <div className={classes.dropdownText}>{value}</div>
                  </Box>
                );
              }}
            >
              <MenuItem key="Last6Months" value="Last6Months">
                Last 6 Months
              </MenuItem>
              <MenuItem key="Past 6 Months" value="Past6Months">
                Past 6 Months
              </MenuItem>
            </Select>
          </div>
          <div className={classes.filterItem}>
            <Select
              variant="standard"
              disableUnderline
              defaultValue="All Launches"
              displayEmpty
              value={launchFilter.launchType}
              onChange={(event) =>
                setLaunchFilter({
                  ...launchFilter,
                  launchType: event.target.value,
                })
              }
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
              label=""
              inputProps={{
                IconComponent: () => (
                  <img
                    className={classes.dropdownIcon}
                    src={dropdownIconArrow}
                    alt=""
                  />
                ),
              }}
              renderValue={(value) => {
                return (
                  <Box className={classes.dropdownIconContainer}>
                    <img
                      className={classes.dropdownIcon}
                      src={filterIcon}
                      alt=""
                    />
                    <div className={classes.dropdownText}>{value}</div>
                  </Box>
                );
              }}
            >
              <MenuItem value="All Launches">All Launches</MenuItem>
              <MenuItem value="Upcoming Launches">Upcoming Launches</MenuItem>
              <MenuItem value="Sucessful Launches">Sucessful Launches</MenuItem>
              <MenuItem value="Failed Launches">Failed Launches</MenuItem>
            </Select>
          </div>
        </div>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Launched UTC</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Mission</TableCell>
                <TableCell>Orbit</TableCell>
                <TableCell>Launch Status</TableCell>
                <TableCell>Rocket</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mainData
                .slice(paginationData.perPageStart, paginationData.perPageEnd)
                .map((row, index) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {(index + 1).toString().length == 1
                        ? `0${index + 1}`
                        : index + 1}
                    </TableCell>
                    <TableCell>
                      {moment
                        .unix(row.launch_date_unix)
                        .format("DD MMMM YYYY h:mm")}
                    </TableCell>
                    <TableCell>{row.launch_site.site_name}</TableCell>
                    <TableCell
                      className={classes.activeMissionName}
                      onClick={() =>
                        setSelectedRow({ selectedRow: row, openModal: true })
                      }
                    >
                      {row.mission_name}
                    </TableCell>
                    <TableCell>
                      {row.rocket.second_stage.payloads[0].orbit}
                    </TableCell>
                    <TableCell>{getStatus(row.launch_success)}</TableCell>
                    <TableCell>
                      {moment
                        .unix(row.launch_date_unix)
                        .format("DD MMMM YYYY h:mm")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {mainData.length >= 12 && (
            <div className={classes.bottomPagination}>
              <div className={classes.paginationContainer}>
                <div
                  className={`${classes.paginationButtonArrow} ${
                    paginationData.currentPage != 0 && classes.cP
                  }`}
                  onClick={(e) => {
                    if (paginationData.currentPage != 0) {
                      setPaginationData({
                        ...paginationData,
                        currentPage: paginationData.currentPage - 1,
                        perPageEnd:
                          paginationData.perPage * paginationData.currentPage,
                        perPageStart:
                          paginationData.perPage *
                          (paginationData.currentPage - 1),
                      });
                    } else {
                      e.preventDefault();
                    }
                  }}
                >
                  <img className={classes.paginationIcon} src={LeftArrow} alt />
                </div>
                {Array.from(Array(Math.round(mainData.length / 12)).keys()).map(
                  (m) => (
                    <div
                      onClick={() =>
                        setPaginationData({
                          ...paginationData,
                          currentPage: m,
                          perPageEnd: paginationData.perPage * (m + 1),
                          perPageStart: paginationData.perPage * m,
                        })
                      }
                      className={`${classes.paginationButton} ${
                        paginationData.currentPage === m &&
                        `${classes.paginationButtonActive}`
                      }`}
                    >
                      {m + 1}
                    </div>
                  )
                )}
                <div
                  className={`${classes.paginationButtonArrow} ${
                    paginationData.currentPage !=
                      Math.round(mainData.length / 12) - 1 && classes.cP
                  }`}
                  onClick={(e) => {
                    if (
                      paginationData.currentPage !=
                      Math.round(mainData.length / 12) - 1
                    ) {
                      setPaginationData({
                        ...paginationData,
                        currentPage: paginationData.currentPage + 1,
                        perPageEnd:
                          paginationData.perPage *
                          (paginationData.currentPage + 2),
                        perPageStart:
                          paginationData.perPage *
                          (paginationData.currentPage + 1),
                      });
                    } else {
                      e.preventDefault();
                    }
                  }}
                >
                  <img
                    className={classes.paginationIcon}
                    src={RightArrow}
                    alt
                  />
                </div>
              </div>
            </div>
          )}
        </TableContainer>
      </Box>
      <Dialog
        fullWidth={false}
        open={selectedRow.openModal}
        onClose={() => setSelectedRow(initialSelectedrow)}
      >
        <Box>{generatePopupData(selectedRow.selectedRow)}</Box>
      </Dialog>
    </Container>
  );
}

export default Dashboard;
