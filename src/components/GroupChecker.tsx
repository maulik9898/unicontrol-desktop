import { useQuery } from "@tanstack/react-query";
import { fetchAuthSession } from "aws-amplify/auth";
import React, { ReactNode } from "react";

interface GroupCheckerProps {
  group: string[];
  children?: ReactNode;
}
const GroupChecker: React.FC<GroupCheckerProps> = ({ group, children }) => {
  const groups = useQuery({
    queryKey: ["group"],
    queryFn: async () => {
      const data = await fetchAuthSession();
      const groups =
        (data.tokens?.idToken?.payload["cognito:groups"] as string[]) || [];
      return groups;
    },
  });

  if (groups.data == undefined) {
    return <></>;
  }

  if (groups.data != undefined && !group.some((g) => groups.data.includes(g))) {
    return <></>;
  }

  return <>{children}</>;
};

export default GroupChecker;
