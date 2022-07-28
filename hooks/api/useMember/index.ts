import { useQuery } from "react-query";
import { getMember } from "~/api/member";

const useGetMember = () => useQuery("member", getMember);

export default useGetMember;
