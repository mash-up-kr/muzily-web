import { useState } from "react";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import { AnimateSharedLayout, Reorder } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  useChangePlaylistOrder,
  useUpdatePlayerState,
} from "~/hooks/webSocket";
import { playlistAtomState } from "~/store/playlist";
import { playlistIdAtomState } from "~/store/room";
import type { PlaylistItem } from "~/types";
import Item from "./Item";

const Host = () => {
  const [playlist] = useRecoilState(playlistAtomState);
  const [localPlaylist, setLocalPlaylist] = useState(playlist);
  const playlistId = useRecoilValue(playlistIdAtomState);

  const router = useRouter();

  const { roomId } = router.query;

  const { publish } = useChangePlaylistOrder(Number(roomId), {
    playlistId,
    playlistItemId: 1,
    prevPlaylistItemIdToMove: 0,
  });

  const { publish: publishUpdatePlayerState } = useUpdatePlayerState(
    Number(roomId)
  );

  return (
    <Reorder.Group
      axis="y"
      onReorder={(newLocalPlaylist: PlaylistItem[]) => {
        console.log(
          "old",
          localPlaylist.map(({ playlistItemId }) => playlistItemId)
        );
        setLocalPlaylist(() => {
          const { playlistItemId, prevPlaylistItemIdToMove } =
            newLocalPlaylist.reduce(
              (prev, { playlistItemId }, index) => {
                const isDifferent =
                  localPlaylist[index].playlistItemId !== playlistItemId;

                return isDifferent
                  ? {
                      ...prev,
                      playlistItemId,
                      prevPlaylistItemIdToMove: index,
                    }
                  : prev;
              },
              { playlistItemId: 0, prevPlaylistItemIdToMove: 0 }
            );

          console.log({ playlistItemId, prevPlaylistItemIdToMove });

          publish({ playlistId, playlistItemId, prevPlaylistItemIdToMove });

          return newLocalPlaylist;
        });
      }}
      values={localPlaylist}
      css={css`
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 0 8px;
      `}
    >
      {localPlaylist.map((item) => {
        const { playlistId, playlistItemId } = item;

        return (
          <Item
            key={item.playlistItemId}
            item={item}
            onClick={() => {
              publishUpdatePlayerState({
                playlistId,
                playlistItemId,
                playStatus: "PLAY",
              });
            }}
          />
        );
      })}
    </Reorder.Group>
  );
};

const Guest = () => {
  const [playlist] = useRecoilState(playlistAtomState);

  return (
    <AnimateSharedLayout>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 0 8px;
        `}
      >
        {playlist.map((item) => (
          <Item key={item.playlistItemId} item={item} />
        ))}
      </div>
    </AnimateSharedLayout>
  );
};

const Playlist = {
  Host,
  Guest,
};

export default Playlist;
