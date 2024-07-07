import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TextField, CircularProgress } from "@mui/material";

const TravelMatches = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchTravelMatches = async (page = 0, limit = 50) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/travelMatches?limit=${limit}&offset=${page * limit}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();

      // Filtering out matches that already exist in state
      const newMatches = data.filter(newMatch => !matches.some(match => match.TravelMatchId === newMatch.TravelMatchId));

      setMatches(prevMatches => [...prevMatches, ...newMatches]);
      setHasMore(newMatches.length > 0); // Check if there are more matches to load
      setLoading(false);
      setSearchError(""); // Clear search error message on successful fetch
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelMatches(page);
  }, [page]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedMatches = () => {
    let sortedMatches = [...matches];
    if (sortConfig.key) {
      sortedMatches.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedMatches;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setSearchError(""); // Clear previous search error message on new search
  };

  const matchesToShow = searchTerm.trim().length === 0 ? sortedMatches() : sortedMatches().filter((match) =>
    Object.values(match).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const highlightSearchTerm = (text) => {
    if (searchTerm.trim().length === 0) {
      return text;
    }

    const lowerCaseText = text.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const index = lowerCaseText.indexOf(lowerCaseSearchTerm);

    if (index === -1) {
      return text;
    }

    const firstPart = text.substring(0, index);
    const highlightedPart = text.substring(index, index + searchTerm.length);
    const lastPart = text.substring(index + searchTerm.length);

    return (
      <>
        {firstPart}
        <span style={{ backgroundColor: "#ffff00", fontWeight: "bold" }}>{highlightedPart}</span>
        {lastPart}
      </>
    );
  };

  const createSortHandler = (key, label) => {
    return (
      <TableSortLabel
        active={sortConfig.key === key}
        direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
        onClick={() => requestSort(key)}
      >
        {label}
      </TableSortLabel>
    );
  };

  useEffect(() => {
    if (searchTerm.trim().length > 0 && matchesToShow.length === 0) {
      setSearchError("No matching results found.");
    } else {
      setSearchError("");
    }
  }, [searchTerm, matchesToShow]);

  const lastMatchElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Travel Matches
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        margin="normal"
        style={{ marginBottom: '2rem', width: '30%' }}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{createSortHandler('VolunteerFullName', 'Volunteer Name')}</TableCell>
              <TableCell>{createSortHandler('MatchDate', 'Match Date')}</TableCell>
              <TableCell>{createSortHandler('MatchTime', 'Match Time')}</TableCell>
              <TableCell>{createSortHandler('TravelOrigin', 'Origin')}</TableCell>
              <TableCell>{createSortHandler('TravelDestination', 'Destination')}</TableCell>
              <TableCell>{createSortHandler('TravelTime', 'Travel Time')}</TableCell>
              <TableCell>{createSortHandler('NumberOfPassengers', 'Passengers')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchesToShow.map((match, index) => {
              if (matchesToShow.length === index + 1) {
                return (
                  <TableRow ref={lastMatchElementRef} key={match.TravelMatchId}>
                    <TableCell>{highlightSearchTerm(`${match.VolunteerFirstName} ${match.VolunteerLastName}`)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.MatchDate)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.MatchTime)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.TravelOrigin)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.TravelDestination)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.TravelTime)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.NumberOfPassengers.toString())}</TableCell>
                  </TableRow>
                );
              } else {
                return (
                  <TableRow key={match.TravelMatchId}>
                    <TableCell>{highlightSearchTerm(`${match.VolunteerFirstName} ${match.VolunteerLastName}`)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.MatchDate)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.MatchTime)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.TravelOrigin)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.TravelDestination)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.TravelTime)}</TableCell>
                    <TableCell>{highlightSearchTerm(match.NumberOfPassengers.toString())}</TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {searchError && <Typography color="error">{searchError}</Typography>}
      {loading && <CircularProgress />}
    </Container>
  );
};

export default TravelMatches;
