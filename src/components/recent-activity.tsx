import { Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "received",
      from: "Dominic Fletcher",
      action: "Receiving",
      amount: "+ $2,500",
      date: "Dec 16",
      time: "Dec 16",
      icon: ArrowDownLeft,
      positive: true
    },
    {
      id: 2,
      type: "sent",
      to: "Sebastian Turner",
      action: "Sending",
      amount: "- $12,423",
      date: "Dec 16",
      time: "Dec 16",
      icon: ArrowUpRight,
      positive: false
    },
    {
      id: 3,
      type: "sent",
      to: "Theodore Hawkins",
      action: "Sending",
      amount: "- $19,567",
      date: "Dec 15",
      time: "Dec 15",
      icon: ArrowUpRight,
      positive: false
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border card-hover transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-card-title text-gray-800 font-serif">Recent activity</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-sans font-medium">Week</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div className="text-caption font-sans text-gray-500 mb-6">10 - 16 Dec 2024</div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-sans font-medium">From {activity.from || activity.to}</span>
              </div>
              <div className="text-xs text-gray-500 font-sans uppercase tracking-wide">{activity.action}</div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm font-sans font-semibold text-currency ${activity.positive ? 'text-green-600' : 'text-gray-800'}`}>
                {activity.amount}
              </div>
              <div className="text-xs text-gray-500 font-sans font-normal">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}