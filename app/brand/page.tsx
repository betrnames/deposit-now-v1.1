import { NodeExchangeIcon } from '@/components/icons';

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Brand Kit</h1>
          <p className="text-slate-600">High-resolution logo for media and press</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 flex items-center justify-center">
          <div className="bg-slate-900 rounded-xl p-16 inline-block">
            <NodeExchangeIcon size={800} className="text-white" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
            <NodeExchangeIcon size={200} className="text-slate-900" />
          </div>
          <div className="bg-slate-900 rounded-lg shadow p-6 flex items-center justify-center">
            <NodeExchangeIcon size={200} className="text-white" />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>800x800px • SVG Format • Scalable</p>
        </div>
      </div>
    </div>
  );
}
