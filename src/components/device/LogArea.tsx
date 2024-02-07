import { useDeviceStore } from "@/store";

const LogArea = () => {
  const logs = useDeviceStore((state) => state.logs);

  return (
    <div
      className={`h-full overflow-y-auto  border p-4 rounded flex flex-col gap-1 `}
    >
      {Array.from(logs.entries()).map(([key, value]) => {
        return (
          <pre
            className={
              value.type == "ERROR"
                ? "text-destructive"
                : "text-primary"
            }
            key={key}
          >
            {value.message}
          </pre>
        );
      })}
    </div>
  );
};

export default LogArea;
