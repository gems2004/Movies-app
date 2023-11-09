import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  useDiscoverMoviesQuery,
  useDiscoverTvShowsQuery,
  useGetPopularMoviesQuery,
  useGetPopularTvShowsQuery,
} from "../features/movies/moviesSlice";

function Drawer({ title, type, shows, isFetching, isSuccess, isLoading }) {
  const [loadedShows, setLoadedShows] = useState([]);
  const [page, setPage] = useState(2);

  useEffect(() => {
    setLoadedShows(shows?.results);
  }, [shows]);

  // const ref = useRef(null);

  function scroller(scrollOffset) {
    ref.current.scrollLeft += scrollOffset;
  }
  let data;
  type === "discover"
    ? (data = useDiscoverMoviesQuery(page).data)
    : type === "popular"
    ? (data = useGetPopularMoviesQuery(page).data)
    : type === "discoverTv"
    ? (data = useDiscoverTvShowsQuery(page).data)
    : (data = useGetPopularTvShowsQuery(page).data);

  function loadMoreShows() {
    const newShows = data?.results;
    console.log(data);
    setLoadedShows((prevState) => [...prevState, ...newShows]);
    setPage((prevState) => prevState + 1);
  }
  console.log(shows);
  let content;
  if (isFetching) content = <p>Loading...</p>; // Spinner here
  else if (!isFetching && isSuccess && !isLoading) {
    content = loadedShows?.map((show) => {
      return (
        <div key={show.id} className="mr-4">
          <Link
            to={`/${show.first_air_date ? "tv" : "movie"}/${show.id}`}
            className="flex flex-col justify-around items-center min-w-[100px] min-h-[150px]"
          >
            <div className="w-[176px] h-[264px]">
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt=""
                className="rounded-2xl"
              />
            </div>
            <div className="text-center">
              <h2>{show.title || show.name}</h2>
              <p>{show.release_date || show.first_air_date}</p>
            </div>
          </Link>
        </div>
      );
    });
  } else content = <p>Oops! Nothing found</p>;

  return (
    <div className="text-white px-4">
      <h1 className="font-extrabold text-2xl pt-4">{title}:</h1>
      <div
        className="flex overflow-x-scroll relative scroll-smooth no-scrollbar"
        // ref={ref}
      >
        {content}
        <button
          className="mt-28"
          onClick={loadMoreShows}
          disabled={isFetching ? true : false}
        >
          <div className="mb-40">
            <FontAwesomeIcon
              icon={faArrowRight}
              style={{ color: "#dc2626" }}
              size="4x"
            />
            <div className="w-20 text-[11px] text-red-600">Load More</div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Drawer;
