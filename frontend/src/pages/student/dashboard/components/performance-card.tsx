import React from "react";

const colors:any = {
  grammar: "bg-green-500 text-green-600",
  listening: "bg-yellow-500 text-yellow-600",
  speaking: "bg-indigo-500 text-indigo-600",
  writing: "bg-pink-500 text-pink-600",
};

const PerformanceCard = ({ performance }: any) => {
  console.log("performance", performance);

  return (
    <section className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
      <h3 className="font-black text-slate-800 mb-6">Your Performance</h3>
      <div className="space-y-6">
        {Object.entries(performance).map(([key, value]: any) => {
          if (key == "vocabulary") return null;
          const [barColor, textColor] = colors[key]?.split(" ") || [
            "bg-gray-500",
            "text-gray-600",
          ];
          return (
            <div key={key}>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-400 uppercase">{key}</span>
                <span className={textColor}>{value}%</span>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`${barColor} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      {/* <div className="mt-8 pt-6 border-t border-slate-100">
        <button className="w-full py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
          View Detailed Analytics
        </button>
      </div> */}
    </section>
  );
};

export default PerformanceCard;
