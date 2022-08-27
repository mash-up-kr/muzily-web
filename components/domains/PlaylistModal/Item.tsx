import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion, Reorder, useMotionValue } from "framer-motion";
import { useRecoilState } from "recoil";
import { Image, Spacer } from "~/components/uis";
import LottieAnimation from "~/components/uis/LottieAnimation";
import { useRoomStore } from "~/store";
import { playerAtomState } from "~/store/room";
import { getDurationText } from "~/store/room/utils";
import type { PlaylistItem } from "~/types";
import { usePlaylistContext } from "./context";
import { useRaisedShadow } from "./hooks";

type Props = {
  item: PlaylistItem;
};

const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const {
    state: { isHost },
  } = useRoomStore();
  const { isDeletingMode, deletingIds, setDeletingIds, setIsDeletingMode } =
    usePlaylistContext();

  const [playerState] = useRecoilState(playerAtomState);

  const ItemName = isHost ? Reorder.Item : motion.div;

  return (
    <ItemName
      {...(isHost ? {} : { layout: true })}
      whileDrag={{ cursor: "grabbing" }}
      value={item}
      id={`${item.playlistItemId}`}
      css={css`
        display: flex;
        padding: 16px;
        border-radius: 16px;
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        height: 90px;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        cursor: ${isHost ? "grab" : "none"};
      `}
      style={{ boxShadow, y }}
    >
      {isDeletingMode && (
        <input
          defaultChecked={deletingIds.includes(item.playlistItemId)}
          type="checkbox"
          onChange={(e) =>
            e.target.checked
              ? setDeletingIds((prev) => [...prev, item.playlistItemId])
              : setDeletingIds((prev) =>
                  prev.filter(
                    (existingId) => existingId !== item.playlistItemId
                  )
                )
          }
        />
      )}
      <Image
        src={item.thumbnail}
        alt={item.title}
        width={74}
        height={74}
        lazy
        mode="contain"
        css={css`
          border: 1px solid rgba(255, 255, 255, 0.1);
        `}
      />
      <Spacer
        type="vertical"
        gap={8}
        css={css`
          flex: 1;
        `}
      >
        <Spacer
          type="horizontal"
          align="center"
          justify="flex-start"
          gap={6}
          style={{ height: 16 }}
        >
          <S.Title
            css={css`
              color: ${item.playlistItemId === playerState.playingMusicId
                ? "#007aff"
                : "inherit"};
            `}
          >
            {item.playlistItemId} / {item.title}
          </S.Title>
          <div>
            {item.playlistItemId === playerState.playingMusicId && (
              <LottieAnimation.Equalizer
                height={20}
                width={30}
                color="blue"
                isPaused={!playerState.isPlaying}
              />
            )}
          </div>
        </Spacer>
        <S.Duration>{getDurationText(item.duration || 0)}</S.Duration>
      </Spacer>
      {isHost && (
        <div
          css={css`
            height: 36px;
            width: 46px;
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
          `}
        >
          <div
            css={css`
              height: 3px;
              background-color: white;
              width: 24px;
              border-radius: 999px;
            `}
          />
          <div
            css={css`
              height: 3px;
              background-color: white;
              width: 24px;
              border-radius: 999px;
            `}
          />
        </div>
      )}
    </ItemName>
  );
};

const S = {
  MusicItem: styled.div`
    background-color: #007aff;

    cursor: pointer;
    flex: 1;
    padding: 16px 18px;
    gap: 16px;
    border-radius: 7px;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.08);

    display: flex;
    align-items: center;
  `,

  Title: styled.div`
    font-weight: 600;
    font-size: 14px;
    text-align: left;
  `,

  Duration: styled.div`
    font-weight: 400;
    font-size: 12px;
    color: rgba(74, 74, 74, 0.74);
  `,

  Kebab: styled.div`
    cursor: pointer;
    background-color: #fff;
    border-radius: 7px;
    width: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    /* width: 100%;
    height: 100%; */
    border: 1px solid rgba(255, 255, 255, 0.08);
  `,

  Checkbox: styled.div`
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    background-color: blue;
    border-radius: 50%;
  `,
};

export default Item;
