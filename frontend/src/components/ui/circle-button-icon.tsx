import React from "react";
import { Button } from "./button";
import { Badge } from "./badge";

interface CircleButtonIconProps {
  count?: number;
  Icon?: React.ComponentType<{ className?: string }>;
}

const CircleButtonIcon = ({ count, Icon }: CircleButtonIconProps) => {
  return (
    <Button className="relative rounded-full" size="icon" variant="outline">
      {Icon && <Icon />}
      <Badge className="bg-primary absolute  top-0 right-0 min-w-5.5 translate-x-1/2 -translate-y-1/2 px-1">
        {count ?? 0}
      </Badge>
    </Button>
  );
};

export default CircleButtonIcon;
