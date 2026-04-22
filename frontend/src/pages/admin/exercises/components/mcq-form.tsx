import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Mcq {
  question: string;
  options: string[];
  correctIndex: number | string|null;
}

const McqForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [mcqs, setMcqs] = useState<Mcq[]>([]);

  // handle option change
  const handleOptionChange = (value: string, index: number) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  // add MCQ
  const addHandler = () => {
    if (!question || correctIndex === null) return;

    setMcqs((prev) => [
      ...prev,
      { question, options, correctIndex: options[correctIndex] },
    ]);

    // reset form
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(null);
  };

  return (
    <div className="mt-5 space-y-4">
      <h2 className="text-lg font-semibold">MCQ Management</h2>

      {/* Question */}
      <div>
        <Label>Question</Label>
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((opt, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Option {index + 1}</Label>

              <div className="flex items-center gap-1 text-xs">
                <input
                  type="radio"
                  name="correct"
                  checked={correctIndex === index}
                  onChange={() => setCorrectIndex(index)}
                />
                <span>Answer</span>
              </div>
            </div>

            <Input
              value={opt}
              onChange={(e) =>
                handleOptionChange(e.target.value, index)
              }
            />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="text-right">
        <Button type="button" onClick={addHandler}>Add</Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Options</TableHead>
            <TableHead>Answer</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {mcqs.map((mcq, i) => (
            <TableRow key={i}>
              <TableHead>{mcq.question}</TableHead>

              <TableHead>
                {mcq.options.map((opt, idx) => (
                  <div key={idx}>
                    {idx + 1}. {opt}
                  </div>
                ))}
              </TableHead>

              <TableHead>
                {mcq.correctIndex !== null &&
                  ` ${mcq.correctIndex }`}
              </TableHead>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default McqForm;