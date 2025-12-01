import { Button } from "./ui/button";
import { EnhancedButton } from "./enhanced-button";

export function BusinessBanking() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border card-hover transition-all duration-300">
      <h6 className="text-caption text-gray-600 mb-6 font-sans">Business Banking</h6>
      
      <div className="mb-6">
        <div className="text-xl text-gray-800 mb-2 leading-tight font-serif">
          You have <span className="font-semibold text-currency">$25,316.65</span> in
        </div>
        <div className="text-xl text-gray-800 mb-4 leading-tight font-serif">
          your chequing account with
        </div>
        <div className="text-xl text-gray-800 mb-6 leading-tight font-serif">
          <span className="font-semibold text-currency">$7,210.45</span> in the way.
        </div>
        
        <div className="mb-4">
          <div className="text-financial text-gray-900 mb-2">48%</div>
          <div className="text-caption font-sans text-gray-600">Increase in earnings</div>
        </div>
        
        {/* Simple chart representation */}
        <div className="h-16 flex items-end mb-6">
          <svg className="w-full h-full" viewBox="0 0 200 60">
            <path 
              d="M0,50 Q20,45 40,40 T80,35 Q100,30 120,25 T160,20 Q180,25 200,30" 
              stroke="#f59e0b" 
              strokeWidth="2" 
              fill="none"
            />
            <circle cx="160" cy="20" r="3" fill="#f59e0b" />
          </svg>
        </div>
      </div>
      
      <div className="flex gap-3">
        <EnhancedButton 
          variant="primary" 
          size="md" 
          glowEffect={true}
          floatingEffect={true}
        >
          Start a transfer
        </EnhancedButton>
        <EnhancedButton 
          variant="secondary" 
          size="md" 
          glowEffect={false}
          floatingEffect={true}
        >
          Make a deposit
        </EnhancedButton>
      </div>
    </div>
  );
}