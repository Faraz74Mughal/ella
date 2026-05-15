const StatCard = ({ stat }:any) => (
  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${stat.bg}`}>
        <stat.icon size={20} className={stat.color} />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
    <p className="text-sm text-slate-500">{stat.label}</p>
  </div>
);

export default StatCard;