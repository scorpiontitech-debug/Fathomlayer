"use client";

import { useState } from "react";
import { approveSubmission, rejectSubmission } from "@/app/admin/actions";
import { Check, X } from "lucide-react";

export function ReviewForm({ submission, categories }: { submission: any, categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: submission.name,
    slug: submission.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: submission.description,
    website_url: submission.website_url,
    category_id: categories.length > 0 ? categories[0].id : "",
    pricing_model: "paid",
  });

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveSubmission(submission.id, formData);
      setIsOpen(false);
    } catch (e) {
      alert("Failed to approve");
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this submission?")) return;
    setLoading(true);
    try {
      await rejectSubmission(submission.id);
    } catch (e) {
      alert("Failed to reject");
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <div className="flex items-center justify-between p-4 border border-edge rounded-lg bg-surface">
        <div>
          <h3 className="font-semibold text-ink">{submission.name}</h3>
          <p className="text-sm text-dim">{submission.website_url}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsOpen(true)} className="px-3 py-1 bg-ink text-surface rounded-md text-sm">
            Review
          </button>
          <button onClick={handleReject} className="px-3 py-1 bg-red-500/10 text-red-600 rounded-md text-sm">
            Reject
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-accent rounded-lg bg-surface space-y-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-ink">Reviewing: {submission.name}</h3>
        <button onClick={() => setIsOpen(false)} className="text-dim hover:text-ink"><X className="h-5 w-5" /></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-dim">Name</label>
          <input className="w-full border border-edge rounded p-2 text-sm bg-surface" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-dim">Slug</label>
          <input className="w-full border border-edge rounded p-2 text-sm bg-surface" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-dim">Description</label>
        <textarea className="w-full border border-edge rounded p-2 text-sm bg-surface" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-dim">Website URL</label>
        <input className="w-full border border-edge rounded p-2 text-sm bg-surface" value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-dim">Category</label>
          <select className="w-full border border-edge rounded p-2 text-sm bg-surface" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-dim">Pricing</label>
          <select className="w-full border border-edge rounded p-2 text-sm bg-surface" value={formData.pricing_model} onChange={e => setFormData({...formData, pricing_model: e.target.value})}>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="open_source">Open Source</option>
            <option value="contact">Contact</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={handleApprove} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-accent text-surface font-medium rounded-lg disabled:opacity-50 hover:bg-accent/90">
          <Check className="h-4 w-4" />
          {loading ? "Approving..." : "Approve & Publish"}
        </button>
      </div>
    </div>
  );
}
