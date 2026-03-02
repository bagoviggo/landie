import { updateMaintenanceStatus, deleteMaintenanceRequest } from '@/app/lib/actions';
import { TrashIcon } from '@heroicons/react/24/outline';

export function StatusButtons({ id, status }: { id: string; status: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {status !== 'open' && (
        <form action={updateMaintenanceStatus.bind(null, id, 'open')}>
          <button
            type="submit"
            className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50"
          >
            Mark Open
          </button>
        </form>
      )}
      {status !== 'in_progress' && (
        <form action={updateMaintenanceStatus.bind(null, id, 'in_progress')}>
          <button
            type="submit"
            className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-700 transition-colors hover:bg-amber-100"
          >
            In Progress
          </button>
        </form>
      )}
      {status !== 'resolved' && (
        <form action={updateMaintenanceStatus.bind(null, id, 'resolved')}>
          <button
            type="submit"
            className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs text-green-700 transition-colors hover:bg-green-100"
          >
            Resolve
          </button>
        </form>
      )}
    </div>
  );
}

export function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteMaintenanceRequest.bind(null, id)}>
      <button
        type="submit"
        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
