import { css } from "@emotion/react";
import styled from "@emotion/styled";

const Spinner = () => <Styled />;

const Styled = styled.div`
  ${({ theme }) => css`
    border: 3px solid ${theme.colors.blue0100};
    border-top: 3px solid ${theme.colors.blue0200};
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `}
`;

const FullPage = () => (
  <Background>
    <Spinner />
  </Background>
);

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`;

Spinner.FullPage = FullPage;

export default Spinner;
