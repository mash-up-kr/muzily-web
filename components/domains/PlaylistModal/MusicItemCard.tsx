import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { useDrag, useDrop, type XYCoord } from "react-dnd";
import { useRecoilState } from "recoil";
import { Spacer } from "~/components/uis";
import LottieAnimation from "~/components/uis/LottieAnimation";
import { useRoomStore } from "~/store";
import { removeListAtomState } from "~/store/playlist";
import { playerAtomState } from "~/store/room";
import { getDurationText } from "~/store/room/utils";
import type { PlaylistItem } from "~/types";

interface MusicCardItemProps {
  active: boolean;
  onClick: () => void;
  item: PlaylistItem;
  index: number;
  deleteMode: boolean;
  moveCard: (from: number, to: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DRAG_TYPE = "playlist";

function MusicItemCard({
  onClick,
  active,
  item,
  index,
  moveCard,
  deleteMode,
}: MusicCardItemProps) {
  const {
    state: { isHost },
  } = useRoomStore();

  const dragRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState(false);
  const [playerState] = useRecoilState(playerAtomState);
  const [, setRemoveList] = useRecoilState(removeListAtomState);

  const handleClickCheckButton = (
    e: React.MouseEvent<HTMLDivElement>,
    id: number
  ) => {
    e.stopPropagation();
    setChecked((prev) => !prev);

    if (!checked) {
      return setRemoveList((list) => [...list, id]);
    }
    setRemoveList((list) => list.filter((item) => item !== id));
  };

  useEffect(() => {
    setChecked(false);
    setRemoveList([]);
  }, [deleteMode, setRemoveList]);

  const [{ opacity, isDragging }, drag, preview] = useDrag({
    type: DRAG_TYPE,
    item: { index },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: DRAG_TYPE,
    hover(item: DragItem, monitor) {
      // TODO(@Young-mason): Throttling 처리 필요
      if (!dragRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return null;
      }

      const hoverBoundingRect = dragRef.current.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = index;
    },
  });

  drag(drop(dragRef));

  return (
    <S.Container ref={(node) => drop(preview(node))} opacity={opacity}>
      <S.MusicItem key={item.videoId} active={active} onClick={onClick}>
        {deleteMode && (
          <Checkbox
            onClick={(e) => handleClickCheckButton(e, item.id)}
            color={active ? "blue" : "white"}
            active={checked}
            bgColor={active ? "#007AFF" : "#5EABFF"}
          />
        )}

        <Spacer type="vertical">
          <S.Title>
            {item.title}
            {active && (
              <LottieAnimation.Equalizer
                height={20}
                width={30}
                color="blue"
                isPaused={!playerState.isPlaying}
              />
            )}
          </S.Title>
          <S.Duration active={active}>
            {getDurationText(item.duration || 0)}
          </S.Duration>
        </Spacer>
      </S.MusicItem>

      {isHost && (
        <S.Kebab active={active} ref={dragRef}>
          <Image
            src={active ? "/images/kebab-black.svg" : "/images/kebab.svg"}
            alt="kebab"
            width={4}
            height={15}
            style={{ color: "blue" }}
          />
        </S.Kebab>
      )}
    </S.Container>
  );
}

interface CheckboxProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  active: boolean;
  bgColor: string;
  color: "white" | "blue";
}

function Checkbox({ onClick, active, bgColor = "#fff", color }: CheckboxProps) {
  return (
    <S.Checkbox onClick={onClick} bgColor={bgColor}>
      {active && (
        <Image
          src={`/images/${color === "white" ? "check" : "check-white"}.svg`}
          alt="check"
          width={10}
          height={10}
        />
      )}
    </S.Checkbox>
  );
}

const S = {
  Container: styled.div<{ opacity: number }>`
    display: flex;
    height: 70px;
    opacity: ${(p) => p.opacity};
  `,

  MusicItem: styled.div<{ active: boolean }>`
    background-color: ${(p) => (p.active ? "#fff" : "#007aff")};

    cursor: pointer;
    flex: 1;
    padding: 16px 18px;
    gap: 16px;
    border-radius: 7px;
    color: ${(p) => (p.active ? "#007aff" : "#fff")};
    border: 1px solid rgba(255, 255, 255, 0.08);

    display: flex;
    align-items: center;
  `,

  Title: styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 155%;
    /* width: 230px; */
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */

    display: flex;
    align-items: center;
    gap: 8px;
  `,

  Duration: styled.div<{ active: boolean }>`
    font-weight: 400;
    font-size: 12px;
    line-height: 155%;

    display: flex;
    align-items: center;
    letter-spacing: -0.420386px;

    color: ${(p) =>
      p.active ? "rgba(74, 74, 74, 0.74)" : "rgba(255, 255, 255, 0.54)"};
  `,

  Kebab: styled.div<{ active: boolean }>`
    cursor: pointer;
    background-color: ${(p) => (p.active ? "#fff" : "#007aff")};
    border-radius: 7px;
    width: 64px;
    display: ${(p) => (p.hidden ? "none" : "flex")};
    justify-content: center;
    align-items: center;
    /* width: 100%;
    height: 100%; */
    border: 1px solid rgba(255, 255, 255, 0.08);
  `,

  Checkbox: styled.div<{ bgColor: string }>`
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    background-color: ${(p) => p.bgColor};
    border-radius: 50%;
  `,
};
export default MusicItemCard;
