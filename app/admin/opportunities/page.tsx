"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Loader2 } from "lucide-react";

type Opp = {
  id: string; title: string; category: string; funder: string | null;
  value: string | null; deadline: string | null; is_published: boolean;
  is_featured: boolean; target_level: string; apply_url: string; body: string;
};

const CATEGORIES = ["grant","fellowship","conference","speaking","collaboration","job","award","other"];
const LEVELS     = ["all","early_career","mid","senior"];

const EMPTY: Omit<Opp,"id"> = {
  title:"", category:"grant", funder:"", value:"", deadline:"",
  is_published:false, is_featured:false, target_level:"all", apply_url:"", body:"",
};

export default function AdminOpportunitiesPage() {
  const [opps,    setOpps]    = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState<Omit<Opp,"id"> | null>(null);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string|null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/opportunities");
    if (res.ok) setOpps(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!form) return;
    setSaving(true); setError(null);
    const res = await fetch("/api/admin/opportunities" + (editId ? `/${editId}` : ""), {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { setError((await res.json()).error ?? "Save failed"); setSaving(false); return; }
    await load(); setForm(null); setEditId(null); setSaving(false);
  }

  async function toggle(id: string, field: "is_published"|"is_featured", current: boolean) {
    await fetch(`/api/admin/opportunities/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !current }),
    });
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this opportunity?")) return;
    await fetch(`/api/admin/opportunities/${id}`, { method: "DELETE" });
    load();
  }

  const F = form;
  const set = (k: string, v: unknown) => setForm((p) => p ? { ...p, [k]: v } : p);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>Admin › Opportunities</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>Research Opportunities</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{opps.length} total · {opps.filter(o=>o.is_published).length} published</p>
        </div>
        <button onClick={() => { setForm({...EMPTY}); setEditId(null); }}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: "#2563EB" }}>
          <Plus className="h-4 w-4" /> Add Opportunity
        </button>
      </div>

      {/* Form modal */}
      {F && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-2xl rounded-2xl border p-6 overflow-y-auto max-h-[90vh]" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <h2 className="text-lg font-bold mb-6" style={{ color: "#F9FAFB" }}>{editId ? "Edit" : "Add"} Opportunity</h2>
            <div className="space-y-4">
              {[
                { label:"Title *",       key:"title",   type:"text",  placeholder:"e.g. TWAS Research Grant for Sub-Saharan Africa" },
                { label:"Funder",        key:"funder",  type:"text",  placeholder:"e.g. TWAS, Wellcome Trust, NRF" },
                { label:"Value",         key:"value",   type:"text",  placeholder:"e.g. $50,000 / Travel funded" },
                { label:"Apply URL *",   key:"apply_url",type:"url",  placeholder:"https://..." },
                { label:"Deadline",      key:"deadline",type:"date",  placeholder:"" },
              ].map(({label,key,type,placeholder}) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>{label}</label>
                  <input type={type} value={(F as unknown as Record<string,string>)[key] ?? ""} placeholder={placeholder}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none"
                    style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }} />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>Category</label>
                  <select value={F.category} onChange={(e) => set("category", e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none"
                    style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1).replace("_"," ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>Target Level</label>
                  <select value={F.target_level} onChange={(e) => set("target_level", e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none"
                    style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}>
                    {LEVELS.map(l => <option key={l} value={l}>{l === "all" ? "All levels" : l.replace("_"," ")}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>Description *</label>
                <textarea rows={4} value={F.body} onChange={(e) => set("body", e.target.value)}
                  placeholder="Brief description of the opportunity, eligibility, and what's included..."
                  className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none resize-none"
                  style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }} />
              </div>

              <div className="flex gap-6">
                {(["is_published","is_featured"] as const).map(k => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={F[k] as boolean} onChange={(e) => set(k, e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-sm" style={{ color: "#9CA3AF" }}>{k === "is_published" ? "Published" : "Featured"}</span>
                  </label>
                ))}
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={save} disabled={saving}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: "#2563EB" }}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save"}
                </button>
                <button onClick={() => { setForm(null); setEditId(null); }}
                  className="rounded-xl px-4 py-2.5 text-sm border"
                  style={{ borderColor: "#1E293B", color: "#6B7280" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto" style={{ color: "#2563EB" }} /></div>
      ) : opps.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <p className="text-sm" style={{ color: "#4B5563" }}>No opportunities yet. Add the first one.</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase" style={{ borderColor: "#1E293B", color: "#4B5563" }}>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Deadline</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {opps.map((o) => (
                <tr key={o.id} className="border-b" style={{ borderColor: "#1E293B" }}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-xs" style={{ color: "#F9FAFB" }}>{o.title}</p>
                    {o.funder && <p className="text-[11px] mt-0.5" style={{ color: "#4B5563" }}>{o.funder}</p>}
                  </td>
                  <td className="px-5 py-4 text-xs capitalize" style={{ color: "#9CA3AF" }}>{o.category}</td>
                  <td className="px-5 py-4 text-xs" style={{ color: "#6B7280" }}>{o.deadline ?? "Rolling"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => toggle(o.id,"is_published",o.is_published)} title={o.is_published?"Unpublish":"Publish"}>
                        {o.is_published ? <Eye className="h-4 w-4" style={{color:"#10B981"}} /> : <EyeOff className="h-4 w-4" style={{color:"#4B5563"}} />}
                      </button>
                      <button onClick={() => toggle(o.id,"is_featured",o.is_featured)} title={o.is_featured?"Unfeature":"Feature"}>
                        <Star className="h-4 w-4" style={{color: o.is_featured ? "#F59E0B" : "#4B5563"}} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setForm({title:o.title,category:o.category,funder:o.funder??"",value:o.value??"",deadline:o.deadline??"",is_published:o.is_published,is_featured:o.is_featured,target_level:o.target_level,apply_url:o.apply_url,body:o.body}); setEditId(o.id); }}>
                        <Pencil className="h-3.5 w-3.5" style={{color:"#6B7280"}} />
                      </button>
                      <button onClick={() => del(o.id)}>
                        <Trash2 className="h-3.5 w-3.5" style={{color:"#F87171"}} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
