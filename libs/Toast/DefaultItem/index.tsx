import type { FunctionComponent, ReactNode } from "react";
import styled from "@emotion/styled";

interface Props {
  children: ReactNode;
  isShow: boolean;
}

const DefaultToastItem: FunctionComponent<Props> = ({ children, isShow }) => (
  <Container style={{ opacity: isShow ? 1 : 0 }}>{children}</Container>
);

const Container = styled.div`
  position: relative;
  display: flex;
  width: 450px;
  height: 70px;
  padding: 0 20px;
  align-items: center;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 1px solid #ccc;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  opacity: 1;
  transition: opacity 0.4s ease-out;
  &:first-of-type {
    animation: move 0.4s ease-out forwards;
  }
  &:not(:first-of-type) {
    margin-top: 8px;
  }
  @keyframes move {
    0% {
      margin-top: 80px;
    }
    100% {
      margin-top: 0;
    }
  }
`;

export default DefaultToastItem;
