import type { ComponentPropsWithRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  motion,
  Reorder,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { useRecoilState } from "recoil";
import { Image, Spacer } from "~/components/uis";
import LottieAnimation from "~/components/uis/LottieAnimation";
import { useIsViewedPlaylistItemIds } from "~/hooks/domains";
import { useRoomStore } from "~/store";
import { playerAtomState } from "~/store/room";
import { getDurationText } from "~/store/room/utils";
import type { PlaylistItem } from "~/types";
import { usePlaylistContext } from "./context";
import { useRaisedShadow } from "./hooks";

type Props = {
  item: PlaylistItem;
  onClick?: ComponentPropsWithRef<typeof Reorder.Item>["onClick"];
};

const Item = ({ item, onClick }: Props) => {
  const controls = useDragControls();
  const { isViewedPlaylistItemIds } = useIsViewedPlaylistItemIds();

  const isNew = !isViewedPlaylistItemIds[item.playlistItemId.toString()];

  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const {
    state: { isHost },
  } = useRoomStore();
  const { isDeletingMode, deletingIds, setDeletingIds } = usePlaylistContext();

  const [playerState] = useRecoilState(playerAtomState);

  const isPlayingMusic = item.playlistItemId === playerState.playingMusicId;

  const Component = isHost ? Reorder.Item : motion.div;

  return (
    <Component
      {...(isHost ? {} : { layout: true })}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ cursor: "grabbing" }}
      value={item}
      id={`${item.playlistItemId}`}
      css={css`
        display: flex;
        padding: 16px;
        border-radius: 16px;
        background-color: ${isPlayingMusic
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.5)"};
        border: 1px solid rgba(255, 255, 255, 0.1);
        height: 90px;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        filter: ${isPlayingMusic ? "drop-shadow(0 0 16px #007bff8d)" : ""};
        transition: background-color 300ms;
      `}
      style={{ boxShadow, y, cursor: "pointer" }}
      onClick={onClick}
    >
      {isDeletingMode && (
        <input
          defaultChecked={deletingIds.includes(item.playlistItemId)}
          type="checkbox"
          onChange={(e) =>
            setDeletingIds((ids) =>
              e.target.checked
                ? [...ids, item.playlistItemId]
                : ids.filter((id) => id !== item.playlistItemId)
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
        mode="cover"
        placeholder="/images/play.svg"
      />
      <Spacer
        type="vertical"
        gap={8}
        css={css`
          flex: 1;
        `}
      >
        <S.Title
          css={css`
            width: 100%;
            color: ${isPlayingMusic ? "#ffffff" : "#ffffff8a"};
            font-size: 14px;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-word;
            -webkit-line-clamp: 2; // 원하는 라인수
            -webkit-box-orient: vertical;
            filter: ${isPlayingMusic
              ? "drop-shadow(0 0 4px #007aff) drop-shadow(0 0 1px #007aff)"
              : "#ffffff8a"};
            transition: color 500ms;
          `}
          style={{ position: "relative" }}
        >
          {isNew && (
            <>
              <span
                css={css`
                  font-size: 9px;
                  background-color: #007aff;
                  border-radius: 4px;
                  padding: 2px 4px;
                  color: white;
                `}
              >
                New
              </span>
              {"  "}
            </>
          )}
          {item.playlistItemId} / {item.title}{" "}
          {isPlayingMusic && (
            <span
              style={{ width: 30, height: 20, position: "absolute", bottom: 3 }}
            >
              <LottieAnimation.Equalizer
                height={20}
                width={30}
                color="blue"
                isPaused={!playerState.isPlaying}
              />
            </span>
          )}
        </S.Title>
        <div
          css={css`
            font-weight: 400;
            font-size: 12px;
            color: ${isPlayingMusic
              ? "rgba(255, 255, 255, 0.74)"
              : "rgba(74, 74, 74, 0.74)"};
          `}
        >
          {getDurationText(item.duration || 0)}
        </div>
      </Spacer>
      {isHost && (
        <motion.div
          className="reorder-handle"
          onTapStart={(e) => controls.start(e)}
          css={css`
            touch-action: none;
            height: 36px;
            width: 46px;
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
          `}
          style={{ cursor: "grab" }}
        >
          <div
            css={css`
              height: 3px;
              background-color: rgba(255, 255, 255, 0.14);
              width: 24px;
              border-radius: 999px;
            `}
          />
          <div
            css={css`
              height: 3px;
              background-color: rgba(255, 255, 255, 0.1);
              width: 24px;
              border-radius: 999px;
            `}
          />
        </motion.div>
      )}
    </Component>
  );
};

const S = {
  Title: styled.div`
    font-weight: 600;
    font-size: 14px;
    text-align: left;
  `,
};

export default Item;
