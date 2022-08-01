import { getMember } from "~/api";
import { queryKeys } from "~/consts/react-query";
import { useCoreQuery } from "~/hooks/api/core";

const useGetMember = () => useCoreQuery(queryKeys.member, getMember);

export default useGetMember;
