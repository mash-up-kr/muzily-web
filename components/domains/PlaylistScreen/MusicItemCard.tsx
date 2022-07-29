import React, { useRef } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { useDrag, useDrop, type XYCoord } from "react-dnd";
import type { Music } from "~/types/musics";

interface MusicCardItemProps {
  active: boolean;
  onClick: () => void;
  item: Music;
  index: number;
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
}: MusicCardItemProps) {
  const dragRef = useRef<HTMLDivElement>(null);

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
      <S.MusicItem key={item.id} active={active} onClick={onClick}>
        <S.Title>{item.title}</S.Title>
        <S.Artist active={active}>{item.artist}</S.Artist>
      </S.MusicItem>

      <S.Kebab active={active} ref={dragRef}>
        <Image
          src={active ? "/images/kebab-black.svg" : "/images/kebab.svg"}
          alt="kebab"
          width={4}
          height={15}
          style={{ color: "blue" }}
        />
      </S.Kebab>
    </S.Container>
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
    /* display: flex; */
    color: ${(p) => (p.active ? "#007aff" : "#fff")};
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  `,

  Title: styled.div`
    font-weight: 600;
    font-size: 14px;
    line-height: 155%;
  `,

  Artist: styled.div<{ active: boolean }>`
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
    display: flex;
    justify-content: center;
    align-items: center;
    /* width: 100%;
    height: 100%; */
    border-left: 0.7px solid rgba(255, 255, 255, 0.08);
  `,
};

export default MusicItemCard;
