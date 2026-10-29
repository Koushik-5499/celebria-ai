import React, { useState, useMemo } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Phone,
  Mail,
  DollarSign,
  Edit3,
  Trash2,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Event, EventPlan, Vendor, VendorStatus } from '../../types/index'
import { formatCurrency } from '../../utils/formatters'
import { VendorStatusBadge } from '../common/Badge'
import { Modal } from '../common/Modal'
import { useEvents } from '../../context/EventContext'

interface VendorManagerTabProps {
  event: Event;
  plan?: EventPlan;
}

const VENDOR_STATUSES: VendorStatus[] = [
  'To Contact',
  'Contacted',
  'Negotiating',
  'Confirmed',
  'Completed',
];

export const VendorManagerTab: React.FC<VendorManagerTabProps> = ({ event, plan }) => {
  const { getEventVendors, addVendor, updateVendor, deleteVendor } = useEvents();

  const vendors = getEventVendors(event.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [deleteVendorId, setDeleteVendorId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Venue');
  const [formContact, setFormContact] = useState('');
  const [formEstimatedCost, setFormEstimatedCost] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<VendorStatus>('To Contact');
  const [formNotes, setFormNotes] = useState('');

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [vendors, searchQuery, statusFilter]);

  const handleOpenAdd = () => {
    setFormName('');
    setFormCategory('Venue');
    setFormContact('');
    setFormEstimatedCost(0);
    setFormStatus('To Contact');
    setFormNotes('');
    setAddModalOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    await addVendor({
      eventId: event.id,
      name: formName.trim(),
      category: formCategory.trim() || 'General',
      contact: formContact.trim() || 'Not specified',
      estimatedCost: Number(formEstimatedCost) || 0,
      status: formStatus,
      notes: formNotes.trim() || undefined,
    });

    setAddModalOpen(false);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditVendor(v);
    setFormName(v.name);
    setFormCategory(v.category);
    setFormContact(v.contact);
    setFormEstimatedCost(v.estimatedCost);
    setFormStatus(v.status);
    setFormNotes(v.notes || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVendor || !formName.trim()) return;

    await updateVendor({
      ...editVendor,
      name: formName.trim(),
      category: formCategory.trim() || 'General',
      contact: formContact.trim() || 'Not specified',
      estimatedCost: Number(formEstimatedCost) || 0,
      status: formStatus,
      notes: formNotes.trim() || undefined,
    });

    setEditVendor(null);
  };

  const handleDelete = async () => {
    if (deleteVendorId) {
      await deleteVendor(deleteVendorId);
      setDeleteVendorId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Disclaimer Alert */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-indigo-950 flex items-start gap-3.5 shadow-sm">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm">Vendor Management &amp; Inquiries</h4>
          <p className="text-xs text-indigo-900/80 leading-relaxed">
            Celebria AI provides tools to track your vendor communication, quotes, and contract progress.
            Vendors are <span className="font-bold underline">not contacted automatically</span>.
            All estimates and questions below are AI-curated guides to empower your negotiations.
          </p>
        </div>
      </div>

      {/* Main Vendor Directory Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900">Vendor Directory</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep phone numbers, quotes, and contract statuses organized.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor name or category..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
            <div className="flex gap-1.5">
              {['All', ...VENDOR_STATUSES].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vendor Cards Grid */}
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVendors.map((v) => (
              <div
                key={v.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                      {v.category}
                    </span>
                    <VendorStatusBadge status={v.status} />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-serif line-clamp-1">
                      {v.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold mt-1">
                      <span>Est: {formatCurrency(v.estimatedCost, event.currency)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{v.contact}</span>
                    </div>
                    {v.notes && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic pt-1">
                        &quot;{v.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  {/* Status Dropdown */}
                  <select
                    value={v.status}
                    onChange={(e) =>
                      updateVendor({ ...v, status: e.target.value as VendorStatus })
                    }
                    className="text-[11px] font-semibold rounded-lg border border-slate-200 px-2 py-1 bg-slate-50 focus:ring-1 focus:ring-indigo-500"
                  >
                    {VENDOR_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit vendor"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteVendorId(v.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete vendor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No vendors found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* AI Suggested Interview Questions & Vendor Ideas */}
      {plan?.vendorSuggestions && plan.vendorSuggestions.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                AI Negotiation Guide
              </span>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Recommended Questions &amp; Inquiries
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.vendorSuggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{sug.category}</span>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {sug.estimatedCostRange}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Style: {sug.recommendedType}
                </div>
                <div>
                  <h5 className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">
                    Questions to Ask:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {sug.questionsToAsk.map((q, qIdx) => (
                      <li key={qIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      <Modal
        isOpen={addModalOpen || Boolean(editVendor)}
        onClose={() => {
          setAddModalOpen(false);
          setEditVendor(null);
        }}
        title={editVendor ? 'Edit Vendor Record' : 'Add New Vendor'}
        subtitle="Manage contact information and quote terms"
      >
        <form onSubmit={editVendor ? handleSaveEdit : handleSaveAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vendor Name / Company *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Royal Banquet Lawns, DJ Rohit, Spice Caterers..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <input
                type="text"
                required
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. Venue, Catering, Photography, Decor"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as VendorStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
              >
                {VENDOR_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Info (Phone/Email)</label>
              <input
                type="text"
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                placeholder="+91 98765 43210 / name@vendor.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estimated Cost ({event.currency})
              </label>
              <input
                type="number"
                min="0"
                value={formEstimatedCost}
                onChange={(e) => setFormEstimatedCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notes / Terms</label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. Deposit requirement, curfew time, equipment included"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setAddModalOpen(false);
                setEditVendor(null);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {editVendor ? 'Update Vendor' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Vendor Modal */}
      <Modal
        isOpen={Boolean(deleteVendorId)}
        onClose={() => setDeleteVendorId(null)}
        title="Delete Vendor Record"
        subtitle="Remove this vendor from your planner"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to remove this vendor record?
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setDeleteVendorId(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
