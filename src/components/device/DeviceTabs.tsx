import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeviceFlash from "./DeviceFlash";
import DeviceList from "./DeviceList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import GroupChecker from "../GroupChecker";

const DeviceTabs = () => {
  const [selected, setSelected] = useState("flash");
  return (
    <Tabs
      defaultValue="flash"
      value={selected}
      onValueChange={(v) => setSelected(v)}
      className="w-full h-full flex flex-col gap-6"
    >
      <TabsList className="grid max-w-[350px] grid-cols-2">
        <GroupChecker group={["flash"]}>
          <TabsTrigger value="flash">Flash</TabsTrigger>
        </GroupChecker>
        <GroupChecker group={["deviceAdmin"]}>
          <TabsTrigger value="list">List</TabsTrigger>
        </GroupChecker>
      </TabsList>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>
            {selected == "flash" ? "Flash Device" : "List Device"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <GroupChecker group={["flash"]}>
            <TabsContent className="h-full" value="flash">
              <DeviceFlash />
            </TabsContent>
          </GroupChecker>
          <GroupChecker group={["deviceAdmin"]}>
            <TabsContent className="h-full" value="list">
              <DeviceList />
            </TabsContent>
          </GroupChecker>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default DeviceTabs;
