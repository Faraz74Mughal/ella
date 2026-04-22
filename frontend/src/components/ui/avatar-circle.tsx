import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { imageFallback } from "@/utils/heplers";

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
