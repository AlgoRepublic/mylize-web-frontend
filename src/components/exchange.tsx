import { MoreHorizontal, ArrowUpDown } from "lucide-react";

export function Exchange() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border card-hover transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-card-title text-gray-800 font-serif">Exchange</h4>
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* You send */}
      <div className="mb-4">
        <div className="text-caption font-sans text-gray-600 mb-2">You send</div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-financial text-gray-900">15.500</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-sans font-medium text-currency">Balance: $25,316.65</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-sans font-semibold">USD</span>
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">🇺🇸</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exchange icon */}
      <div className="flex justify-center mb-4">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
      
      {/* You receive */}
      <div className="mb-6">
        <div className="text-caption font-sans text-gray-600 mb-2">You receive</div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-financial text-gray-900">3.8943749</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-sans font-medium text-currency">Available: $2,251 ETH</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-sans font-semibold">ETH</span>
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">Ξ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rate */}
      <div className="text-sm text-gray-500">
        <div className="text-caption font-sans text-gray-600 mb-1">Rate</div>
        <div className="font-sans font-medium text-currency">1 ETH = 3,682.93 USD</div>
      </div>
    </div>
  );
}