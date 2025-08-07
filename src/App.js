import { useEffect, useState } from "react";
import NavBar from "./components/NavBar.component";
import Logo from "./components/Logo.component";
import Search from "./components/SearchBar.component";
import NumResults from "./components/NumberResults.comopnent";
import Box from "./components/Box.component";
import LoadState from "./components/LoadState.component";
import SelectedMovie from "./components/SelectedMovie.component";
import MovieList from "./components/MovieList.component";
import WatchedSummary from "./components/WatchedSummary.component";
import WatchedList from "./components/WatchedList.component";
import ErrorState from "./components/ErorState.component";
import Main from "./components/Main.component";
import tempMovieData from"./components/tempMovieData";
import KEY from "./env/API-KEY";


export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handdleAddwatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const controller = new AbortController();

    async function getMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!query.length) {
      setMovies(tempMovieData);
      setError("");
      setIsLoading(false);
      return;
    }
    handleCloseMovie();
    getMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <LoadState />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorState message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <SelectedMovie
              id={selectedId}
              onClose={handleCloseMovie}
              onAddWatched={handdleAddwatched}
              watched={watched}
            ></SelectedMovie>
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary>
              <WatchedList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              ></WatchedList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
