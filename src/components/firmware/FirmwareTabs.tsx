import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FirmwareUpload from "./FirmwareUpload";
import FirmwareList from "./FirmwareList";
import { useState } from "react";

const FirmwareTabs = () => {
  const [selected, setSelected] = useState("upload");
  return (
    <Tabs
      defaultValue="flash"
      value={selected}
      onValueChange={(v) => setSelected(v)}
      className="w-full h-full flex flex-col gap-6"
    >
      <TabsList className="grid w-[350px] grid-cols-2">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="list">List</TabsTrigger>
      </TabsList>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>
            {selected == "upload" ? "Upload Firmware" : "List Firmware"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <TabsContent className="h-full" value="upload">
            <FirmwareUpload />
          </TabsContent>
          <TabsContent className="h-full" value="list">
            <FirmwareList />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default FirmwareTabs;
