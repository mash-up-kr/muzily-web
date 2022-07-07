import { useLocalStorage } from "~/hooks/commons";

const tokenKey = process.env.NEXT_PUBLIC_LOCAL_TOKEN_KEY as string;
export default () => useLocalStorage(tokenKey, "");
