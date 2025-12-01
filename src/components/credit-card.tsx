import { Button } from "./ui/button";
import { EnhancedButton } from "./enhanced-button";

export function CreditCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border card-hover transition-all duration-300">
      <div className="mb-4">
        <h6 className="text-caption text-gray-600 mb-4 font-sans">Orbis Cashback Credit</h6>
        
        {/* Credit Card */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-6 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-600 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-600 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
          </div>
          
          {/* Card content */}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-xs text-gray-300 mb-1 font-sans font-medium tracking-wider">ORBIS</div>
                <div className="w-6 h-4 bg-white rounded opacity-80"></div>
              </div>
              <div className="text-right">
                <div className="w-8 h-6 bg-gray-600 rounded"></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-lg mb-1 font-sans font-medium">Ivy Brooks</div>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="text-financial text-white">$37,592</div>
              <div className="text-sm text-gray-400 font-sans font-normal">/ $70,000</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-3">
        <EnhancedButton 
          variant="primary" 
          size="md" 
          glowEffect={true}
          floatingEffect={true}
        >
          Pay early
        </EnhancedButton>
        <EnhancedButton 
          variant="secondary" 
          size="md" 
          glowEffect={false}
          floatingEffect={true}
        >
          View rewards
        </EnhancedButton>
      </div>
    </div>
  );
}