import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DefCard from "./components/DefCard";
import AreaChartInteractiveExample from "./components/ArChart"; // Import the component
import Header from "./components/Header";
import { Card, DonutChart, Title } from "@tremor/react";
import { fetchData, stringToDate } from "./utils/requests";
import BarchartComp from "./components/BarchartComp";
import Sidebar from "./components/Sheet";
import { useCallback } from "react";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Clinical Sentix
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function generateFakeTweets(count) {
  const tweets = [];
  for (let i = 0; i < count; i++) {
    tweets.push({
      id: i + 1,
      text: `This is a fake tweet ${i + 1}`,
      date: new Date().toISOString(),
    });
  }
  return tweets;
}

function generateFakeNamedEntities(count) {
  const entities = [];
  const names = ["Headache", "IUD", "Birth-control", "abdominal-pain", "depression"];
  for (let i = 0; i < count; i++) {
    entities.push({
      id: i + 1,
      name: names[i % names.length],
      count: Math.floor(Math.random() * 100),
    });
  }
  return entities;
}

// TODO remove, this demo shouldn't need to reset the theme.
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const fakeTimelineData = [
  { date: "Jan 23", "2022": 45, "2023": 78 },
  { date: "Feb 23", "2022": 52, "2023": 71 },
  { date: "Mar 23", "2022": 48, "2023": 80 },
  { date: "Apr 23", "2022": 61, "2023": 65 },
  { date: "May 23", "2022": 55, "2023": 58 },
  { date: "Jun 23", "2022": 67, "2023": 62 },
  { date: "Jul 23", "2022": 60, "2023": 54 },
  { date: "Aug 23", "2022": 72, "2023": 49 },
  { date: "Sep 23", "2022": 65, "2023": 52 },
  { date: "Oct 23", "2022": 68, "2023": null },
  { date: "Nov 23", "2022": 74, "2023": null },
  { date: "Dec 23", "2022": 71, "2023": null },
];

export default function Dashboard() {
  const navigate = useNavigate();
  //👇🏻 fetch the drugname from the URL
  const { drugname } = useParams();
  //👇🏻 the required states
  const [loading, setLoading] = useState(true);
  const [tweetData, setTweetData] = useState([]);
  const [error, setError] = useState(false);
  const [date, setDate] = useState("2000-1-1");
  const [open, setOpen] = useState(false);
  const [tweetsFromDate, setTweetsFromDate] = useState([]);

  //👇🏻 fetch the user details on page load
  useEffect(() => {
    fetchData(drugname, setTweetData, setError, setLoading);
    console.log("fetching data");
  }, [drugname]);

  const tweetDataByDate = useCallback(
    (date) => {
      const tweets = calculateTweetsByTimeframe(tweetData, date);
      setTweetsFromDate(tweets);
    },
    [tweetData]
  );

  useEffect(() => {
    tweetDataByDate(stringToDate(date, "yyyy-mm-dd", "-"));
  }, [date, tweetDataByDate]);

  const calculateTweetsByTimeframe = (tweets, start) => {
    const currentDate = new Date();
    const startDate = !!start ? start : new Date();

    if (Array.isArray(tweets)) {
      const filteredTweets = tweets.filter((tweet) => {
        const tweetDate = new Date(tweet.date);
        return tweetDate >= startDate && tweetDate <= currentDate;
      });
      return filteredTweets;
    } else {
      return [];
    }
  };


  if (loading || !tweetData) {
    return <div className="loading">Loading...please wait</div>;
  }
  if (error) {
    return navigate("/error");
  }

  // Generate fake data
  const fakeTweetData = generateFakeTweets(10);
  const totalPositiveTweets = 10;
  const totalNegativeTweets = 40;
  const totalNeutralTweets = 50;
  const fakeNamedEntities = generateFakeNamedEntities(10);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            py: 0,
            my: 0,
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mb: 4 }}>
            {/* Navbar */}
            <Header data={drugname} />

            <Grid container spacing={3}>
              {/* Area Chart (Time series)*/}
              <Grid item xs={12} md={8} lg={9}>
                <Sidebar tweetData={tweetsFromDate} isOpen={open} date={date} />
                <AreaChartInteractiveExample
                  timeline={fakeTimelineData}
                  setDate={setDate} // Pass necessary props
                  setOpen={setOpen} // Pass necessary props
                />
              </Grid>

              {/* Pie Chart (Sentiment) */}
              <Grid item xs={12} md={4} lg={3}>
                <Card>
                  <Title>Sentiment Overview</Title>
                  <DonutChart
                    className="h-48 mt-4"
                    data={[
                      {
                        lang: "Positive",
                        tweets: totalPositiveTweets,
                      },
                      {
                        lang: "Negative",
                        tweets: totalNegativeTweets,
                      },
                      { lang: "Neutral", tweets: totalNeutralTweets },
                    ]}
                    category="tweets"
                    index="lang"
                    variant="pie"
                    marginTop="mt-6"
                    colors={["indigo", "slate", "gray"]}
                  />
                </Card>
              </Grid>

              {/* Bar Chart (Named Entity count) */}
              <Grid item xs={12} md={12} lg={12}>
                <BarchartComp namedData={fakeNamedEntities} />
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <DefCard />
              </Grid>
            </Grid>
          </Container>

          <footer>
            <Copyright sx={{ pt: 4 }} />
          </footer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
