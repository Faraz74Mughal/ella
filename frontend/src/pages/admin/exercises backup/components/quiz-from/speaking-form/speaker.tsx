import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSpeakingDialogueBuilder } from "@/hooks/use-speaking-dialogue-builder";
import { Plus, UserCircle, Users, XCircle } from "lucide-react";

const Speaker = () => {
  const { speakers, newSpeaker, setNewSpeaker, addSpeaker, removeSpeaker } =
    useSpeakingDialogueBuilder();

  return (
    <>
      <div className="space-y-3">
        <Label className="text-slate-700 font-semibold flex items-center gap-2">
          <Users className="w-4 h-4" />
          Speakers
        </Label>
        <div className="flex flex-wrap gap-2">
          {speakers.map((speaker, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="px-2  py-3 flex items-center bg-slate-100 text-slate-700"
            >
              <UserCircle className="w-3 h-3 mr-1" />
              {speaker}
              {/* {speakers.length > 2 && ( */}
              <div className=" cursor-pointer p-2 rounded ">
                <XCircle
                  className="w-3 h-3  cursor-pointer hover:text-red-600"
                  onClick={() => removeSpeaker(speaker)}
                />
              </div>
              {/* )} */}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newSpeaker}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewSpeaker(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSpeaker();
              }
            }}
            placeholder="Add New Speaker (e.g., Waiter, Customer)"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addSpeaker}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Speaker;
