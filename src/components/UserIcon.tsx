import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { LogOut } from "lucide-react";

const createInitials = (name: string) => {
  return name
    .split(" ")
    .map((str) => str[0])
    .join("");
};

const UserIcon = () => {
  const userData = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await fetchUserAttributes();
      return user;
    },
  });
  return (
    <div className="flex items-center justify-between space-x-2">
      {userData.data && (
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarFallback>
              {createInitials(userData.data.name || userData.data.email!)}
            </AvatarFallback>
          </Avatar>
          <div>
            {userData.data.name && (
              <p className="text-sm font-medium leading-none">
                {userData.data.name}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {userData.data.email}
            </p>
          </div>
        </div>
      )}
      <div>
        <Button onClick={() => signOut()} variant="outline" size="icon">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserIcon;
