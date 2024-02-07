import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeviceFlash from "./DeviceFlash";
import DeviceList from "./DeviceList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DeviceTabs = () => {
  return (
    <Tabs defaultValue="flash" className="w-full h-full flex flex-col gap-6">
      <TabsList className="grid w-[350px] grid-cols-2">
        <TabsTrigger value="flash">Flash</TabsTrigger>
        <TabsTrigger value="list">List</TabsTrigger>
      </TabsList>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Flash Device</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <TabsContent className="h-full" value="flash">
            <DeviceFlash />
          </TabsContent>
          <TabsContent className="h-full" value="list">
            <DeviceList />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default DeviceTabs;
