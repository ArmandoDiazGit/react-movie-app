import WatchedListItem from "./WatchedListItem.component";

export default function WatchedList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched?.map((movie) => (
        <WatchedListItem
          key={movie.imdbID}
          movie={movie}
          handleDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}
