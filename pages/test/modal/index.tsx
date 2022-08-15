import type { ComponentProps } from "react";
import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Layout, Spacer, Modal } from "~/components/uis";
import { showModal } from "~/components/uis/Modal";

const ModalTestPage = () => {
  const handleConfirm = async () => {
    const awaitedText = await getAsyncText();
    console.log(awaitedText);
  };

  const handleClickFunctionalModal = () =>
    showModal(({ createClose }) => {
      const close = createClose();
      const closeAfterAsync = createClose<typeof LoadingButton>(getAsyncText, {
        onFailure: (error) => {
          console.log("onFailure", error);
        },
        onSuccess: () => {
          console.log("onSuccess");
        },
        onClosed: () => {
          console.log("onClosed");
        },
      });

      return (
        <S.Modal>
          <Spacer
            type="horizontal"
            justify="space-between"
            gap={8}
            style={{ flex: 1 }}
          >
            <LoadingButton {...close()}>
              그냥 닫고 백그라운드 비동기 처리
            </LoadingButton>
            <LoadingButton
              {...closeAfterAsync("onClick", ({ isLoading }) => ({
                loading: isLoading,
                disabled: isLoading,
              }))}
            >
              비동기 처리
            </LoadingButton>
          </Spacer>
        </S.Modal>
      );
    });

  return (
    <Layout>
      <Spacer type="vertical" gap={16} style={{ marginTop: 32 }}>
        {/* 1. 함수형 모달 */}
        <LoadingButton onClick={handleClickFunctionalModal}>
          open modal
        </LoadingButton>

        {/* 2. 컴포넌트 형 모달 */}
        <Modal
          trigger={
            <Modal.Open
              as={LoadingButton}
              onClick={() => console.log("모달 1 열기")}
            >
              모달 1 열기 (비동기 처리 기다리고 닫기)
            </Modal.Open>
          }
          modal={
            <S.Modal>
              <Spacer type="vertical" gap={12}>
                <h1>비동기처리를 기다리고 닫기</h1>
                <Modal.Close
                  as={LoadingButton}
                  waitInjectToAs={(loading) => ({ loading, disabled: loading })}
                  onClick={handleConfirm}
                >
                  Modal.Close.waitOnClick: true (DEFAULT)
                </Modal.Close>
              </Spacer>
            </S.Modal>
          }
        />
        <Modal
          trigger={({ open }) => (
            <LoadingButton onClick={open}>
              모달 2 열기 (비동기 처리 기다리지 않고 닫기)
            </LoadingButton>
          )}
          modal={
            <S.Modal>
              <Spacer type="vertical" gap={12}>
                <h1>비동기처리 전이라도 일단 닫기</h1>
                <Modal.Close as={LoadingButton} onClick={handleConfirm}>
                  Modal.Close.waitOnClick: false
                </Modal.Close>
                <Modal
                  trigger={
                    <Modal.Open
                      as={LoadingButton}
                      onClick={() => console.log("모달 1 열기")}
                    >
                      모달 1 열기 (비동기 처리 기다리고 닫기)
                    </Modal.Open>
                  }
                  modal={
                    <S.Modal>
                      <Spacer type="vertical" gap={12}>
                        <h1>비동기처리를 기다리고 닫기</h1>
                        <Modal.Close
                          as={LoadingButton}
                          waitInjectToAs={(loading) => ({
                            loading,
                            disabled: loading,
                          })}
                          onClick={handleConfirm}
                        >
                          Modal.Close.waitOnClick: true (DEFAULT)
                        </Modal.Close>
                      </Spacer>
                    </S.Modal>
                  }
                />
              </Spacer>
            </S.Modal>
          }
        />
      </Spacer>
    </Layout>
  );
};

export default ModalTestPage;

const LoadingButton = ({
  loading = false,
  children,
  ...props
}: ComponentProps<"button"> & { loading?: boolean }) => {
  return (
    <S.Button {...props}>
      <Spacer gap={8} align="center">
        {loading && <S.Spinner />}
        {children}
      </Spacer>
    </S.Button>
  );
};

const S = {
  Button: styled.button`
    ${({ theme }) => css`
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background-color: ${theme.colors.blue0500};
      height: 40px;
      padding: 18px;
      border-radius: 16px;
      border: none;
      cursor: pointer;

      &:hover {
        opacity: 0.85;
      }

      &:disabled {
        cursor: not-allowed;
        filter: contrast(0.8);
      }

      transition: 0.2s opacity;
    `}
  `,

  Modal: styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 500px;
    margin: 16px;
    padding: 16px;
    background-color: white;
    box-shadow: 0px 16px 32px -16px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
  `,

  Spinner: styled.div`
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
  `,
};

const getAsyncText = async (text = "비동기처리 성공", ms = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(text);
    }, ms);
  });
};
