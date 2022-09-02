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
  const [playlist, setPlaylist] = useRecoilState(playlistAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);

  const router = useRouter();

  const { roomId } = router.query;

  const { publish } = useChangePlaylistOrder(Number(roomId));

  const { publish: publishUpdatePlayerState } = useUpdatePlayerState(
    Number(roomId)
  );

  return (
    <Reorder.Group
      axis="y"
      onReorder={(newPlaylist: PlaylistItem[]) => {
        setPlaylist(() => {
          const { playlistItemId, prevPlaylistItemIdToMove } =
            newPlaylist.reduce(
              (prev, { playlistItemId }, index) => {
                const isDifferent =
                  playlist[index].playlistItemId !== playlistItemId;

                return isDifferent
                  ? {
                      ...prev,
                      playlistItemId,
                      prevPlaylistItemIdToMove:
                        newPlaylist[index - 1 < 0 ? index : index - 1]
                          .playlistItemId,
                    }
                  : prev;
              },
              { playlistItemId: 0, prevPlaylistItemIdToMove: 0 }
            );

          publish({ playlistId, playlistItemId, prevPlaylistItemIdToMove });

          return newPlaylist;
        });
      }}
      values={playlist}
      css={css`
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 19px 8px 0;
        padding-bottom: 60px;
      `}
    >
      {playlist.map((item) => {
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
          padding-bottom: 60px;
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
