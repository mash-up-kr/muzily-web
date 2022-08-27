import { useEffect } from "react";
import { useLocalStorage } from "~/hooks/commons";
import type { Playlist } from "~/types";

const useIsViewedPlaylistItemIds = () => {
  const [isViewedPlaylistItemIds, setIsViewedPlaylistItemIds] =
    useLocalStorage<{ [playlistItemId: string]: boolean }>(
      "isViewedPlaylistItemIds",
      {}
    );

  return { isViewedPlaylistItemIds, setIsViewedPlaylistItemIds };
};

export const useIfUnmount = (playlist: Playlist) => {
  const { isViewedPlaylistItemIds, setIsViewedPlaylistItemIds } =
    useIsViewedPlaylistItemIds();

  return useEffect(() => {
    return () => {
      const newIsViewedPlaylistItemIds = {
        ...isViewedPlaylistItemIds,
        ...playlist.reduce(
          (acc, { playlistItemId }) => ({
            ...acc,
            [playlistItemId.toString()]: true,
          }),
          {}
        ),
      };

      setIsViewedPlaylistItemIds(newIsViewedPlaylistItemIds);
    };
  }, []);
};

useIsViewedPlaylistItemIds.IfUnmount = useIfUnmount;

export default useIsViewedPlaylistItemIds;
