import type { ComponentPropsWithRef } from "react";
import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  motion,
  Reorder,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import { Image, Spacer } from "~/components/uis";
import LottieAnimation from "~/components/uis/LottieAnimation";
import { useIsViewedPlaylistItemIds } from "~/hooks/domains";
import { isHostAtomState, playerAtomState } from "~/store/room";
import { getDurationText } from "~/store/room/utils";
import type { PlaylistItem } from "~/types";
import { usePlaylistContext } from "./context";
import { useRaisedShadow } from "./hooks";

type Props = {
  item: PlaylistItem;
  onClick?: ComponentPropsWithRef<typeof Reorder.Item>["onClick"];
};

const Item = ({ item, onClick }: Props) => {
  const [isHandleActive, setIsHandleActive] = useState(false);
  const controls = useDragControls();
  const { isViewedPlaylistItemIds } = useIsViewedPlaylistItemIds();

  const isNew = !isViewedPlaylistItemIds[item.playlistItemId.toString()];

  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const isHost = useRecoilValue(isHostAtomState);

  const { isDeletingMode, deletingIds, setDeletingIds } = usePlaylistContext();

  const [playerState] = useRecoilState(playerAtomState);

  const isPlayingMusic = item.playlistItemId === playerState.playingMusicId;

  const Component = isHost ? Reorder.Item : motion.div;

  const isDeletingItem = deletingIds.includes(item.playlistItemId);

  return (
    <Component
      {...(isHost ? {} : { layout: true })}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ cursor: "grabbing" }}
      onDragEnd={() => {
        setIsHandleActive(false);
      }}
      value={item}
      id={`${item.playlistItemId}`}
      css={css`
        display: flex;
        padding: 0 8px;
        border-radius: 16px;
        height: 76px;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        transition: background-color 300ms;
      `}
      style={{ boxShadow, y, cursor: "pointer" }}
      onClick={onClick}
    >
      {isDeletingMode && (
        <>
          <label
            onClick={(e) => e.stopPropagation()}
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              width: 30px;
              height: 30px;
              border-radius: 15px;
              border: 2px solid ${isDeletingItem ? "transparent" : "#3A3A3A"};
              cursor: pointer;
              background-color: ${isDeletingItem ? "#007aff" : "transparent"};
            `}
            htmlFor={`playlsit-item-checkbox_${item.playlistItemId}`}
          >
            {isDeletingItem && (
              <Image
                src="/images/check-white.svg"
                width={16}
                height={12}
                alt="check"
              />
            )}
          </label>
          <input
            onClick={(e) => e.stopPropagation()}
            id={`playlsit-item-checkbox_${item.playlistItemId}`}
            css={css`
              display: none;
            `}
            defaultChecked={isDeletingItem}
            type="checkbox"
            onChange={(e) =>
              setDeletingIds((ids) =>
                e.target.checked
                  ? [...ids, item.playlistItemId]
                  : ids.filter((id) => id !== item.playlistItemId)
              )
            }
          />
        </>
      )}
      <div
        style={{
          width: 74,
          height: 74,
          position: "relative",
          overflow: "hidden",
          borderRadius: 8,
        }}
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          width={74}
          height={104}
          lazy
          mode="cover"
          placeholder="/images/play.svg"
          style={{ position: "absolute", top: -15 }}
        />
      </div>
      <Spacer
        type="vertical"
        gap={8}
        css={css`
          flex: 1;
        `}
      >
        <Spacer type="horizontal" align="end">
          <S.Title
            css={css`
              width: 100%;
              color: ${isPlayingMusic ? "#007aff" : "#ffffff"};
              font-size: 14px;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-word;
              display: -webkit-box;
              -webkit-line-clamp: 2; // 원하는 라인수
              -webkit-box-orient: vertical;
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
            {item.title}{" "}
          </S.Title>
          {isPlayingMusic && (
            <span
              style={{
                width: 30,
                height: 20,
              }}
            >
              <LottieAnimation.Equalizer
                height={20}
                width={30}
                color="blue"
                isPaused={!playerState.isPlaying}
              />
            </span>
          )}
        </Spacer>
        <div
          css={css`
            font-weight: 400;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.74);
          `}
        >
          {getDurationText(item.duration || 0)}
        </div>
      </Spacer>
      {isHost && (
        <motion.div
          className="reorder-handle"
          onTapStart={(e) => {
            controls.start(e);
            setIsHandleActive(true);
          }}
          onTap={(e) => {
            setIsHandleActive(false);
          }}
          css={css`
            touch-action: none;
            height: 36px;
            width: 46px;
            border-radius: 8px;
            background-color: ${isHandleActive
              ? "#007AFF"
              : "rgba(255, 255, 255, 0.08)"};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
            transition: background-color 200ms;
          `}
          style={{ cursor: "grab" }}
        >
          <div
            css={css`
              height: 3px;
              background-color: white;
              width: 24px;
              border-radius: 999px;
              transition: background-color 200ms;
            `}
          />
          <div
            css={css`
              height: 3px;
              background-color: white;
              width: 24px;
              border-radius: 999px;
              transition: background-color 200ms;
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
