// Mock chart components to replace recharts during development
// This prevents build errors when recharts is not installed

export const BarChart = ({ children, ...props }: any) => (
  <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div className="text-center">
      <div className="text-2xl mb-2">📊</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">Bar Chart</div>
      <div className="text-xs text-gray-500 mt-1">Install recharts for real charts</div>
    </div>
  </div>
);

export const Bar = (props: any) => null;
export const XAxis = (props: any) => null;
export const YAxis = (props: any) => null;
export const CartesianGrid = (props: any) => null;
export const Tooltip = (props: any) => null;
export const Legend = (props: any) => null;

export const PieChart = ({ children, ...props }: any) => (
  <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div className="text-center">
      <div className="text-2xl mb-2">🥧</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">Pie Chart</div>
      <div className="text-xs text-gray-500 mt-1">Install recharts for real charts</div>
    </div>
  </div>
);

export const Pie = (props: any) => null;
export const Cell = (props: any) => null;

export const LineChart = ({ children, ...props }: any) => (
  <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div className="text-center">
      <div className="text-2xl mb-2">📈</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">Line Chart</div>
      <div className="text-xs text-gray-500 mt-1">Install recharts for real charts</div>
    </div>
  </div>
);

export const Line = (props: any) => null;

export const ResponsiveContainer = ({ children, ...props }: any) => (
  <div className="w-full h-full">
    {children}
  </div>
);