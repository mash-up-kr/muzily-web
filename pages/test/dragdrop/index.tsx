import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import type { MotionValue } from "framer-motion";
import { Reorder, useMotionValue, animate } from "framer-motion";
import { Toast } from "~/components/uis";

const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];

const DragDropPage = () => {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    Toast.show(`items: ${items.join(", ")}`);
  }, [items]);

  return (
    <Reorder.Group axis="y" onReorder={setItems} values={items}>
      {items.map((item) => (
        <Item key={item} item={item} />
      ))}
    </Reorder.Group>
  );
};

export default DragDropPage;

interface Props {
  item: string;
}

const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item
      value={item}
      id={item}
      css={css`
        padding: 16px;
        background-color: #fafafa;
        color: black;
        margin-top: 8px;
        border-radius: 16px;
      `}
      style={{ boxShadow, y }}
    >
      <span>{item}</span>
    </Reorder.Item>
  );
};

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

const useRaisedShadow = (value: MotionValue<number>) => {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.onChange((latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, "0px 5px 10px rgba(0,0,0,0.1)");
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value, boxShadow]);

  return boxShadow;
};
