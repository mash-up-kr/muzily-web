import { useState } from "react";
import { css } from "@emotion/react";
import { Reorder } from "framer-motion";
import { useRecoilState } from "recoil";
import { playlistAtomState } from "~/store/playlist";
import Item from "./Item";

const Host = () => {
  const [playlist] = useRecoilState(playlistAtomState);

  const [localPlaylist, setLocalPlaylist] = useState(playlist);

  return (
    <Reorder.Group
      axis="y"
      onReorder={setLocalPlaylist}
      values={localPlaylist}
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
    </Reorder.Group>
  );
};

const Guest = () => {
  const [playlist] = useRecoilState(playlistAtomState);

  return (
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
  );
};

const Playlist = {
  Host,
  Guest,
};

export default Playlist;
