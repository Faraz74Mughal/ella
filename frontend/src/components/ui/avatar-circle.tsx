import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { imageFallback } from "@/utils/helpers";

interface AvatarCircleProps{
    src?:string,
    name?:string
}   

const AvatarCircle = ({src,name}:AvatarCircleProps) => {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{imageFallback(name)}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarCircle;
